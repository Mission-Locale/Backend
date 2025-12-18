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
          tag: true,
        },
      });
    } catch (err) {
      console.error(err);
      return { error: err };
    }
  }
  /* find workshop */
  /*
        
    */
  async findMany(filters = {}) {
    try {
      return await this.db.workshopRecurrence.findMany({
        where: {
          startTime: {
            gte: filters.start ? new Date(filters.start) : undefined,
            lte: filters.end ? new Date(filters.end) : undefined,
          },
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
  /* update workshop */
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
