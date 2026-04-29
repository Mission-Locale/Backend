import { Router } from "express";
import AdvisorRepository from "../repositories/AdvisorRepository.js";

import authguard from "../middlewares/authguard.js";
import advisorguard from "../middlewares/advisorguard.js";
import adminguard from "../middlewares/adminguard.js";

const advisorRouter = Router()
  .get("/advisors", authguard, adminguard, async (req, res) => {
    res.json(await AdvisorRepository.findMany(req.query.name));
  })
  .get("/advisors/job-seekers", authguard, advisorguard, async (req, res) => {
    res.json(
      await AdvisorRepository.findAssignedJobSeekers(
        req.user.advisor.advisor_id,
        req.query.name,
      ),
    );
  });

export default advisorRouter;
