import db from "../scripts/db";
import { Model, DataTypes, Optional, Sequelize } from "sequelize";
import type { CountryAttributes } from "../types/Country";
// these messed up typings:
// import {
//   InferCreationAttributes,
//   InferAttributes,
//   CreationOptional,
// } from "@sequelize/core";
// these work:
// import { Sequelize } from "sequelize";
// import { Table, Column, Model, DataType } from "sequelize-typescript";

module.exports = (sequelize: any, DataTypes: any) => {
  class Country extends Model<CountryAttributes> implements CountryAttributes {
    name!: string;
    timezone!: string;
    static associate(models: any) {
      // define association here
      Country.hasMany(models.Office, {
        foreignKey: "countryId",
        as: "offices",
      });
    }
  }

  Country.init(
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
      timezone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Country",
      timestamps: true,
    }
  );
  return Country;
};
