import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "./database";

interface MeasurementAttributes {
  id: string;
  image_url: string;
  measure_value: number;
  customer_code: string;
  measure_datetime: string;
  measure_type: "WATER" | "GAS";
  has_confirmed: boolean;
}

interface MeasurementCreationAttributes
  extends Optional<MeasurementAttributes, "id"> {}

class Measurement
  extends Model<MeasurementAttributes, MeasurementCreationAttributes>
  implements MeasurementAttributes
{
  public id!: string;
  public image_url!: string;
  public measure_value!: number;
  public customer_code!: string;
  public measure_datetime!: string;
  public measure_type!: "WATER" | "GAS";
  public has_confirmed!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Measurement.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    measure_value: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    customer_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    measure_datetime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    measure_type: {
      type: DataTypes.ENUM("WATER", "GAS"),
      allowNull: false,
    },
    has_confirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Measurement",
    tableName: "measurements",
  }
);

export default Measurement;
