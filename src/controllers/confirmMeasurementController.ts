import { Request, Response } from "express";
import { status } from "../utils/status";
import { IConfirmMeasurement } from "../models/IRegistrationMonthly";
import { confirmMeasurementService } from "../services/confirmMeasurementService";

export const confirmMeasurementController = async (
  req: Request,
  res: Response
) => {
  const { confirmed_value, measure_uuid }: IConfirmMeasurement = req.body;
  const response = await confirmMeasurementService({
    confirmed_value,
    measure_uuid,
  });
  console.log(response);
  return res.status(status.ok).json({ success: true });
};
