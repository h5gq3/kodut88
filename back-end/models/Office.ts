import Country from "./index";
import { OfficeAttributes } from "../types/Office";
import db from "../scripts/db";
import { Sequelize, Model, DataTypes } from "sequelize";
// import {
//   Table,
//   Column,
//   Model,
//   DataType,
//   ForeignKey,
//   BelongsTo,
// } from "sequelize-typescript";

module.exports = (sequelize: any, DataTypes: any) => {
  class Office extends Model<OfficeAttributes> implements OfficeAttributes {
    name: string;
    city: string;
    countryId: number;
    country: string;
    latitude: number;
    longitude: number;
    is_imported?: boolean;
  }

  Office.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      countryId: {
        type: DataTypes.INTEGER,
        references: {
          model: Country,
          key: "id",
        },
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      latitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      longitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      is_imported: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Office",
      timestamps: true,
    }
  );
  return Office;
};
