import database from "../databases/database.js";
import microsoftService from "./MicrosoftService.js";
import { addMinutes } from "date-fns";

class AppointmentRepository {
  /* Create Appointment */
  async create(startTime, duration, job_seeker_id, advisor_id = undefined) {
    try {
      const appointment = await database.appointment.create({
        data: {
          startTime: startTime,
          endTime: addMinutes(startTime, duration),
          job_seeker_id: job_seeker_id,
          advisor_id: advisor_id,
        },
        include: {
          advisor: {
            include: {
              user: { select: { first_name: true, last_name: true } },
            },
          },
          job_seeker: {
            include: {
              user: { select: { first_name: true, last_name: true } },
            },
          },
        },
      });

      try {
        await microsoftService.addAppointment(appointment);
      } catch (err) {
        console.warn(err); //TODO: logs/notify microsoft errors
      }

      return appointment;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async updateCancellation(appointementId, isCancelled = true) {
    try {
      return await database.appointment.update({
        where: {
          appointment_id: appointementId,
        },
        data: {
          cancelled: isCancelled,
        },
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async updateAdvisor(appointementId, advisorId) {
    try {
      return await database.appointment.update({
        where: {
          appointment_id: appointementId,
        },
        data: {
          advisor_id: advisorId,
        },
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async updateTime(appointementId, startTime, duration) {
    try {
      return await database.appointment.update({
        where: {
          appointment_id: appointementId,
        },
        data: {
          startTime: startTime,
          endTime: addMinutes(startTime, duration),
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
        include: {
          advisor: {
            include: {
              user: { select: { first_name: true, last_name: true } },
            },
          },
          job_seeker: {
            include: {
              user: { select: { first_name: true, last_name: true } },
            },
          },
        },
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
    to = undefined,
    ignoreCancelled = true,
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
          startTime: { lt: to },
          endTime: { gte: from },
          cancelled: ignoreCancelled ? false : undefined,
        },
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}

export default new AppointmentRepository();
