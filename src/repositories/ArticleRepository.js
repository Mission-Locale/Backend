import database from "../databases/database.js";

class ArticleRepository {
  db = database;

  /* Create article */
  async create(data, authorId) {
    try {
      return await this.db.article.create({
        data: {
          title: data.title,
          description: data.description,
          backgroundImagePath: data.backgroundImagePath,
          cardImagePath: data.cardImagePath,
          author_id: authorId,
          tag: {
            connectOrCreate: data.tags.map((tagName) => ({
              where: { tag_name: tagName },
              create: { tag_name: tagName, color: "blue" },
            })),
          },
        },
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async findMany(filter = {}) {
    const { limit = 10, page = 1, name, order = "asc" } = filter;

    try {
      return await this.db.article.findMany({
        where: name
          ? {
              OR: [
                { title: { contains: name } },
                { description: { contains: name } },
              ],
            }
          : {},
        orderBy: { createdAt: order },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          tag: true,
        },
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  /* Find a specific news with id */
  async find(article_id) {
    try {
      return await this.db.article.findUnique({
        where: { article_id },
        include: {
          tag: true,
        },
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  /* Delete a specific news */
  async delete(article_id) {
    try {
      return await this.db.article.delete({
        where: { article_id },
      });
    } catch (err) {
      console.error(err);

      return null;
    }
  }

  /* Update a specific news */
  async update(article_id, data) {
    try {
      return await this.db.article.update({
        where: { article_id },
        data,
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}

export default new ArticleRepository();
