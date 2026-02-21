import { Router } from "express";
import authguard from "../middlewares/authguard.js";
import UserRepository from "../repositories/UserRepository.js";
import TokenRepository from "../repositories/TokenRepository.js";
import mailService from "../repositories/MailService.js";
import {
  loginValidator,
  registerValidator,
  resetPasswordRequestValidator,
  resetPasswordValidator,
} from "../validators/userValidator.js";
import { compare } from "bcrypt";
import { cookieOptions } from "../utils/cookieOptions.js";
import jwt from "jsonwebtoken";
import { uploadRegister } from "../middlewares/multer.js";

const userRepository = UserRepository;
const tokenRepository = TokenRepository;
const REFRESH_TOKEN_KEY = process.env.JWT_REFRESH_KEY;
const RESET_TOKEN_KEY = process.env.JWT_RESET_KEY;
const authRouter = Router()

  .post("/auth/register", uploadRegister, async (req, res) => {
    //TODO: forbid advisor and administrator creation from non-admin users
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
      const user = await userRepository.find(validatedData.email, true);

      if (!user) throw { error: "Addresse email incorrecte" };
      if (!(await compare(validatedData.password, user.password))) throw { error: "Mot de passe incorrecte" };

      const accessToken = await tokenRepository.generate(
        user.user_id,
        "ACCESS_TOKEN",
        5 * 60,
      );
      const expiration = validatedData.keep_connected
        ? 7 * 24 * 60 * 60
        : 3 * 60 * 60;
      const refreshToken = await tokenRepository.generate(
        user.user_id,
        "REFRESH_TOKEN",
        expiration,
      );

      return res
        .cookie("refresh", refreshToken, {
          maxAge: expiration * 1000,
          ...cookieOptions,
        })
        .json({ token: accessToken, role: user.roleType });
    } catch (err) {
      res.status(400).json({ error: err });
    }
  })

  .post("/auth/refresh", async (req, res) => {
    const refreshToken = req.cookies.refresh;

    try {
      if (!refreshToken) throw { error: "Refresh token not found" };
      const data = jwt.verify(refreshToken, REFRESH_TOKEN_KEY);
      if (!data) throw { error: "Refresh token expired" };

      const user = await tokenRepository.find(data.key);
      if (!user) throw { error: "User not found" };

      const accessToken = await tokenRepository.generate(
        user.user_id,
        "ACCESS_TOKEN",
        5 * 60,
      );
      res.json({ token: accessToken });
    } catch (err) {
      console.error(err);
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
  })

  .post("/auth/forgot-password", async (req, res) => {
    try {
      const validatedData = await resetPasswordRequestValidator.validate(req.body, {
        abortEarly: false,
      });

      const user = await userRepository.find(validatedData.email);
      
      if (!user) {
        return res.json({ 
          message: "Si cette adresse email existe, un email de réinitialisation a été envoyé." 
        });
      }

      // token (valide 1h)
      const resetToken = await tokenRepository.generate(
        user.user_id,
        "RESET_TOKEN",
        60 * 60 // 1 heure
      );

      await mailService.sendPasswordReset(user.email, user.first_name, resetToken);

      res.json({ 
        message: "Si cette adresse email existe, un email de réinitialisation a été envoyé." 
      });
    } catch (err) {
      console.error("Erreur lors de la demande de réinitialisation:", err);
      res.status(400).json({ error: err });
    }
  })

  .post("/auth/reset-password", async (req, res) => {
    try {
      const validatedData = await resetPasswordValidator.validate(req.body, {
        abortEarly: false,
      });
      let decoded;
      try {
        decoded = jwt.verify(validatedData.token, RESET_TOKEN_KEY);
      } catch (jwtError) {
        return res.status(400).json({ error: "Token invalide ou expiré" });
      }

      const tokenData = await tokenRepository.find(decoded.key);
      if (!tokenData) {
        return res.status(400).json({ error: "Token invalide ou expiré" });
      }

      if (new Date() > new Date(tokenData.expiresAt)) {
        await tokenRepository.delete(decoded.key);
        return res.status(400).json({ error: "Token expiré" });
      }

      await userRepository.update(tokenData.user_id, { password: validatedData.password })
      await tokenRepository.delete(decoded.key);

      res.json({ message: "Mot de passe réinitialisé avec succès" });
    } catch (err) {
      console.error("Erreur lors de la réinitialisation du mot de passe:", err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ error: err.errors });
      }
      res.status(500).json({ error: "Erreur lors de la réinitialisation du mot de passe" });
    }
  })

  .post("/auth/verify-reset-token", async (req, res) => {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({ valid: false, error: "Token requis" });
      }
      
      let decoded;
      try {
        decoded = jwt.verify(token, RESET_TOKEN_KEY);
      } catch (error) {
        return res
          .status(400)
          .json({ valid: false, error: "Token invalide ou expiré" });
      }

      const tokenData = await tokenRepository.find(decoded.key);
      if (!tokenData) {
        return res
          .status(400)
          .json({ valid: false, error: "Token invalide ou expiré" });
      }

      if (new Date() > new Date(tokenData.expiresAt)) {
        await tokenRepository.delete(decoded.key);
        return res.status(400).json({ valid: false, error: "Token expiré" });
      }

      res.json({ valid: true });
    } catch (err) {
      console.error("Erreur lors de la vérification du token:", err);
      res.status(500).json({ valid: false, error: "Erreur lors de la vérification du token" });
    }
  });

export default authRouter;
