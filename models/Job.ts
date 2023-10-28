import { Schema, model } from "mongoose";

const jobSchema = new Schema(
  {
    company: { type: String, required: [true, "Company is required"] },
    salary: { type: Number, required: [true, "Salary is required"] },
    position: { type: String, required: [true, "Position is required"] },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["interview", "declined", "pending"],
      default: "pending",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "User is required"],
    },
  },
  { timestamps: true }
);
export const Jobs = model("Jobs", jobSchema);
