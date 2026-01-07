import { Router } from "express";
import MicrosoftService from "../repositories/MicrosoftService.js";
import AppointmentRepository from "../repositories/AppointmentRepository.js";
import authGuard from "../middlewares/authguard.js";

const planningRouter = Router()
  .use(authGuard)
  .get("/planning/registration", async (req, res) => {
    // TODO map to calendar events ?
    return res.json(AppointmentRepository.getAll(null, undefined, Date.now()));
  })
  .get("/planning/advisor/:advisorId", async (req, res) => {
    // TODO get workshops and map to calendar events
    return res.json(AppointmentRepository.getAll(req.params.advisorId));
  })
  .get("/planning/job-seeker/:jobSeeker", async (req, res) => {
    // TODO get workshops and map to calendar events
    return res.json(
      AppointmentRepository.getAll(undefined, req.params.jobSeeker)
    );
  })
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

      return res.json({ data: availableSlots });
    } catch (err) {
      console.error("Error in /free-appointment:", err);
      return res.status(500).json({ error: "Internal error" });
    }
  });
export default planningRouter;
