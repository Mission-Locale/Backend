import database from "../databases/database.js";
import microsoftService from "./MicrosoftService.js";
import { isBefore, addMinutes } from "date-fns";

class AppointmentRepository {
  /* Create Appointment */
  async create(data) {
    const status = isBefore(
      addMinutes(data.startTime, data.duration),
      Date.now()
    )
      ? "MISSED"
      : "PENDING";

    try {
      const appointment = await database.appointment.create({
        data: {
          startTime: data.startTime,
          duration: data.duration,
          advisor_id: data.advisor_id,
          job_seeker_id: data.job_seeker_id,
          state: status,
        },
        include: {
          advisor: { include: { user: true } },
          job_seeker: { include: { user: true } },
        },
      });

      try {
        await microsoftService.addAppointment(appointment);
      } catch (err) {
        console.error(err) //TODO: logs/notify microsoft errors
      }
      

      return appointment;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async update(appointementId, newState, advisorId = undefined) {
    try {
      return await database.appointment.update({
        where: {
          id: appointementId,
        },
        data: {
          state: newState,
          advisor_id: advisorId,
        },
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async delete(appointementId) {
    try {
      await database.appointment.delete({
        where: {
          id: appointementId,
        },
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async get(appointementId) {
    try {
      return await database.appointment.findUnique({
        where: { appointment_id: appointementId },
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async getAll(
    advisorId = undefined,
    jobSeekerId = undefined,
    from = undefined,
    to = undefined
  ) {
    if (advisorId === undefined && jobSeekerId === undefined) {
      throw {
        error: "The Advisor or the JobSeeker need to be defined or null",
      };
    }

    try {
      return await database.appointment.findMany({
        where: {
          advisor_id: advisorId,
          job_seeker_id: jobSeekerId,
          startTime: { lt: to, gte: from }, // TODO: rework model, remove duration and add endTime to improve filtering
        },
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}

export default new AppointmentRepository();
