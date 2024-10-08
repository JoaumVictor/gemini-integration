export interface IRegistrationMonthly {
  image: string;
  customer_code: string;
  measure_datetime: string;
  measure_type: "WATER" | "GAS";
}

export interface IConfirmMeasurement {
  confirmed_value: number;
  measure_uuid: string;
}
