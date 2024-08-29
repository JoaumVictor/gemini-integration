import { Request, Response } from "express";
import { createRegistrationMonthlyService } from "../services/createRegistrationMonthlyService";
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
  try {
    // antes de validar a imagem eu preciso verificar se o registro desse mês já foi feito, se sim eu disparo um erro antes de requisitar o google gemini

    // const outputDir = path.join(__dirname, "../output");
    // const imageData = convertBase64ToImage(image, outputDir);
    // const { uploadImageResult, LLMResult } = await createRegistrationMonthlyService(
    //   imageData
    // );

    const { LLMResult, uploadImageResult } = {
      LLMResult: {
        value: 0.00015,
        isValid: true,
        text: "A imagem é de um contador de água e o valor exibido é 0.00015.",
      },
      uploadImageResult: {
        file: {
          name: "files/88hi131kyd1b",
          displayName: "image_1724909673544.jpg",
          mimeType: "image/jpeg",
          sizeBytes: "191894",
          createTime: "2024-08-29T05:34:33.558111Z",
          updateTime: "2024-08-29T05:34:33.558111Z",
          expirationTime: "2024-08-31T05:34:33.496379878Z",
          sha256Hash:
            "N2E0NTVkOThjNGE3ZDc5YmNjZmI4MDljY2M5Y2JmMWE1OWU4MjdlYjE0MTFiMzU4MDlkMTVhM2Y0ZWMyM2Y3NA==",
          uri: "https://generativelanguage.googleapis.com/v1beta/files/88hi131kyd1b",
          state: "ACTIVE",
        },
      },
    };

    if (!LLMResult || !LLMResult.isValid) {
      return res.status(status.badRequest).json({
        error_code: "INVALID_DATA",
        error_description: LLMResult.text,
      });
    }

    return res.status(status.ok).json({ LLMResult, uploadImageResult });
  } catch (error: any) {
    return res
      .status(status.internalServerError)
      .json({ message: "Error processing image", error: error.message });
  }
};
