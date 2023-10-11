"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
// these messed up typings:
// import {
//   InferCreationAttributes,
//   InferAttributes,
//   CreationOptional,
// } from "@sequelize/core";
// these work:
// import { Sequelize } from "sequelize";
// import { Table, Column, Model, DataType } from "sequelize-typescript";
module.exports = (sequelize, DataTypes) => {
    class Country extends sequelize_1.Model {
        name;
        timezone;
        static associate(models) {
            // define association here
            Country.hasMany(models.Office, {
                foreignKey: "countryId",
                as: "offices",
            });
        }
    }
    Country.init({
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
    }, {
        sequelize,
        modelName: "Country",
        timestamps: true,
    });
    return Country;
};
//# sourceMappingURL=Country.js.map