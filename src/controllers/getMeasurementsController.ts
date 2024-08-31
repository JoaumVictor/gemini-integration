import { Request, Response } from "express";
import { status } from "../utils/status";
import { getMeasurementsService } from "../services/getMeasurementsService";

export const getMeasurementsController = async (
  req: Request,
  res: Response
) => {
  const { customer_code } = req.params;
  const measure_type = req.query.measure_type as string | undefined;

  console.log(measure_type);

  if (measure_type && !["WATER", "GAS"].includes(measure_type as string)) {
    return res.status(status.badRequest).json({
      error_code: "INVALID_TYPE",
      error_description: "Tipo de medição não permitida",
    });
  }

  const response = await getMeasurementsService(
    customer_code,
    measure_type ?? undefined
  );
  return res.status(status.ok).json(response);
};
