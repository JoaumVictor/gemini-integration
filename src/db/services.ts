import { Op } from "sequelize";
import Measurement from "./models";

interface MeasurementData {
  image_url: string;
  measure_value: number;
  customer_code: string;
  measure_datetime: string;
  measure_type: "WATER" | "GAS";
}

export const saveMeasurement = async (
  data: MeasurementData
): Promise<Measurement> => {
  try {
    const measurement = await Measurement.create(data);
    console.log("Dados salvos com sucesso.");
    return measurement;
  } catch (error) {
    console.error("Erro ao salvar os dados:", error);
    throw error;
  }
};

export const getAllMeasurements = async () => {
  try {
    const measurements = await Measurement.findAll();
    console.log("Dados recebidos com sucesso");
    return measurements;
  } catch (error) {
    console.error("Erro ao buscar os registros:", error);
    throw new Error("Erro ao buscar os registros");
  }
};

export async function existsForMonthAndYear(
  measureDatetime: string
): Promise<boolean> {
  const date = new Date(measureDatetime);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;

  const count = await Measurement.count({
    where: {
      measure_datetime: {
        [Op.between]: [
          new Date(Date.UTC(year, month - 1, 1)),
          new Date(Date.UTC(year, month, 0, 23, 59, 59)),
        ],
      },
    },
  });

  return count > 0;
}
