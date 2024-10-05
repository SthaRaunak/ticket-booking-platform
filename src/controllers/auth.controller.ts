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
import { formatRoles } from "../utils/format";

const secureCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "strict",
  secure: true,
};

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
      roles: {
        create: {
          role: "USER",
        },
      },
    },
    select: {
      firstname: true,
      lastname: true,
      email: true,
      roles: {
        select: {
          role: true,
        },
      },
      isVerified: true,
      createdAt: true,
    },
  });

  const response = new SuccessResponse(
    SucessCode.CREATED,
    {
      ...newUser,
      roles: formatRoles(newUser.roles),
    },
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
      roles: {
        select: {
          role: true,
        },
      },
      isVerified: true,
      createdAt: true,
    },
  });

  const response = new SuccessResponse(
    SucessCode.OK,
    {
      ...updatedUser,
      roles: formatRoles(updatedUser.roles),
      accessToken,
    },
    "Successfuly Logged In User"
  );

  return res
    .cookie("refreshToken", refreshToken, secureCookieOptions)
    .status(response.statusCode)
    .json(response);
};

const refresh = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken as string | undefined;

  if (!refreshToken) {
    throw new UnauthorizedException(
      "Refresh token doesn't exist",
      ErrorCode.TOKEN_NOT_FOUND
    );
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET!) as any;
    const user = await prismaClient.user.findFirst({
      where: {
        id: payload.userId,
      },
      select: {
        refreshToken: true,
        id: true,
      },
    });

    if (!user) {
      throw new Error();
    }

    if (refreshToken !== user?.refreshToken) {
      throw new Error();
    }
    //currently implemented refresh token rotation ( still researching on the secure way with minimal possible queries and request )

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      generateAccessAndRefreshToken(user.id);

    const updatedUser = await prismaClient.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: newRefreshToken,
      },
    });

    const response = new SuccessResponse(
      200,
      { accessToken: newAccessToken },
      "Token refreshed successfully"
    );

    return res
      .status(response.statusCode)
      .cookie("refreshToken", newRefreshToken, secureCookieOptions)
      .json(response);
  } catch (err) {
    throw new UnauthorizedException(
      "Error validating refresh token",
      ErrorCode.UNAUTHORIZED,
      err
    );
  }
};

const me = async (req: Request, res: Response) => {
  const { updatedAt, refreshToken, password, id, ...rest } = req.user!;
  const response = new SuccessResponse(200, rest, "success");
  res.status(response.statusCode).json(response);
};

export { registerUser, loginUser, me, refresh };
