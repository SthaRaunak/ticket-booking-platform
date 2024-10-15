export class SuccessResponse {
  statusCode: SucessCode;
  data: any;
  message: string;
  constructor(statusCode: SucessCode, data: any, message: string = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
  }
}
export enum SucessCode {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  PARTIAL_CONTENT = 206,
}
