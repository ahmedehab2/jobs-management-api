import { StatusCodes } from "http-status-codes";
import { CustomAPIError } from "../errors/custom-error";
import { Request, Response, NextFunction } from "express";
export const errorHandlerMiddleware = (
  error: CustomAPIError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error.code && error.code === 11000) {
    const message = `This email already exists`;
    error = new CustomAPIError(message, StatusCodes.BAD_REQUEST);
  }
  if (error.name === "CastError") {
    const message = `No item found with ${error.path} ${error.value}`;
    error = new CustomAPIError(message, StatusCodes.NOT_FOUND);
  }
  if (error.name === "ValidationError") {
    const message = Object.values(error.errors || {})
      .map((item: any) => item.message)
      .join(", ");
    error = new CustomAPIError(message, StatusCodes.BAD_REQUEST);
  }
  const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = error.message;

  return res.status(statusCode).json({ message });
};
