import { ErrorCode, HTTPException } from "./root";

export class NotFoundException extends HTTPException {
  constructor(message: string, errorCode: ErrorCode, errors?: any) {
    super(message, errorCode, 404, errors);
  }
}
