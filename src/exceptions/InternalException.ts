import { ErrorCode, HTTPException } from "./root";

export class InternalException extends HTTPException {
  constructor(message: string, errorCode: number, errors?: any) {
    super(message, errorCode, 500, errors);
  }
}
