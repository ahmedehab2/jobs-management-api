import "express-async-errors";
import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import { notFoundMiddleware } from "./middleware/not-found";
import { errorHandlerMiddleware } from "./middleware/error-handler";
import { AuthRouter } from "./routes/auth";
import { JobsRouter } from "./routes/jobs";
import { auth } from "./middleware/authentication";

export const app = express();
dotenv.config();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});

app.use(limiter);
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/jobs", auth, JobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
