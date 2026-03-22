import { Router } from "express";
import WorkshopRepository from "../repositories/WorkshopRepository.js";
import JobSeekerRepository from "../repositories/JobSeekerRepository.js";
import { uploadWorkshopImage } from "../middlewares/multer.js";
import authguard from "../middlewares/authguard.js";
import optionalauth from "../middlewares/optionalauth.js";
import adminguard from "../middlewares/adminguard.js";

const workshopRepository = WorkshopRepository;
const workshopRouter = Router()
  .get("/workshops", async (req, res) => {
    try {
      res.json(await workshopRepository.findMany(...req.query));
    } catch (err) {
      res.status(400).json({ error: err });
    }
  })

  .post(
    "/workshops",
    authguard,
    adminguard,
    uploadWorkshopImage,
    async (req, res) => {
      console.log(req.body); //TODO: complete for later

      try {
        // TODO: manage 2 files (images)
        if (req.file) {
          workshopData.imagePath = req.file.path;
        }

        res.json(
          await workshopRepository.createWithRecurrence(
            req.body.title,
            req.body.description,
            req.body.cardImagePath,
            req.body.backgroundImagePath,
            req.body.topic,
            req.body.topicDescription,
            new Date(req.body.startTime),
            parseInt(req.body.duration),
            parseInt(req.body.maxOccupation),
          ),
        );
      } catch (err) {
        res.status(400).json({ error: err });
      }
    },
  )

  .get("/workshops/:id", async (req, res) => {
    try {
      res.json(await workshopRepository.find(parseInt(req.params.id)));
    } catch (err) {
      res.status(400).json({ error: err });
    }
  })
  .patch("/workshops/:id", authguard, adminguard, async (req, res) => {
    try {
      res.json(
        await workshopRepository.update(parseInt(req.params.id), req.body),
      );
    } catch (err) {
      res.status(400).json({ error: err });
    }
  })
  .delete("/workshops/:id", authguard, adminguard, async (req, res) => {
    try {
      res.json(await workshopRepository.delete(parseInt(req.params.id)));
    } catch (err) {
      res.status(400).json({ error: err });
    }
  })

  .get("/workshops/recurrences/:id", optionalauth, async (req, res) => {
    try {
      let jobSeekerId;
      switch (req.user?.roleType) {
        case "ADVISOR":
        case "ADMINISTRATOR":
          jobSeekerId = null;
          break;
        case "JOB_SEEKER":
          jobSeekerId = req.user.job_seeker_id;
          break;
        default:
          jobSeekerId = undefined;
          break;
      }

      res.json(
        await workshopRepository.findRecurrence(
          parseInt(req.params.id),
          jobSeekerId,
        ),
      );
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: err });
    }
  })

  .get(
    "/workshops/recurrences/:id/registrations",
    optionalauth,
    async (req, res) => {
      try {
        let response;
        switch (req.user?.roleType) {
          case "ADVISOR":
          case "ADMINISTRATOR":
            response = await workshopRepository.findRegistrations(
              parseInt(req.params.id),
            );
            break;
          default:
            response = await workshopRepository.countRegistrations(
              parseInt(req.params.id),
            );
            break;
        }

        res.json(response);
      } catch (err) {
        console.error(err);
        res.status(400).json({ error: err });
      }
    },
  )

  .post("/workshops/recurrences/:id/register", authguard, async (req, res) => {
    let jobSeekerId;
    switch (req.user.roleType) {
      case "JOB_SEEKER":
        jobSeekerId = req.user.jobSeeker.job_seeker_id;
        break;
      case "ADVISOR":
        const jobSeeker = await JobSeekerRepository.find(req.body.jobSeekerId);
        if (jobSeeker.assigned_advisor_id != req.user.advisor.advisor_id) {
          res
            .status(403)
            .json({ error: "Le demandeur indiqué ne vous est pas assigné" });
          return;
        } else {
          jobSeekerId = jobSeeker.job_seeker_id;
          break;
        }
      case "ADMINISTRATOR":
        jobSeekerId = req.body.jobSeekerId;
        break;
      default:
        console.error("Unknown role type : " + req.user.roleType);
        res.status(403).json({ error: "Forbidden on this resource" });
        return;
    }

    const result = await workshopRepository.registerJobSeeker(
      parseInt(req.params.id),
      jobSeekerId,
    );
    if (result.error) {
      res.status(500).json({ error: result.error });
    } else {
      res.json(result);
    }
  })

  .post("/workshops/recurrences/:id/animators", authguard, async (req, res) => {
    let advisorId;
    switch (req.user.roleType) {
      case "JOB_SEEKER":
        res.status(403).json({ error: "Forbidden on this resourceé" });
        return;
      case "ADVISOR":
        advisorId = req.user.advisor.advisor_id;
      case "ADMINISTRATOR":
        advisorId = req.body.advisorId;
        break;
      default:
        console.error("Unknown role type : " + req.user.roleType);
        res.status(403).json({ error: "Forbidden on this resource" });
        return;
    }

    const result = await workshopRepository.addAnimator(
      parseInt(req.params.id),
      advisorId,
    );
    if (result.error) {
      res.status(500).json({ error: result.error });
    } else {
      res.sendStatus(204);
    }
  })

  .delete(
    "/workshops/recurrences/:id/unregister/:jobSeekerId?",
    authguard,
    async (req, res) => {
      let jobSeekerId;
      switch (req.user.roleType) {
        case "JOB_SEEKER":
          jobSeekerId = req.user.jobSeeker.job_seeker_id;
          break;
        case "ADVISOR":
          if (!req.params.jobSeekerId) {
            res.status(400).json({
              error: "Vous devez indiquez le demandeur à désinscrire",
            });
            return;
          } else {
            const jobSeeker = await JobSeekerRepository.find(
              req.params.jobSeekerId,
            );
            if (jobSeeker.assigned_advisor_id != req.user.advisor.advisor_id) {
              res.status(403).json({
                error: "Le demandeur indiqué ne vous est pas assigné",
              });
              return;
            } else {
              jobSeekerId = jobSeeker.job_seeker_id;
              break;
            }
          }
        case "ADMINISTRATOR":
          if (!req.params.jobSeekerId) {
            res.status(400).json({
              error: "Vous devez indiquez le demandeur à désinscrire",
            });
            return;
          } else {
            jobSeekerId = req.params.jobSeekerId;
            break;
          }
        default:
          console.error("Unknown role type : " + req.user.roleType);
          res.status(403).json({ error: "Forbidden on this resource" });
          return;
      }

      const result = await workshopRepository.unregisterJobSeeker(
        parseInt(req.params.id),
        jobSeekerId,
      );
      if (result.error) {
        res.status(500).json({ error: result.error });
      } else {
        res.sendStatus(204);
      }
    },
  )

  .delete(
    "/workshops/recurrences/:id/animators/:advisorId?",
    authguard,
    async (req, res) => {
      let advisorId;
      switch (req.user.roleType) {
        case "JOB_SEEKER":
          res.status(403).json({ error: "Forbidden on this resource" });
          return;
        case "ADVISOR":
          advisorId = req.user.advisor.advisor_id;
          break;
        case "ADMINISTRATOR":
          if (!req.params.advisorId) {
            res.status(400).json({
              error: "Vous devez indiquez le conseiller à retirer",
            });
            return;
          } else {
            advisorId = req.params.advisorId;
          }
          break;
        default:
          console.error("Unknown role type : " + req.user.roleType);
          res.status(403).json({ error: "Forbidden on this resource" });
          return;
      }

      const result = await workshopRepository.removeAnimator(
        parseInt(req.params.id),
        advisorId,
      );

      if (result.error) {
        res.status(500).json({ error: result.error });
      } else {
        res.sendStatus(204);
      }
    },
  );

export default workshopRouter;