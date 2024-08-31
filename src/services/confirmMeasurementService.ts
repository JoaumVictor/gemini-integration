import { updateMeasureValue } from "../db/services";
import { IConfirmMeasurement } from "../models/IRegistrationMonthly";

export const confirmMeasurementService = async ({
  confirmed_value,
  measure_uuid,
}: IConfirmMeasurement): Promise<any> => {
  try {
    const measurement = await updateMeasureValue(measure_uuid, confirmed_value);
    return measurement;
  } catch (error) {
    throw error;
  }
};
