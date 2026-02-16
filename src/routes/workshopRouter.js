import { Router } from "express";
import WorkshopRepository from "../repositories/WorkshopRepository.js";
import JobSeekerRepository from "../repositories/JobSeekerRepository.js";
import { uploadWorkshopImage } from "../middlewares/multer.js";
import authguard from "../middlewares/authguard.js";
import adminguard from "../middlewares/adminguard.js";

const workshopRepository = WorkshopRepository;
const workshopRouter = Router()
  .get("/workshops", async (req, res) => {
    try {
      const recurrences = await workshopRepository.findMany(...req.query);

      const parsedRecurrences = recurrences.map((recurrence) => {
        return {
          id: recurrence.workshop_recurrence_id,
          title: recurrence.workshop.title,
          topic: recurrence.topic,
          topicDescription: recurrence.topicDescription,
          startTime: recurrence.startTime
            ? new Date(recurrence.startTime).toISOString()
            : null,
          duration: recurrence.duration,
          description: recurrence.workshop.description,
          cardImagePath: recurrence.workshop.cardImagePath,
          backgroundImagePath: recurrence.workshop.backgroundImagePath,
        };
      });

      res.json(parsedRecurrences);
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
        const workshopData = {
          title: req.body.title,
          description: req.body.description,
        };
        const recurrenceData = {
          topic: req.body.topic,
          topicDescription: req.body.topicDescription,
          startTime: new Date(req.body.startTime),
          maxOccupation: parseInt(req.body.maxOccupation),
          duration: req.body.duration,
        };

        // TODO: manage 2 files (images)
        if (req.file) {
          workshopData.imagePath = req.file.path;
        }

        const workshop = await workshopRepository.createWithRecurrence(
          workshopData,
          recurrenceData,
        );
        res.json(workshop);
      } catch (err) {
        res.status(400).json({ error: err });
      }
    },
  )

  .get("/workshops/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const workshop = await workshopRepository.find(id);
      if (!workshop) throw "Atelier non trouvé";

      res.json(workshop);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  })
  .patch("/workshops/:id", authguard, adminguard, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const workshop = await workshopRepository.update(id, req.body);
      res.json(workshop);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  })
  .delete("/workshops/:id", authguard, adminguard, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const workshop = await workshopRepository.delete(id);
      res.json(workshop);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  })

  .get("/workshops/recurrences/:id", async (req, res) => {
    try {
      const recurrence = await workshopRepository.findRecurrence(
        parseInt(req.params.id),
      );
      if (!recurrence) throw "Récurrence d'atelier non trouvé";

      res.json(recurrence);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  })

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
      req.params.id,
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
      req.params.id,
      advisorId,
    );
    if (result.error) {
      res.status(500).json({ error: result.error });
    } else {
      res.status(204);
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
        req.params.id,
        jobSeekerId,
      );
      if (result.error) {
        res.status(500).json({ error: result.error });
      } else {
        res.status(204);
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
          res.status(403).json({ error: "Forbidden on this resourceé" });
          return;
        case "ADVISOR":
          advisorId = req.user.advisor.advisor_id;
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
        req.params.id,
        advisorId,
      );
      if (result.error) {
        res.status(500).json({ error: result.error });
      } else {
        res.status(204);
      }
    },
  );

export default workshopRouter;