import { Router } from "express";
import UserRepository from "../repositories/UserRepository.js";
import { updateValidator, userFiltersValidator } from "../validators/userValidator.js";
import authguard from "../middlewares/authguard.js";
import adminguard from "../middlewares/adminguard.js";

const userRepository = UserRepository;
const userRouter = Router()

    .get("/users", authguard, adminguard, async (req, res) => {
        try {
            const filters = await userFiltersValidator.validate(req.query, { stripUnknown: true });
            const result = await userRepository.findMany(filters);
            res.json(result);
        } catch (err) {
            res.status(400).json(err);
        }
    })

    .get("/users/:id", authguard, adminguard, async (req, res) => {
        try {
            const id = req.params.id;
            const user = await userRepository.find(id);
            if (!user) throw "Utilisateur non trouvé";
            res.json(user);
        } catch (err) {
            res.status(400).json(err);
        }
    })

    .patch("/users/:id", authguard, adminguard, async (req, res) => {
        try {
            const data = await updateValidator.validate(req.body, { abortEarly: false });
            const id = req.params.id;
            const user = await userRepository.update(id, data);
            res.json(user);
        } catch (err) {
            res.status(400).json(err);
        }
    })

    .delete("/users/:id", authguard, adminguard, async (req, res) => {
        try {
            const id = req.params.id;
            const user = await userRepository.delete(id);
            res.json(user);
        } catch (err) {
            res.status(400).json(err);
        }
    })

export default userRouter;


