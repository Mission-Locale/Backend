import { Router } from "express";
import ExternalAnimatorRepository from "../repositories/externalAnimatorRepository.js";

import authguard from "../middlewares/authguard.js";
import adminguard from "../middlewares/adminguard.js";

const externalAnimatorRouter = Router()
  .post("/external-animators", authguard, adminguard, async (req, res) => {
    res.json(
      await ExternalAnimatorRepository.create(
        req.body.lastName,
        req.body.firstName,
      ),
    );
  })
  .get("/external-animators", authguard, adminguard, async (req, res) => {
    res.json(await ExternalAnimatorRepository.findMany(req.query.name));
  })
  .get("/external-animators/:id", authguard, adminguard, async (req, res) => {
    res.json(await ExternalAnimatorRepository.findUnique(req.params.id));
  });

export default externalAnimatorRouter;
