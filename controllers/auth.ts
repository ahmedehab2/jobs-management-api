import { Response, Request } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors";
import { Users } from "../models/User";

const register = async (req: Request, res: Response) => {
  const user = await Users.create(req.body);
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: user.name, token });
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new BadRequestError("Please provide email and password");

  const user = await Users.findOne({ email });
  if (!user) throw new BadRequestError("Invalid credentials");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new BadRequestError("Invalid credentials");

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

export { register, login };
