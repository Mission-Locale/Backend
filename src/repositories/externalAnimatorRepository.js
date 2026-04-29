import database from "../databases/database.js";

class ExternalAnimatorRepository {
  db = database;

  async create(lastName, firstName) {
    try {
      return await this.db.externalAnimator.create({
        data: {
          lastName: lastName,
          firstName: firstName,
        },
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async findUnique(id) {
    try {
      return await this.db.externalAnimator.findUnique({
        where: { external_animator_id: id },
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async findMany(nameQuery = undefined) {
    try {
      return await this.db.externalAnimator.findMany({
        where: nameQuery
          ? {
              OR: [
                { firstName: { startsWith: nameQuery } },
                { lastName: { startsWith: nameQuery } },
              ],
            }
          : undefined,
        orderBy: [
          {
            firstName: "asc",
          },
          {
            lastName: "asc",
          },
        ],
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
export default new ExternalAnimatorRepository();
