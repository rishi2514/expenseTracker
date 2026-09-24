// We made a centralised api response as well so that every response will be consistent.
class ApiResponse {
  constructor(statusCode, data, message = "Success", meta) {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
    this.meta = meta;
  }
}

export default ApiResponse;
