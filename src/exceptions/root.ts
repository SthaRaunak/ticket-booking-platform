export class HTTPException extends Error {
  errorCode: ErrorCode;
  statusCode: number;
  errors: any;

  constructor(
    message: string,
    errorCode: ErrorCode,
    statusCode: number,
    error: any
  ) {
    super(message);
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.errors = error;
  }
}

export enum ErrorCode {
  UNPROCESSABLE_ENTITY = 1001,
  INTERNAL_EXCEPTION = 2001,
  USER_ALREADY_EXISTS = 3001,
  USER_DOESNT_EXIST = 3002,
  ACCESS_TOKEN_EXPIRED = 4001,
  TOKEN_NOT_FOUND = 4002,
  UNAUTHORIZED = 5001,
  BAD_REQUEST = 6001,
  NOT_FOUND = 6002,
}
