import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { status } from "../utils/status";

const confirmMeasurementSchema = z.object({
  measure_uuid: z
    .string()
    .min(1, { message: "Measure UUID is required and cannot be empty." }),
  confirmed_value: z
    .number()
    .positive({ message: "Confirmed value must be a positive number." }),
});

export const confirmMeasurementMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validationResult = confirmMeasurementSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(status.badRequest).json({
      error_code: "INVALID_DATA",
      error_description: `${validationResult.error.errors[0].path[0]}, ${validationResult.error.errors[0].message}`,
    });
  }

  const extraFields = Object.keys(req.body).filter(
    (key) =>
      !confirmMeasurementSchema.shape[
        key as keyof typeof confirmMeasurementSchema.shape
      ]
  );
  if (extraFields.length) {
    console.warn("Unknown fields:", extraFields);
  }
  next();
};
