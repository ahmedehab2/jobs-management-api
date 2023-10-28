import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { UnauthenticatedError } from "../errors";

import { CustomRequest } from "../lib/types";

export const auth = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authentication invalid");
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as jwt.JwtPayload;
    req.user = {
      userID: payload.userID,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};
