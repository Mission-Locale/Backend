import database from "../databases/database.js";

class AdministratorRepository {
  db = database;

  /* Find a specific administrator user with his role id */
  async find(id) {
    try {
      return await this.db.administrator.findUnique({
        where: { administrator_id: id },
        include: {
          user: {
            omit: {
              password: true,
            },
          },
        },
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
export default new AdministratorRepository();
