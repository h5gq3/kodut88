"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
const sequelize_1 = require("sequelize");
// import {
//   Table,
//   Column,
//   Model,
//   DataType,
//   ForeignKey,
//   BelongsTo,
// } from "sequelize-typescript";
module.exports = (sequelize, DataTypes) => {
    class Office extends sequelize_1.Model {
        name;
        city;
        countryId;
        country;
        latitude;
        longitude;
        is_imported;
    }
    Office.init({
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
                model: index_1.default,
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
    }, {
        sequelize,
        modelName: "Office",
        timestamps: true,
    });
    return Office;
};
//# sourceMappingURL=Office.js.map