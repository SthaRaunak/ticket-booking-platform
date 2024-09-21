import { ZodError, ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { UnprocessableEntity } from "../exceptions/UnprocessableEntity";
import { ErrorCode } from "../exceptions/root";
import { InternalException } from "../exceptions/InternalException";

export function validateRequest(schema: ZodSchema) {
  return function (req: Request, res: Response, next: NextFunction) {
    try {
      req.body = schema.parse(req.body);
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        //format the error before sending it so that user can see the validation error

        const formattedZodError = err.errors.map((err) => {
          return {
            path: err.path.join("."),
            message: err.message,
          };
        });

        return next(
          new UnprocessableEntity(
            "Unprocessable Entity",
            ErrorCode.UNPROCESSABLE_ENTITY,
            formattedZodError
          )
        );
      } else {
        return next(
          new InternalException(
            "Internal Server Error",
            ErrorCode.INTERNAL_EXCEPTION,
            err
          )
        );
      }
    }
  };
}
