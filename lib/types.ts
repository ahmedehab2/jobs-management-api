import { Request } from "express";
import { Document } from "mongoose";

export interface CustomRequest extends Request {
  user?: {
    userID: string;
    name: string;
    email: string;
    role: string;
  };
}
export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  createJWT(): string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
