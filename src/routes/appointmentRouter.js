import { Router } from "express";
import AppointmentRepository from "../repositories/AppointmentRepository.js";
import authGuard from "../middlewares/authguard.js";

const appointmentRouter = Router()
  .use(authGuard)
  .post("/appointments", async (req, res) => {
    return res.json(AppointmentRepository.create(req.body));
  })
  .get("/appointments/registration", async (req, res) => {
    return res.json(AppointmentRepository.getAll(null, undefined, Date.now()));
  })
  .get("/appointments/:id", async (req, res) => {
    return res.json(AppointmentRepository.get(req.params.id));
  })
  .get("/appointments", async (req, res) => {
    switch (req.user.roleType) {
      case "JOB_SEEKER":
        return res.json(
          AppointmentRepository.getAll(
            undefined,
            req.user.jobSeeker.job_seeker_id
          )
        );
      case "ADVISOR":
        return res.json(
          AppointmentRepository.getAll(req.user.advisor.advisor_id)
        );
      default:
        return res
          .status(403)
          .json({ error: "Unauthorized for this resource" });
    }
  });
export default appointmentRouter;
