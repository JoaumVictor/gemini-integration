import {
  GoogleAIFileManager,
  UploadFileResponse,
} from "@google/generative-ai/server";
import { ImageResult } from "../utils/transformBase64";
import { genAI } from "..";
import { formatRegistrationMonthlyServiceResponse } from "../utils/formatResponse";
import {
  existsForMonthAndYear,
  getAllMeasurements,
  saveMeasurement,
} from "../db/services";
import { HttpException } from "../errors/httpException";
import { status } from "../utils/status";

export const createRegistrationMonthlyService = async (
  imageData: ImageResult,
  customer_code: string,
  measure_datetime: string,
  measure_type: "WATER" | "GAS"
): Promise<any> => {
  try {
    const measureExist = await existsForMonthAndYear(measure_datetime);
    if (measureExist) {
      throw new HttpException(
        status.conflict,
        "DOUBLE_REPORT",
        "Leitura do mês já realizada"
      );
    }

    const fileManager = new GoogleAIFileManager(
      process.env.GEMINI_API_KEY ?? ""
    );

    const uploadResponse: UploadFileResponse = await fileManager.uploadFile(
      imageData.imagePath,
      {
        mimeType: imageData.imageFormat,
        displayName: imageData.imageName,
      }
    );
    // console.log("RESULTADO DO UPLOAD");
    // console.log(uploadResponse);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
      Por favor, analise a imagem fornecida e determine o seguinte:
      1. A imagem é um contador de água ou gás?
      2. Se for um contador, forneça o valor exibido na imagem.
      3. Se não for um contador, informe que a imagem está errada.
      4. Se não for possível ler o valor com clareza, informe que a leitura não está clara e explique o motivo.

      Por favor, retorne um objeto JSON com a seguinte estrutura:
      {
        "value": "<valor_exibido>",
        "isValid": <true|false>,
        "text": "<mensagem_descritiva>"
      }

      Se a imagem não for um contador, retorne o valor 0 para "value" e "false" para "isValid".
      Se a leitura não for clara, informe o motivo na "text".
    `;

    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: uploadResponse.file.uri,
        },
      },
      { text: prompt },
    ]);

    const LLMResult = formatRegistrationMonthlyServiceResponse(result);
    // console.log("RESULTADO DO LLMResult");
    // console.log(LLMResult);

    // dados mockados pra testar esse banco de dados
    // const { LLMResult, uploadResponse } = {
    //   LLMResult: {
    //     value: 0.00015,
    //     isValid: true,
    //     text: "A imagem é de um contador de água e o valor exibido é 0.00015.",
    //   },
    //   uploadResponse: {
    //     file: {
    //       name: "files/88hi131kyd1b",
    //       displayName: "image_1724909673544.jpg",
    //       mimeType: "image/jpeg",
    //       sizeBytes: "191894",
    //       createTime: "2024-08-29T05:34:33.558111Z",
    //       updateTime: "2024-08-29T05:34:33.558111Z",
    //       expirationTime: "2024-08-31T05:34:33.496379878Z",
    //       sha256Hash:
    //         "N2E0NTVkOThjNGE3ZDc5YmNjZmI4MDljY2M5Y2JmMWE1OWU4MjdlYjE0MTFiMzU4MDlkMTVhM2Y0ZWMyM2Y3NA==",
    //       uri: "https://generativelanguage.googleapis.com/v1beta/files/88hi131kyd1b",
    //       state: "ACTIVE",
    //     },
    //   },
    // };

    if (!LLMResult) {
      throw new HttpException(
        status.badRequest,
        "INVALID_DATA",
        "Data inválido"
      );
    }

    if (!LLMResult.isValid) {
      throw new HttpException(
        status.badRequest,
        "INVALID_DATA",
        LLMResult.text
      );
    }

    const response = await saveMeasurement({
      image_url: uploadResponse.file.uri,
      measure_value: LLMResult.value,
      customer_code,
      measure_datetime: measure_datetime,
      measure_type,
    });

    return {
      // image_url: `http://localhost:80/images${imageData.imagePath}`,
      image_url: uploadResponse.file.uri,
      measure_value: LLMResult.value,
      measure_uuid: response.dataValues.id,
    };
  } catch (error) {
    throw error;
  }
};

export async function getAllRegistrationMonthlyService() {
  const response = await getAllMeasurements();
  return response;
}
