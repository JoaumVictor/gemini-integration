import { Request, Response } from "express";
import { HttpException } from "../errors/httpException";

export function catchError(
  err: Error,
  _req: Request,
  res: Response,
  _next: Function
) {
  if (err instanceof HttpException) {
    return res
      .status(err.status_code)
      .json({
        error_code: err.error_code,
        error_description: err.error_description,
      });
  }
  return res.status(500).json({ error: "Internal Server Error" });
}
