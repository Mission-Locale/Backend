import database from "../databases/database.js";

class AdvisorRepository {
  db = database;

  /* Find a specific advisor user with is role id */
  async find(id, includeAssignedJobSeekers = false) {
    try {
      return await this.db.advisor.findUnique({
        where: { advisor_id: id },
        include: {
          user: {
            omit: {
              password: true,
            },
          },
          assigned_job_seekers: includeAssignedJobSeekers,
        },
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async findAssignedJobSeekers(id, nameQuery = undefined) {
    try {
      return (
        await this.db.advisor.findUnique({
          where: {
            advisor_id: id,
          },
          select: {
            assigned_job_seekers: {
              where: {
                user: nameQuery
                  ? {
                      OR: [
                        { first_name: { startsWith: nameQuery } },
                        { last_name: { startsWith: nameQuery } },
                      ],
                    }
                  : undefined,
              },
              orderBy: [
                {
                  user: {
                    first_name: "asc",
                  },
                },
                {
                  user: {
                    last_name: "asc",
                  },
                },
              ],
              include: {
                user: {
                  omit: {
                    password: true,
                  },
                },
              },
            },
          },
        })
      ).assigned_job_seekers;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
export default new AdvisorRepository();
