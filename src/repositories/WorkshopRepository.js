import { addMinutes } from "date-fns";
import database from "../databases/database.js";

class WorkshopRepository {
  db = database;

  /* Create workshop */
  async create(title, description, cardImagePath, backgroundImagePath) {
    try {
      return await this.db.workshop.create({
        data: { title, description, cardImagePath, backgroundImagePath },
      });
    } catch (err) {
      console.error(err);
      throw { error: err };
    }
  }

  /* Create workshop with event */
  async createWithRecurrence(
    title,
    description,
    cardImagePath,
    backgroundImagePath,
    topic,
    topicDescription,
    startTime,
    duration,
    maxOccupation,
  ) {
    try {
      return await this.db.workshop.create({
        data: {
          title,
          description,
          cardImagePath,
          backgroundImagePath,
          recurrences: {
            create: {
              topic,
              topicDescription,
              startTime,
              endTime: addMinutes(startTime, duration),
              maxOccupation,
            },
          },
        },
        include: {
          recurrences: true,
        },
      });
    } catch (err) {
      console.error(err);
      throw { error: err };
    }
  }

  /* find workshop */
  async find(id) {
    try {
      return await this.db.workshop.findUnique({
        where: { workshop_id: id },
        include: {
          recurrences: true,
        },
      });
    } catch (err) {
      console.error(err);
      throw { error: err };
    }
  }

  /* find workshop recurrence */
  async findRecurrence(recurrenceId, user = undefined) {
    let includeUserIds = false;
    let registrationRequest;
    if (user) {
      if (user.role == "JOB_SEEKER") {
        // Job Seeker
        registrationRequest = {
          where: { job_seeker: { user_id: userId } },
          select: { state: true },
        };
      } else {
        // Admin & Advisor
        includeUserIds = true;
        registrationRequest = {
          include: {
            job_seeker: {
              include: {
                user: { omit: { password: true } },
              },
            },
          },
        };
      }
    } else {
      // Public
      registrationRequest = undefined;
    }
    try {
      return await this.db.workshopRecurrence.findUnique({
        where: { workshop_recurrence_id: recurrenceId },
        include: {
          workshop: true,
          registrations: registrationRequest,
          animators: {
            include: {
              advisor: {
                select: {
                  user: {
                    select: {
                      first_name: true,
                      last_name: true,
                      user_id: includeUserIds,
                    },
                  },
                },
              },
            },
          },
          coAnimators: {
            include: {
              external_animator: true,
            },
          },
        },
      });
    } catch (err) {
      console.error(err);
      throw { error: err };
    }
  }

  /* Count registrations by state */
  async countRegistrations(recurrenceId) {
    try {
      return await this.db.registration.groupBy({
        by: ["state"],
        where: { workshop_recurrence_id: recurrenceId },
        _count: {
          job_seeker_id: true,
        },
      });
    } catch (err) {
      console.error(err);
      throw { error: err };
    }
  }

  /* Return registrations */
  async findRegistrations(recurrenceId) {
    try {
      return await this.db.registration.findMany({
        where: { workshop_recurrence_id: recurrenceId },
        include: {
          job_seeker: {
            select: { user: { select: { first_name: true, last_name: true } } },
          },
        },
      });
    } catch (err) {
      console.error(err);
      throw { error: err };
    }
  }

  /* find workshop recurrences */
  async findMany(
    workshopId = undefined,
    advisorId = undefined,
    jobSeekerId = undefined,
    from = undefined,
    to = undefined,
  ) {
    try {
      return await this.db.workshopRecurrence.findMany({
        where: {
          workshop_id: workshopId,
          startTime: { lt: to },
          endTime: { gte: from },
          registrations: jobSeekerId
            ? {
                some: {
                  job_seeker_id: jobSeekerId,
                },
              }
            : undefined,
          animators: advisorId
            ? {
                some: {
                  advisor_id: advisorId,
                },
              }
            : undefined,
        },
        include: {
          workshop: true,
        },
      });
    } catch (err) {
      console.error(err);
      throw { error: err };
    }
  }

  /* update workshop */
  async update(id, data) {
    try {
      return await this.db.workshop.update({
        where: { workshop_id: id },
        data,
      });
    } catch (err) {
      console.error(err);
      throw { error: err };
    }
  }

  /* delete workshop */
  async delete(id) {
    try {
      return await this.db.workshop.delete({
        where: { workshop_id: id },
      });
    } catch (err) {
      console.error(err);
      throw { error: err };
    }
  }

  /* register a job seeker to a recurrence */
  async registerJobSeeker(recurrenceId, jobSeeker) {
    try {
      const recurrence = await this.findRecurrence(
        recurrenceId,
        jobSeeker.user,
      );

      const registrationState =
        recurrence.registrations.length >= recurrence.maxOccupation
          ? "PENDING"
          : "REGISTERED";
      return await this.db.registration.create({
        data: {
          state: registrationState,
          job_seeker_id: jobSeeker.job_seeker_id,
          workshop_recurrence_id: recurrenceId,
        },
      });
    } catch (err) {
      console.error(err);
      throw { error: err };
    }
  }

  /* Add an advisor to a recurrence */
  async addAnimator(recurrenceId, advisorId) {
    try {
      return await this.db.animator.create({
        data: {
          advisor_id: advisorId,
          workshop_recurrence_id: recurrenceId,
        },
      });
    } catch (err) {
      console.error(err);
      throw { error: err };
    }
  }

  /* Add an external animator to a recurrence */
  async addExternalAnimator(recurrenceId, animatorId) {
    try {
      return await this.db.coAnimator.create({
        data: {
          external_animator_id: animatorId,
          workshop_recurrence_id: recurrenceId,
        },
      });
    } catch (err) {
      console.error(err);
      throw { error: err };
    }
  }

  /* unregister a job seeker to a recurrence */
  async unregisterJobSeeker(recurrenceId, jobSeekerId) {
    try {
      return await this.db.registration.deleteMany({
        where: {
          workshop_recurrence_id: recurrenceId,
          job_seeker_id: jobSeekerId,
        },
      });
    } catch (err) {
      console.error(err);
      throw { error: err };
    }
  }

  /* Remove an advisor from a recurrence */
  async removeAnimator(recurrenceId, advisorId) {
    try {
      return await this.db.animator.deleteMany({
        where: {
          advisor_id: advisorId,
          workshop_recurrence_id: recurrenceId,
        },
      });
    } catch (err) {
      console.error(err);
      throw { error: err };
    }
  }

  /* Remove an external animator from a recurrence */
  async removeExternalAnimator(recurrenceId, animatorId) {
    try {
      return await this.db.coAnimator.deleteMany({
        where: {
          external_animator_id: animatorId,
          workshop_recurrence_id: recurrenceId,
        },
      });
    } catch (err) {
      console.error(err);
      throw { error: err };
    }
  }
}
export default new WorkshopRepository();
