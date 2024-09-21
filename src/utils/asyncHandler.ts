import { Request, Response, NextFunction } from "express";
import { ErrorCode, HTTPException } from "../exceptions/root";
import { InternalException } from "../exceptions/InternalException";

type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response>;

export function asyncHandler(reqHandler: RequestHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(reqHandler(req, res, next)).catch((err) => {
      let exception: HTTPException;

      if (err instanceof HTTPException) {
        exception = err;
      } else {
        exception = new InternalException(
          "Something went wrong - Internal Serval Error",
          ErrorCode.INTERNAL_EXCEPTION,
          err
        );
      }

      return next(exception);
    });
  };
}
