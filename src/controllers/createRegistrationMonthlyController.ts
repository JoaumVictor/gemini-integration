import { Request, Response } from "express";
import {
  createRegistrationMonthlyService,
  getAllRegistrationMonthlyService,
} from "../services/createRegistrationMonthlyService";
import { status } from "../utils/status";
import { convertBase64ToImage } from "../utils/transformBase64";
import path from "path";
import { IRegistrationMonthly } from "../models/IRegistrationMonthly";

export const createRegistrationMonthlyController = async (
  req: Request,
  res: Response
) => {
  const {
    image,
    customer_code,
    measure_datetime,
    measure_type,
  }: IRegistrationMonthly = req.body;
  const outputDir = path.join(__dirname, "../output");
  const imageData = convertBase64ToImage(image, outputDir);
  console.log(imageData);
  const response = await createRegistrationMonthlyService(
    imageData,
    customer_code,
    measure_datetime,
    measure_type
  );
  return res.status(status.ok).json(response);
};

export const getAllMonthlyController = async (_req: Request, res: Response) => {
  const response = await getAllRegistrationMonthlyService();
  return res.status(status.ok).json(response);
};
