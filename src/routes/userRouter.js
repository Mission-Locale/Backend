import { Router } from "express";
import UserRepository from "../repositories/UserRepository.js";
import JobSeekerRepository from "../repositories/JobSeekerRepository.js";
import AdvisorRepository from "../repositories/AdvisorRepository.js";
import AdministratorRepository from "../repositories/AdministratorRepository.js";

import {
  updateValidator,
  userFiltersValidator,
} from "../validators/userValidator.js";
import authguard from "../middlewares/authguard.js";
import adminguard from "../middlewares/adminguard.js";

const userRouter = Router()
  .get("/users", authguard, adminguard, async (req, res) => {
    try {
      const filters = await userFiltersValidator.validate(req.query, {
        stripUnknown: true,
      });
      const result = await UserRepository.findMany(filters);
      res.json(result);
    } catch (err) {
      res.status(400).json(err);
    }
  })

  .get("/users/:id", authguard, adminguard, async (req, res) => {
    try {
      const id = req.params.id;
      const user = await UserRepository.find(id, false);
      if (!user) throw "Utilisateur non trouvé";
      res.json(user);
    } catch (error) {
      res.status(400).json(error);
    }
  })

  .get("/users/me", authguard, async (req, res) => {
    try {
      res.json(req.user);
    } catch (error) {
      res.status(400).json(error);
    }
  })

  .get("/users/job-seeker/:id", authguard, async (req, res) => {
    if (req.user.roleType != "ADMINISTRATOR" && req.user.roleType != "ADVISOR")
      res.status(403).json({ error: "Forbidden on this resource!" });
    else
      try {
        const id = req.params.id;
        const jobSeeker = await JobSeekerRepository.find(id);
        if (!jobSeeker)
          res.status(404).json({ error: "Demandeur d'emploi non trouvé" });
        if (
          req.user.roleType == "ADVISOR" &&
          jobSeeker.assigned_advisor_id != null &&
          jobSeeker.assigned_advisor_id != req.user.user_id
        )
          res
            .status(403)
            .json({ error: "Ce demandeur est assigné à un autre conseillé!" });
        else res.json(jobSeeker);
      } catch (err) {
        res.status(400).json(err);
      }
  })

  .get("/users/advisor/:id", authguard, adminguard, async (req, res) => {
    try {
      const id = req.params.id;
      const advisor = await AdvisorRepository.find(id);
      if (!advisor) throw "Conseiller non trouvé";
      res.json(advisor);
    } catch (err) {
      res.status(400).json(err);
    }
  })

  .get("/users/administrator/:id", authguard, adminguard, async (req, res) => {
    try {
      const id = req.params.id;
      const administrator = await AdministratorRepository.find(id);
      if (!administrator) throw "Administrateur non trouvé";
      res.json(administrator);
    } catch (err) {
      res.status(400).json(err);
    }
  })

  .patch("/users/:id", authguard, adminguard, async (req, res) => {
    try {
      const data = await updateValidator.validate(req.body, {
        abortEarly: false,
      });
      const id = req.params.id;
      const user = await UserRepository.update(id, data);
      res.json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  })

  .delete("/users/:id", authguard, adminguard, async (req, res) => {
    try {
      const id = req.params.id;
      const user = await UserRepository.delete(id);
      res.json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  });

export default userRouter;
