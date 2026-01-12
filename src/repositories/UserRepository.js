import database from "../databases/database.js";

class UserRepository {
  db = database;

  /* Create user */
  // Créer automatiquement dans la table jobSeeker si le rôle est JOB_SEEKER
  async create(data) {
    try {
      return await this.db.user.create({
        data: {
          ...data,
          ...(data.roleType === "JOB_SEEKER" && {
            jobSeeker: {
              create: {},
            },
          }),
        },
        include: {
          jobSeeker: true
        },
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  /* Find a specific user with id or mail */
  async find(idOrEmail) {
    try {
      return await this.db.user.findUnique({
        where: idOrEmail.includes("@")
          ? { email: idOrEmail }
          : { user_id: idOrEmail },
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  /* Find a list of user with optionnal filter */
  async findMany(filter = {}) {
    const { limit = 10, page = 1, name, role, order = "asc" } = filter;
    try {
      return await this.db.user.findMany({
        where: {
          AND: [
            role ? { role } : undefined,
            name
              ? {
                  OR: [
                    { first_name: { contains: name, mode: "insensitive" } },
                    { last_name: { contains: name, mode: "insensitive" } },
                  ],
                }
              : undefined,
          ].filter(Boolean),
        },
        orderBy: { createdAt: order },
        skip: (page - 1) * limit,
        take: limit,
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  /* Update a specific user */
  async update(id, data) {
    try {
      return await this.db.user.update({ where: { user_id: id }, data });
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  /* Delete a specific user */
  async delete(id) {
    try {
      return await this.db.user.delete({ where: { user_id: id } });
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
export default new UserRepository();
