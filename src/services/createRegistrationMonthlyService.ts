import {
  GoogleAIFileManager,
  UploadFileResponse,
} from "@google/generative-ai/server";
import { ImageResult } from "../utils/transformBase64";
import { genAI } from "..";
import {
  formatRegistrationMonthlyServiceResponse,
  formatRegistrationMonthlyServiceResponseProps,
} from "../utils/formatResponse";

export interface IRegistrationMonthlyService {
  uploadImageResult: UploadFileResponse | null;
  LLMResult: formatRegistrationMonthlyServiceResponseProps;
}

export const createRegistrationMonthlyService = async (
  imageData: ImageResult
): Promise<IRegistrationMonthlyService> => {
  try {
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

    return {
      uploadImageResult: uploadResponse,
      LLMResult: formatRegistrationMonthlyServiceResponse(result),
    };
  } catch (error) {
    console.log(error);
    return {
      uploadImageResult: null,
      LLMResult: {
        value: 0,
        isValid: false,
        text: "Algo deu errado no upload da imagem",
      },
    };
  }
};
