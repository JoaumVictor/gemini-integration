import {
  getMeasurementsByCustomerCode,
  updateMeasureValue,
} from "../db/services";

export const getMeasurementsService = async (
  customer_code: string,
  measure_type: string | undefined
) => {
  try {
    const response = await getMeasurementsByCustomerCode(
      customer_code,
      measure_type
    );
    return response;
  } catch (error) {
    throw error;
  }
};
