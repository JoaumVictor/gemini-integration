import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { status } from "../utils/status";

const registrationMonthlySchema = z.object({
  image: z
    .string()
    .min(1, { message: "Image is required and cannot be empty." }),
  customer_code: z
    .string()
    .min(1, { message: "Customer code is required and cannot be empty." }),
  measure_datetime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Measure datetime must be a valid ISO 8601 date string.",
  }),
  measure_type: z.enum(["WATER", "GAS"], {
    errorMap: () => ({
      message: "Measure type must be either 'WATER' or 'GAS'.",
    }),
  }),
});

export const createRegistrationMonthlyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const keys = Object.keys(req.body);
  const duplicates = keys.filter((key, index) => keys.indexOf(key) !== index);
  if (duplicates.length > 0) {
    return res.status(status.badRequest).json({
      message: `Duplicate fields are not allowed: ${duplicates.join(", ")}`,
    });
  }

  const validationResult = registrationMonthlySchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(status.badRequest).json({
      error_code: "INVALID_DATA",
      error_description: `${validationResult.error.errors[0].path[0]}, ${validationResult.error.errors[0].message}`,
    });
  }

  const extraFields = Object.keys(req.body).filter(
    (key) =>
      !registrationMonthlySchema.shape[
        key as keyof typeof registrationMonthlySchema.shape
      ]
  );
  if (extraFields.length) {
    console.warn("Unknown fields:", extraFields);
  }

  next();
};
