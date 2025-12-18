import database from "../databases/database.js";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";

class TokenRepository {
  db = database;
  secrets = {
    REFRESH_TOKEN: process.env.JWT_REFRESH_KEY,
    RESET_TOKEN: process.env.JWT_RESET_KEY,
    ACCESS_TOKEN: process.env.JWT_ACCESS_KEY,
  };

  /* Generate a token */
  async generate(userId, tokenType, expiresIn, additionnalData = {}) {
    const secret = this.secrets[tokenType];
    const isAccess = tokenType === "ACCESS_TOKEN";
    const key = isAccess ? userId : crypto.randomBytes(10).toString("hex");

    try {
      const token = jwt.sign({ key }, secret, { expiresIn });
      if (!isAccess) {
        await this.save(userId, tokenType, key, expiresIn);
      }

      return token;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  /* Delete a specific token */
  async delete(token) {
    try {
      return await this.db.token.deleteMany({ where: { token } });
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  /* Delete all user's token*/
  async deleteAll(userId) {
    try {
      return await this.db.token.deleteMany({ where: { user_id: userId } });
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  /* Find token with user */
  async find(token) {
    try {
      return await this.db.token.findUnique({
        where: { token },
        include: { user: true },
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  /* Save token in database */
  async save(userId, type, token, expiresIn) {
    const expiresAt = new Date(Date.now() + expiresIn * 1000);
    try {
      return await this.db.token.upsert({
        where: { token },
        update: { expiresAt },
        create: {
          token,
          type,
          expiresAt,
          user: {
            connect: {
              user_id: userId,
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
export default new TokenRepository();