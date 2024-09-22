import { CookieOptions, NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { BadRequestException } from "../exceptions/BadRequest";
import { ErrorCode } from "../exceptions/root";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../utils/constants";
import { SuccessResponse, SucessCode } from "../utils/sucessResponse";
import { NotFoundException } from "../exceptions/NotFound";
import { UnauthorizedException } from "../exceptions/Unauthorized";
import jwt from "jsonwebtoken";
import { InternalException } from "../exceptions/InternalException";

const generateAccessAndRefreshToken = (userId: String) => {
  try {
    const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET!, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });
    const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET!, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });

    if (!accessToken && !refreshToken) {
      throw new Error();
    }
    return { accessToken, refreshToken };
  } catch (err) {
    throw new InternalException(
      "Error generating access and refresh token",
      ErrorCode.INTERNAL_EXCEPTION,
      err
    );
  }
};
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
    throw new BadRequestException(
      "User already Exist",
      ErrorCode.USER_ALREADY_EXISTS
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

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const user = await prismaClient.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    throw new NotFoundException(
      "Invalid email or password",
      ErrorCode.USER_ALREADY_EXISTS
    );
  }

  const IsPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!IsPasswordCorrect) {
    throw new UnauthorizedException(
      "Incorrect password",
      ErrorCode.USER_ALREADY_EXISTS
    );
  }

  const { accessToken, refreshToken } = generateAccessAndRefreshToken(user.id);

  const updatedUser = await prismaClient.user.update({
    where: {
      id: user.id,
    },
    data: {
      refreshToken,
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
    SucessCode.OK,
    updatedUser,
    "Successfuly Logged In User"
  );

  const cookieOptions: CookieOptions = {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  };

  return res
    .cookie("accessToken", accessToken, cookieOptions)
    .status(response.statusCode)
    .json(response);
};

export { registerUser, loginUser };
