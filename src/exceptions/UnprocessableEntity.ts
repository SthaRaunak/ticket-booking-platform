import { ErrorCode, HTTPException } from "./root";

export class UnprocessableEntity extends HTTPException {
  constructor(message: string, errorCode: number, errors?: any) {
    super(message, errorCode, 422, errors);
  }
}
