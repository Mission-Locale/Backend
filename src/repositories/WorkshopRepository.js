import database from "../databases/database.js";

class WorkshopRepository {
  db = database;

  /* Create workshop */
  async create(data) {
    try {
      return await this.db.workshop.create({ data });
    } catch (err) {
      console.error(err);
      return { error: err };
    }
  }

  /* Create workshop with event */
  async createWithRecurrence(data, recurrenceData) {
    try {
      return await this.db.workshop.create({
        data: {
          ...data,
          recurrences: {
            create: recurrenceData,
          },
        },
        include: {
          recurrences: true,
        },
      });
    } catch (err) {
      console.error(err);
      return { error: err };
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
      return { error: err };
    }
  }

  /* find workshop */
  async findRecurrence(recurrenceId, includeRegistrations = false) {
    try {
      return await this.db.workshopRecurrence.findUnique({
        where: { workshop_recurrence_id: recurrenceId },
        include: {
          workshop: true,
          _count: !includeRegistrations && {
            select: {
              registrations: true,
            },
          },
          registrations: includeRegistrations && {
            include: {
              job_seeker: {
                include: {
                  user: { omit: { password: true } },
                },
              },
            },
          },
          animators: {
            include: {
              advisor: {
                select: {
                  user: { select: { first_name: true, last_name: true } },
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
      return { error: err };
    }
  }

  /* find workshop recurrences */
  async findMany(
    advisorId = undefined,
    jobSeekerId = undefined,
    from = undefined,
    to = undefined,
  ) {
    try {
      return await this.db.workshopRecurrence.findMany({
        where: {
          startTime: {
            gte: from,
            lte: to,
          },
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
      return { error: err };
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
      return { error: err };
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
      return { error: err };
    }
  }

  /* register a job seeker to a recurrence */
  async registerJobSeeker(recurrenceId, jobSeekerId) {
    try {
      const recurrence = await this.findRecurrence(recurrenceId);

      const registrationState =
        recurrence.registrations.length >= recurrence.maxOccupation
          ? "PENDING"
          : "REGISTERED";
      return await this.db.registration.create({
        data: {
          state: registrationState,
          job_seeker_id: jobSeekerId,
          workshop_recurrence_id: recurrenceId,
        },
      });
    } catch (err) {
      console.error(err);
      return { error: err };
    }
  }

  /* Add an advisor to a recurrence */
  async addAnimator(recurrenceId, advisorId) {
    try {
      return await this.db.animator.create({
        advisor_id: advisorId,
        workshop_recurrence_id: recurrenceId,
      });
    } catch (err) {
      console.error(err);
      return { error: err };
    }
  }

  /* Add an external animator to a recurrence */
  async addExternalAnimator(recurrenceId, animatorId) {
    try {
      return await this.db.coAnimator.create({
        external_animator_id: animatorId,
        workshop_recurrence_id: recurrenceId,
      });
    } catch (err) {
      console.error(err);
      return { error: err };
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
      return { error: err };
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
      return { error: err };
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
      return { error: err };
    }
  }
}
export default new WorkshopRepository();
