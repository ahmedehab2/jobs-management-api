export class CustomAPIError extends Error {
  public statusCode: number;
  public message: string;
  public code?: number;
  public errors?: {};
  public value?: string;
  public path?: string;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
  }
}
