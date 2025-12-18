import { Router } from "express";
import authguard from "../middlewares/authguard.js";
import { updateUserValidator } from "../validators/userValidator.js";
import UserRepository from "../repositories/UserRepository.js";

const userRepository = UserRepository;
const profileRouter = Router()
  .get("/profile", authguard, async (req, res) => {
    const user = req.user;
    if (user) {
      delete user.password;
      delete user.user_id;

      res.json(req.user);
    } else {
      res.status(301).json({ message: "User not found" });
    }
  })

  .patch("/profile", authguard, async (req, res) => {
    const user = req.user;
    try {
      const datas = await updateUserValidator.validate(req.body, {
        abortEarly: false,
      });
      console.log(datas);

      userRepository.update(user.user_id, datas);
    } catch (err) {
      res.status(400).json(err);
    }
  })

  // TODO: complete implementations
  .get("/profile/documents", authguard, async (req, res) => {})
  .post("/profile/documents", authguard, async (req, res) => {})
  .patch("/profile/documents/:id", authguard, async (req, res) => {})
  .delete("/profile/documents/:id", authguard, async (req, res) => {});

export default profileRouter;
