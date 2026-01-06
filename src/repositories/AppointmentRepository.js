import database from "../databases/database.js";
import microsoftService from "./MicrosoftService.js";

class AppointmentRepository {
  /* Create Appointment */
  async create(data) {
    const status = isBefore(
      addMinutes(appointment.startTime, appointment.duration),
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

      await microsoftService.addAppointment(appointment);

      return appointment;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async update(appointementId, newState, advisorId = undefined) {
    await database.appointment.update({
      where: {
        id: appointementId,
      },
      data: {
        state: newState,
        advisor_id: advisorId,
      },
    });
  }

  async getAll(
    advisorId = undefined,
    jobSeekerId = undefined,
    from = undefined,
    to = undefined
  ) {
    if (advisorId == undefined && jobSeekerId == undefined) {
      throw {
        error: "The Advisor or the JobSeeker need to be defined or null",
      };
    }

    try {
      return await database.appointment.findMany({
        where: {
          advisor_id: advisorId,
          job_seeker_id: jobSeekerId,
          startTime: { gte: from, lt: to },
        },
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}

export default new AppointmentRepository();
