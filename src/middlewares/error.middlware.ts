import { NextFunction, Request, Response } from "express";
import { HTTPException } from "../exceptions/root";

export function errorMiddlware(
  err: HTTPException,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("\nError:", err.message);
  res.status(err.statusCode || 500).json({
    message: err.message,
    errorCode: err.errorCode,
    errors: err.errors,
  });
}
