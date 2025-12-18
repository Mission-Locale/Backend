
import { Router } from "express";
import WorkshopRepository from "../repositories/WorkshopRepository.js";
import { uploadWorkshopImage } from "../middlewares/multer.js";

const workshopRepository = WorkshopRepository;
const workshopRouter = Router()
  .get("/workshops", async (req, res) => {
    try {
      const recurrences = await workshopRepository.findMany(req.query);

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

  .post("/workshops", uploadWorkshopImage, async (req, res) => {
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
        recurrenceData
      );
      res.json(workshop);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  })

  .get("/workshops/detail/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const workshop = await workshopRepository.find(id);
      if (!workshop) throw "Atelier non trouvé";

      res.json(workshop);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  })
  .patch("/workshops/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const workshop = await workshopRepository.update(id, req.body);
      res.json(workshop);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  })
  .delete("/workshops/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const workshop = await workshopRepository.delete(id);
      res.json(workshop);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  });

export default workshopRouter;