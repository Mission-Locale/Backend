import "dotenv/config";
import "express-async-errors";
import express from "express";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import advisorRouter from "./routes/advisorRouter.js";
import articleRouter from "./routes/articleRouter.js";
import appointmentRouter from "./routes/appointmentRouter.js";
import planningRouter from "./routes/planningRouter.js";
import cookieParser from "cookie-parser";
import profileRouter from "./routes/profileRouter.js";
import workshopRouter from "./routes/workshopRouter.js";

const port = process.env.PORT;

const app = express()
  .use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    }),
  )
  .use(
    rateLimit({
      windowMs: 10 * 60 * 1000,
      max: 10000,
      standardHeaders: true,
      legacyHeaders: false,
      message: "Too many request.",
    }),
  )
  .use(helmet())
  .use(cookieParser())
  .use(
    "/public",
    (req, res, next) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      next();
    },
    express.static("public"),
  )
  .use(express.urlencoded({ extended: true }))
  .use(express.json({ limit: "10mb" }))
  .use(authRouter)
  .use(userRouter)
  .use(profileRouter)
  .use(advisorRouter)
  .use(articleRouter)
  .use(workshopRouter)
  .use(appointmentRouter)
  .use(planningRouter)
  .use((_, res) =>
    setTimeout(
      () => res.status(404).json({ message: "Route not found" }),
      3000,
    ),
  )
  .use((err, req, res, next) => {
    console.error(err);
    res.status(500).json(err);
  })
  .listen(port, (err) => {
    if (err) return console.error(err);
    console.log(`Listen at port ${port}`);
  });

export default app;
