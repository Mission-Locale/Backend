import { Router } from "express";
import AppointmentRepository from "../repositories/AppointmentRepository.js";
import authGuard from "../middlewares/authguard.js";

const appointmentRouter = Router()
  .post("/appointments", authGuard, async (req, res) => {
    const authorized = false;
    switch (req.user.roleType) {
      case "ADVISOR":
        authorized = req.body.advisor_id == req.user.advisor_id;
        break;
      case "ADMINISTRATOR":
        authorized = true;
        break;
    }
    if (authorized)
      return res.json(await AppointmentRepository.create(req.body));
    else {
      return res
        .status(403)
        .json({ error: "Unauthorized to create this appointment" });
    }
  })
  .get("/appointments", authGuard, async (req, res) => {
    switch (req.user.roleType) {
      case "JOB_SEEKER":
        return res.json(
          await AppointmentRepository.getAll(
            undefined,
            req.user.jobSeeker.job_seeker_id
          )
        );
      case "ADVISOR":
        return res.json(
          await AppointmentRepository.getAll(req.user.advisor.advisor_id)
        );
      default:
        return res
          .status(403)
          .json({ error: "Unauthorized for this resource" });
    }
  })
  .get("/appointments/registration", authGuard, async (req, res) => {
    //TODO Unauthorized for job seeker
    return res.json(
      await AppointmentRepository.getAll(null, undefined, Date.now())
    );
  })
  .post("/appointments/registration", async (req, res) => {
    if(req.body.advisor_id) {
      return res
          .status(400)
          .json({ error: "Registration appointment can't have an advisor!" });
    } else 
    return res.json(
      await AppointmentRepository.create(req.body)
    );
  })
  .get("/appointments/:id", authGuard, async (req, res) => {
    //TODO: Add security to get only his appointment (for advisor and job_seeker), unless admin
    return res.json(await AppointmentRepository.get(req.params.id));
  })
  .patch("/appointments/:id", authGuard, async (req, res) => {
    //TODO: Add security to update only if it's the advisor's appointment or an admin
    return res.json(
      await AppointmentRepository.update(
        req.params.id,
        req.body.newState,
        req.body.advisorId
      )
    );
  })
  .delete("/appointments/:id", authGuard, async (req, res) => {
    //TODO: Add security to delete only if it's the advisor's appointment or an admin
    await AppointmentRepository.delete(req.params.id);
    return res.status(204).json({ message: "success" });
  });
export default appointmentRouter;
