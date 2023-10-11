"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const sequelize_typescript_1 = require("sequelize-typescript");
const db = new sequelize_typescript_1.Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    dialect: "postgres",
    // models: [Country, Office],
});
exports.default = db;
//# sourceMappingURL=db.js.map