const db = require("./db");
const { CountryModel } = require("../models/Country");

const main = async () => {
  try {
    await db.authenticate();
    console.log("Connection to the database successful!");
  } catch (error) {
    console.error("Error connecting to the database: ", error);
  } finally {
    await db.close();
  }
};

main();
