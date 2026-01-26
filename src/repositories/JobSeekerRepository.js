import database from "../databases/database.js";

class JobSeekerRepository {
  db = database;

  /* Find a specific JobSeeker user with is role id */
  async find(id) {
    try {
      return await this.db.jobSeeker.findUnique({
        where: { user_id: id },
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
export default new JobSeekerRepository();
