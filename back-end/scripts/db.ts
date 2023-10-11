require("dotenv").config();
import { Sequelize } from "sequelize-typescript";
import Country from "../models";
import Office from "../models";

const db = new Sequelize({
  database: process.env.DB_NAME as string,
  username: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  host: process.env.DB_HOST,
  dialect: "postgres",
  // models: [Country, Office],
});

export default db;
