import request from "supertest";
import { app } from "../app";
import { connectDB } from "../db/connect";
import mongoose, { Model } from "mongoose";
import { Users } from "../models/User";
import { StatusCodes } from "http-status-codes";
import { Jobs } from "../models/Job";
import { UserDocument } from "lib/types";

let token: string;
let user: UserDocument;

beforeAll(async () => {
  await connectDB(process.env.MONGO_URI_TEST!);
  user = await Users.create({
    name: "Test User",
    email: "em@emem.com",
    password: "12345678",
  });
  token = user.createJWT();
});

afterEach(async () => {
  try {
    // Delete user data after each test case.
    await Users.deleteMany({});
  } catch (error) {
    console.error("Error during user cleanup:", error);
  }
});

afterAll(async () => {
  try {
    // Clean up job data and close the MongoDB connection after all tests.
    await Jobs.deleteMany({});
  } catch (error) {
    console.error("Error during job cleanup:", error);
  }
  await mongoose.connection.close();
});

describe("jobs controller endpoints", () => {
  describe("getAllJobs", () => {
    it("should return all jobs created by the user", async () => {
      await Jobs.create({
        company: "Test Company",
        position: "Test Position",
        salary: 10000,
        createdBy: user._id,
      });
      const res = await request(app)
        .get("/api/v1/jobs")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.jobs).toHaveLength(1);
    });
  });
  describe("get Job", () => {
    it("should return a job created by the user", async () => {
      const job = await Jobs.create({
        company: "Test Company",
        position: "Test Position",
        salary: 10000,
        createdBy: user._id,
      });
      const res = await request(app)
        .get(`/api/v1/jobs/${job._id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.job).toHaveProperty("company");
      expect(res.body.job).toHaveProperty("position");
      expect(res.body.job).toHaveProperty("salary");
    });

    it("should throw an error if the job is not found", async () => {
      const res = await request(app)
        .get(`/api/v1/jobs/60e8b6c9d9b3e00e9c1e3b5f`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(StatusCodes.NOT_FOUND);
      expect(res.body).toHaveProperty("message");
    });
  });
  describe("create Job", () => {
    it("should create a job", async () => {
      const res = await request(app)
        .post(`/api/v1/jobs`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          company: "Test Company",
          position: "Test Position",
          salary: 10000,
        });
      expect(res.status).toBe(StatusCodes.CREATED);
      expect(res.body.job).toHaveProperty("company");
      expect(res.body.job).toHaveProperty("position");
      expect(res.body.job).toHaveProperty("salary");
    });
    it("should throw an error if there are missing fields", async () => {
      const res = await request(app)
        .post(`/api/v1/jobs`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          company: "Test Company",
          position: "Test Position",
        });
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body).toHaveProperty("message");
    });
  });
  describe("update Job", () => {
    it("should update a job", async () => {
      const job = await Jobs.create({
        company: "Test Company",
        position: "Test Position",
        salary: 10000,
        createdBy: user._id,
      });
      const res = await request(app)
        .patch(`/api/v1/jobs/${job._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          company: "Test Company",
          position: "Test Position",
          salary: 10000,
        });
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.updatedJob).toHaveProperty("company");
      expect(res.body.updatedJob).toHaveProperty("position");
      expect(res.body.updatedJob).toHaveProperty("salary");
    });
    it("should throw an error if there are missing fields", async () => {
      const job = await Jobs.create({
        company: "Test Company",
        position: "Test Position",
        salary: 10000,
        createdBy: user._id,
      });
      const res = await request(app)
        .patch(`/api/v1/jobs/${job._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          company: "Test Company",
          position: "Test Position",
        });
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body).toHaveProperty("message");
    });
    it("should throw an error if the job is not found", async () => {
      const res = await request(app)
        .patch(`/api/v1/jobs/60e8b6c9d9b3e00e9c1e3b5f`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          company: "Test Company",
          position: "Test Position",
          salary: 10000,
        });
      expect(res.status).toBe(StatusCodes.NOT_FOUND);
      expect(res.body).toHaveProperty("message");
    });
  });
  describe("delete Job", () => {
    it("should delete a job", async () => {
      const job = await Jobs.create({
        company: "Test Company",
        position: "Test Position",
        salary: 10000,
        createdBy: user._id,
      });
      const res = await request(app)
        .delete(`/api/v1/jobs/${job._id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.job).toHaveProperty("company");
      expect(res.body.job).toHaveProperty("position");
      expect(res.body.job).toHaveProperty("salary");
    });
    it("should throw an error if the job is not found", async () => {
      const res = await request(app)
        .delete(`/api/v1/jobs/60e8b6c9d9b3e00e9c1e3b5f`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(StatusCodes.NOT_FOUND);
      expect(res.body).toHaveProperty("message");
    });
  });
});
