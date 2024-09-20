import { ErrorCode, HTTPException } from "./root";

export class BadRequestException extends HTTPException {
  constructor(message: string, errorCode: ErrorCode, errors?: any) {
    super(message, errorCode, 400, errors);
  }
}
