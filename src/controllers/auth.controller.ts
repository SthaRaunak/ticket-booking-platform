import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { BadRequestException } from "../exceptions/BadRequest";
import { ErrorCode } from "../exceptions/root";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../utils/constants";
import { SuccessResponse, SucessCode } from "../utils/sucessResponse";

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { firstname, lastname, email, password } = req.body;

  const userExist = await prismaClient.user.findFirst({
    where: {
      email: email,
    },
  });

  if (userExist) {
    return next(
      new BadRequestException(
        "User already Exist",
        ErrorCode.USER_ALREADY_EXISTS
      )
    );
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const newUser = await prismaClient.user.create({
    data: {
      firstname,
      lastname,
      email,
      password: hashedPassword,
    },
    select: {
      firstname: true,
      lastname: true,
      email: true,
      role: true,
      isVerified: true,
      createdAt: true,
    },
  });

  const response = new SuccessResponse(
    SucessCode.CREATED,
    newUser,
    "Successfully Registered User"
  );
  return res.status(response.statusCode).json(response);
};

export { registerUser };
