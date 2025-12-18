import { Router } from "express";
import authguard from "../middlewares/authguard.js";
import UserRepository from "../repositories/UserRepository.js";
import TokenRepository from "../repositories/TokenRepository.js";
import {
  loginValidator,
  registerValidator,
} from "../validators/userValidator.js";
import { compare } from "bcrypt";
import { cookieOptions } from "../utils/cookieOptions.js";
import jwt from "jsonwebtoken";
import { uploadRegister } from "../middlewares/multer.js";

const userRepository = UserRepository;
const tokenRepository = TokenRepository;
const REFRESH_TOKEN_KEY = process.env.JWT_REFRESH_KEY;
const authRouter = Router()

  .post("/auth/register", uploadRegister, async (req, res) => {
    try {
      const validatedData = await registerValidator.validate(req.body, {
        abortEarly: false,
      });

      delete validatedData.confirm_password;

      if (req.file) {
        validatedData.inscriptionFilePath = req.file.path;
      }
      const data = await userRepository.create(validatedData);
      if (data.error) throw { error: data.error };

      res.json({ message: "ok" });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  })

  .post("/auth/login", async (req, res) => {
    try {
      const validatedData = await loginValidator.validate(req.body, {
        abortEarly: false,
      });
      const user = await userRepository.find(validatedData.email);

      if (!user) throw { error: "Addresse email incorrecte" };
      if (!(await compare(validatedData.password, user.password))) throw { error: "Mot de passe incorrecte" };

      const accessToken = await tokenRepository.generate(
        user.user_id,
        "ACCESS_TOKEN",
        5 * 60 * 1000,
      );
      const expiration = validatedData.keep_connected
        ? 7 * 24 * 60 * 60 * 1000
        : 3 * 60 * 60 * 1000;
      const refreshToken = await tokenRepository.generate(
        user.user_id,
        "REFRESH_TOKEN",
        expiration,
      );

      return res
        .cookie("refresh", refreshToken, {
          maxAge: expiration,
          expires: new Date(Date.now() + expiration),
          ...cookieOptions,
        })
        .json({ token: accessToken, role: user.role });
    } catch (err) {
      res.status(400).json({ error: err });
    }
  })

  .post("/auth/refresh", async (req, res) => {
    const refreshToken = req.cookies.refresh;

    try {
      if (!refreshToken)
        throw { error: "Unauthorized token not found" };
      const data = jwt.verify(refreshToken, REFRESH_TOKEN_KEY);
      if (!data) throw { error: "Unauthorized token expired" };

      const user = tokenRepository.find(data.key);
      if (!user) throw { error: "Unauthorized user not found" };

      accessToken = await tokenRepository.generate(
        user.user_id,
        "ACCESS_TOKEN",
        5 * 60 * 1000,
      );
      res.json({ token: accessToken });
    } catch (err) {
      res.status(400).json({ error: err });
    }
  })

  .get("/auth/logout", authguard, async (req, res) => {
    const refreshToken = req.cookies.refresh;

    try {
      if (refreshToken) await tokenRepository.delete(jwt.decode(refreshToken).key);
      res.clearCookie("refresh").json({ message: "bye" });
    } catch (err) {
      res.status(400).json({ error: err });
    }
  })

  .get("/auth/force-logout", authguard, async (req, res) => {
    try {
      await tokenRepository.deleteAll(req.user.user_id);
      res.clearCookie("refresh").json({ message: "bye" });
    } catch (err) {
      res.status(400).json({ error: err });
    }
  });

export default authRouter;
