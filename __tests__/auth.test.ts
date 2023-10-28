import request from "supertest";
import { app } from "../app";
import { connectDB } from "../db/connect";
import mongoose from "mongoose";
import { Users } from "../models/User";
import { StatusCodes } from "http-status-codes";

beforeAll(async () => {
  await connectDB(process.env.MONGO_URI_TEST!);
});

afterAll(async () => {
  try {
    await Users.deleteMany({});
  } catch (error) {
    console.error("Error during user cleanup:", error);
  }
  await mongoose.connection.close();
});

describe("Registeration Route Test", () => {
  it("should successfully register a new user when valid data is provided", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      name: "Test User",
      email: "test@email.com",
      password: "20304050",
    });

    expect(res.status).toBe(StatusCodes.CREATED);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("user");
  });
  it("should throw an error if the user already exists", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      name: "Test User",
      email: "test@email.com",
      password: "2121532532",
    });
    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty("message");
  });
});

describe("Login Route Test", () => {
  it("should successfully login a user", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "test@email.com",
      password: "20304050",
    });
    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("user");
  });

  it("should throw an error if the user does not exist", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "tessst@mai.com",
      password: "20304050",
    });
    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty("message");
  });
});
