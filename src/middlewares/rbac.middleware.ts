import { Request, Response, NextFunction } from "express";
import { UnauthorizedException } from "../exceptions/Unauthorized";
import { ErrorCode } from "../exceptions/root";
import { Roles } from "@prisma/client";

export function RBAC(role: Roles) {
  return function (req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      if (!user.roles.includes(role)) {
        throw new Error();
      }
      next();
    } catch {
      return next(
        new UnauthorizedException(
          `You have to be ${role.toLowerCase()} to perform this action.`,
          ErrorCode.INTERNAL_EXCEPTION
        )
      );
    }
  };
}
