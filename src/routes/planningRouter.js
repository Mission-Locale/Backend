import { Router } from "express";
import MicrosoftService from "../repositories/MicrosoftService.js";

const microsoft = MicrosoftService;
const planningRouter = Router()
  .get("/planning/registration", async (req, res) => {
    return res.json(microsoft.getRegistrationEvents());
  })
  .get("/planning/advisor/:mail", async (req, res) => {
    return res.json(microsoft.getAdvisorEvents(req.params.mail));
  })
  .get("/planning/free-appointments/:mail", async (req, res) => {
    const { start, end, duration } = req.query;
    if (!start || !end || !duration) {
      return res.status(400).json({ error: "Missing parameters." });
    }

    try {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const response = await microsoft.getAdvisorSchedule(
        req.params.mail,
        startDate,
        endDate,
        duration
      );

      const view = response.value[0]?.availabilityView;
      if (!view)
        return res.status(500).json({ error: "No availability data." });

      const availableSlots = [];
      for (let i = 0; i < view.length; i++) {
        if (view[i] === "0") {
          const slotStart = new Date(
            startDate.getTime() + i * duration * 60 * 1000
          );
          availableSlots.push({
            date: slotStart.toISOString().split("T")[0],
            hour: slotStart.toTimeString().slice(0, 5),
          });
        }
      }

      return res.json({ data: availableSlots });
    } catch (err) {
      console.error("Error in /free-appointment:", err);
      return res.status(500).json({ error: "Internal error" });
    }
  });
export default planningRouter;
