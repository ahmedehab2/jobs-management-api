import { Response } from "express";

import { Jobs } from "../models/Job";
import { BadRequestError, NotFoundError } from "../errors";
import { CustomRequest } from "../lib/types";
import { StatusCodes } from "http-status-codes";

const getAllJobs = async (req: CustomRequest, res: Response) => {
  const jobs = await Jobs.find({ createdBy: req.user?.userID }).sort(
    "createdAt"
  );
  res.status(StatusCodes.OK).json({ jobs });
};

const getJob = async (req: CustomRequest, res: Response) => {
  const { id: jobID } = req.params;
  const { userID } = req.user!;
  const job = await Jobs.findOne({ _id: jobID, createdBy: userID });
  if (!job) {
    throw new NotFoundError("Job not found");
  }
  res.status(StatusCodes.OK).json({ job });
};
const createJob = async (req: CustomRequest, res: Response) => {
  req.body.createdBy = req.user?.userID;
  const job = await Jobs.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};
const updateJob = async (req: CustomRequest, res: Response) => {
  const { id: jobID } = req.params;
  const { userID } = req.user!;
  const { company, position, salary } = req.body;
  if (!company || !position || !salary) {
    throw new BadRequestError("There are missing fields");
  }

  const updatedJob = await Jobs.findOneAndUpdate(
    { _id: jobID, createdBy: userID },
    req.body,
    { new: true, runValidators: true }
  );
  if (!updatedJob) {
    throw new NotFoundError(`job with id ${jobID} not found`);
  }

  res.status(StatusCodes.OK).json({ updatedJob });
};

const deleteJob = async (req: CustomRequest, res: Response) => {
  const { id: jobID } = req.params;
  var { userID } = req.user!;
  const job = await Jobs.findOneAndDelete({ _id: jobID, createdBy: userID });
  if (!job) {
    throw new NotFoundError(`job with id ${jobID} not found`);
  }
  res.status(StatusCodes.OK).json({ job });
};
export { getAllJobs, getJob, createJob, updateJob, deleteJob };
