import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedException } from "../exceptions/Unauthorized";
import { ErrorCode } from "../exceptions/root";
import { prismaClient } from "..";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const accessToken = req.headers["authorization"] as string | undefined;

    if (!accessToken) {
      throw new Error();
    }

    const jwtPayload = jwt.verify(accessToken, process.env.JWT_SECRET!) as any;

    const user = await prismaClient.user.findFirst({
      where: {
        id: jwtPayload.id,
      },
    });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (err) {
    return next(
      new UnauthorizedException(
        "Expired or Invalid Access Token ",
        ErrorCode.ACCESS_TOKEN_EXPIRED
      )
    );
  }
}
