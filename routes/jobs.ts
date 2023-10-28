import { Router } from "express";
import {
  createJob,
  getJob,
  getAllJobs,
  deleteJob,
  updateJob,
} from "../controllers/jobs";

export const JobsRouter = Router();

JobsRouter.get("/", getAllJobs)
  .post("/", createJob)
  .get("/:id", getJob)
  .patch("/:id", updateJob)
  .delete("/:id", deleteJob);
