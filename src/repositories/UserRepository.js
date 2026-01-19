import database from "../databases/database.js";

class UserRepository {
  db = database;

  /* Create user */
  // Créer automatiquement le profil selon le rôle
  async create(data) {
    try {
      const { profile_picture_path, ...userData } = data;
      return await this.db.user.create({
        data: {
          ...userData,
          ...(data.roleType === "JOB_SEEKER" && {
            jobSeeker: {
              create: {},
            },
          }),
          ...(data.roleType === "ADVISOR" && {
            advisor: {
              create: {
                ...(profile_picture_path && { profile_picture_path }),
              },
            },
          }),
          ...(data.roleType === "ADMINISTRATOR" && {
            administrator: {
              create: {},
            },
          }),
        },
        include: {
          jobSeeker: true,
          advisor: true,
          administrator: true,
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
        include: {
          jobSeeker: true,
          advisor: true,
          administrator: true,
        },
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  /* Find a list of user with optionnal filter */
  async findMany(filter = {}) {
    const { limit = 10, page = 1, name, roleType, order = "asc" } = filter;
    try {
      const users = await this.db.user.findMany({
        where: {
          AND: [
            roleType ? { roleType: { equals: roleType } } : undefined,
            name
              ? {
                  OR: [
                    { first_name: { contains: name } },
                    { last_name: { contains: name } },
                  ],
                }
              : undefined,
          ].filter(Boolean),
        },
        omit: {
          password: true,
        },
        include: {
          jobSeeker: true,
          advisor: roleType === "ADVISOR" ? {
            include: {
              assigned_job_seekers: true,
            },
          } : true,
          administrator: true,
        },
        orderBy: { createdAt: order },
        skip: (page - 1) * limit,
        take: limit,
      });
      const total = await this.db.user.count({
        where: {
          AND: [
            roleType ? { roleType: { equals: roleType } } : undefined,
            name
              ? {
                  OR: [
                    { first_name: { contains: name.toLowerCase() } },
                    { last_name: { contains: name.toLowerCase() } },
                  ],
                }
              : undefined,
          ].filter(Boolean),
        },
      });
      return { users, total };
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  /* Update a specific user */
  async update(id, data) {
    try {
      const { profile_picture_path, ...userData } = data;
      return await this.db.user.update({ 
        where: { user_id: id }, 
        data: {
          ...userData,
          ...(profile_picture_path !== undefined && {
            advisor: {
              update: {
                profile_picture_path,
              },
            },
          }),
        },
      });
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
