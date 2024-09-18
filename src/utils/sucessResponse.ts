class SuccessResponse {
  private statusCode: number;
  private data: any;
  private message: string;
  constructor(statusCode: number, data: any, message: string = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
  }
}

export { SuccessResponse };
