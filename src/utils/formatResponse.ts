import { GenerateContentResult } from "@google/generative-ai";

export interface formatRegistrationMonthlyServiceResponseProps {
  value: number;
  isValid: boolean;
  text: string;
}

export const formatRegistrationMonthlyServiceResponse = (
  result: GenerateContentResult | any
): formatRegistrationMonthlyServiceResponseProps => {
  const responseText =
    result.response.candidates[0].content.parts[0].text.trim();
  let jsonResponse;
  try {
    jsonResponse = JSON.parse(responseText);
    const parsedValue = parseFloat(jsonResponse.value);
    jsonResponse.value = !isNaN(parsedValue) ? parsedValue : 0;
    if (jsonResponse.isValid === false) {
      jsonResponse.value = 0;
    }
  } catch (error) {
    console.log("Erro ao interpretar a resposta JSON:", error);
    jsonResponse = {
      value: 0,
      isValid: false,
      text: jsonResponse.text,
    };
  }

  return jsonResponse;
};
