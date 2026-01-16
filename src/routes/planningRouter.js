import { Router } from "express";
import MicrosoftService from "../repositories/MicrosoftService.js";
import AppointmentRepository from "../repositories/AppointmentRepository.js";
import WorkshopRepository from "../repositories/WorkshopRepository.js";
import authGuard from "../middlewares/authguard.js";
import adminGuard from "../middlewares/adminguard.js";
import { addMinutes } from "date-fns";

function mapAppointmentToCalendarEvent(appointment) {
  return {
    id: appointment.appointment_id,
    timeZone: "UTC",
    start: appointment.startTime,
    end: addMinutes(appointment.startTime, appointment.duration),
    title: "Rendez-vous", // TODO add names
    color: "blue",
  };
}

function mapWorkshopReccurenceToCalendarEvent(workshopReccurence) {
  return {
    id: workshopReccurence.workshop_recurrence_id,
    timeZone: "UTC",
    start: workshopIteration.startTime,
    end: addMinutes(workshopIteration.startTime, workshopIteration.duration),
    title: workshopIteration.topic,
    color: "purple",
  };
}

async function getAppointmentAndWorkshopForJobSeeker(
  jobSeekerId,
  from = undefined,
  to = undefined
) {
  const events = [
    ...(
      await AppointmentRepository.getAll(undefined, jobSeekerId, from, to)
    ).map(mapAppointmentToCalendarEvent),
    ...(
      await WorkshopRepository.findMany(undefined, jobSeekerId, from, to)
    ).map(mapWorkshopReccurenceToCalendarEvent),
  ];
}

async function getAppointmentAndWorkshopForAdvisor(
  advisorId,
  from = undefined,
  to = undefined
) {
  const events = [
    ...(await AppointmentRepository.getAll(advisorId, undefined, from, to)).map(
      mapAppointmentToCalendarEvent
    ),
    ...(await WorkshopRepository.findMany(advisorId, undefined, from, to)).map(
      mapWorkshopReccurenceToCalendarEvent
    ),
  ];
}

const planningRouter = Router()
  .get("/planning/registration", authGuard, adminGuard, async (req, res) => {
    return res.json(
      (await AppointmentRepository.getAll(null, undefined, new Date())).map(
        mapAppointmentToCalendarEvent
      )
    );
  })
  .get("/planning/me", authGuard, async (req, res) => {
    switch (req.user.roleType) {
      case "JOB_SEEKER":
        return res.json(
          await getAppointmentAndWorkshopForJobSeeker(
            req.user.jobSeeker.job_seeker_id
          )
        );
      case "ADVISOR":
        return res.json(
          await getAppointmentAndWorkshopForAdvisor(req.user.advisor.advisor_id)
        );
      case "ADMINISTRATOR":
        return res.json(
          (await AppointmentRepository.getAll(null, undefined)).map(
            mapAppointmentToCalendarEvent
          )
        );
      default:
        return res
          .status(403)
          .json({ error: "Unauthorized for this resource" });
    }
  })
  .get(
    "/planning/advisor/:advisorId",
    authGuard,
    adminGuard,
    async (req, res) => {
      return res.json(
        await getAppointmentAndWorkshopForAdvisor(req.params.advisorId)
      );
    }
  )
  .get(
    "/planning/job-seeker/:jobSeeker",
    authGuard,
    adminGuard,
    async (req, res) => {
      return res.json(
        await getAppointmentAndWorkshopForJobSeeker(req.params.jobSeeker)
      );
    }
  )
  .get("/planning/free-appointments", async (req, res) => {
    const { start, end, duration } = req.query;
    if (!start || !end || !duration) {
      return res.status(400).json({ error: "Missing parameters." });
    }

    try {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const response = await MicrosoftService.getRegistrationSchedule(
        startDate,
        endDate,
        duration
      );

      const view = response.value[0]?.availabilityView;
      if (!view)
        return res.status(500).json({ error: "No availability data." });
      
      const workingHours = response.value[0]?.workingHours;

      const availableSlots = [];
      for (let i = 0; i < view.length; i++) {
        if (view[i] === "0") {
          const slotStart = new Date(
            startDate.getTime() + i * duration * 60 * 1000
          );
          availableSlots.push({
            date: slotStart.toISOString().split("T")[0],
            hour: slotStart.toTimeString().slice(0, 5),
          });
        }
      }

      return res.json({ data: availableSlots, workingHours: workingHours });
    } catch (err) {
      console.error("Error in /free-appointment:", err);
      return res.status(500).json({ error: "Internal error" });
    }
  });
export default planningRouter;
