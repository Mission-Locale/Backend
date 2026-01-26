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
          registrations: {
            some: {
              job_seeker_id: jobSeekerId,
            },
          },
          animators: {
            some: {
              advisor_id: advisorId,
            },
          },
        },
        include: {
          workshop: true,
          registrations: true,
          animators: true,
          coAnimators: true,
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
}
export default new WorkshopRepository();
