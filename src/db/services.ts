import { Op } from "sequelize";
import Measurement from "./models";
import { HttpException } from "../errors/httpException";
import { status } from "../utils/status";

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
    const measurement = await Measurement.create({
      has_confirmed: false,
      ...data,
    });
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

export const updateMeasureValue = async (id: string, newValue: number) => {
  try {
    const measurement = await Measurement.findByPk(id);

    if (!measurement) {
      throw new HttpException(
        status.notFound,
        "MEASURE_NOT_FOUND",
        "Leitura do mês já realizada"
      );
    }

    if (measurement.dataValues.has_confirmed) {
      throw new HttpException(
        status.conflict,
        "CONFIRMATION_DUPLICATE",
        "Leitura do mês já realizada"
      );
    }

    const measurementUpdated = await Measurement.update(
      { measure_value: newValue, has_confirmed: true },
      {
        where: { id },
        returning: true,
      }
    );

    return measurementUpdated;
  } catch (error) {
    console.error("Erro ao atualizar measurement:", error);
    if (error instanceof HttpException) {
      throw error;
    } else {
      throw new HttpException(
        status.notFound,
        "MEASURE_NOT_FOUND",
        "Leitura do mês já realizada"
      );
    }
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

export async function getMeasurementsByCustomerCode(
  customer_code: string,
  measure_type: string | undefined
) {
  try {
    const whereClause: any = { customer_code };

    if (measure_type !== undefined) {
      whereClause.measure_type = measure_type;
    }

    const measurements = await Measurement.findAll({
      where: whereClause,
      attributes: [
        "id",
        "measure_datetime",
        "measure_type",
        "has_confirmed",
        "image_url",
      ],
    });

    if (measurements.length === 0) {
      throw new HttpException(
        status.notFound,
        "MEASURES_NOT_FOUND",
        "Nenhuma leitura encontrada"
      );
    }

    const response = {
      customer_code,
      measures: measurements.map((measurement) => ({
        measure_uuid: measurement.dataValues.id,
        measure_datetime: measurement.dataValues.measure_datetime,
        measure_type: measurement.dataValues.measure_type,
        has_confirmed: measurement.dataValues.has_confirmed,
        image_url: measurement.dataValues.image_url,
      })),
    };
    return response;
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    } else {
      throw new HttpException(
        status.internalServerError,
        "ERROR",
        "Algo deu errado!"
      );
    }
  }
}
