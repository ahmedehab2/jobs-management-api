import { Schema, model } from "mongoose";
import bcrybt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserDocument } from "../lib/types";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
      maxlength: 20,
      minlength: 3,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid e-mail address",
      ],
    },
    password: { type: String, required: [true, "password is required"] },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  const salt = await bcrybt.genSalt(10);
  this.password = await bcrybt.hash(this.password, salt);
  next();
});
userSchema.methods.createJWT = function () {
  return jwt.sign(
    { userID: this._id, name: this.name, email: this.email, role: this.role },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN! }
  );
};

userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const isMatch = await bcrybt.compare(candidatePassword, this.password);
  return isMatch;
};
export const Users = model<UserDocument>("Users", userSchema);
