class APIResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;

  constructor(statusCode: number, data: T, message = "success") {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

export { APIResponse };
