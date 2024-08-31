export class HttpException extends Error {
  public status_code: number;
  public error_code: string;
  public error_description: string;

  constructor(
    status_code: number,
    error_code: string,
    error_description: string
  ) {
    super(error_description);
    this.status_code = status_code;
    this.error_code = error_code;
    this.error_description = error_description;
  }
}
