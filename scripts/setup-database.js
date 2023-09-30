const db = require("./db");

// queries to create tables
const createCountriesTable = `
  CREATE TABLE IF NOT EXISTS Countries (
    id SERIAL PRIMARY KEY,
    country VARCHAR(50) NOT NULL,
    timezone VARCHAR(50) NOT NULL
  );
`;

const createOfficesTable = `
  CREATE TABLE IF NOT EXISTS Offices (
    id SERIAL PRIMARY KEY,
    office VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    country_id INT REFERENCES Countries(id),
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6)
  );
`;

db.none(createCountriesTable)
  .then(() => {
    console.log("Countries table created.");
    return db.none(createOfficesTable);
  })
  .then(() => {
    console.log("Offices table created.");
  })
  .catch((error) => {
    console.error("error creating tables:", error);
  })
  .finally(() => {
    // close the database connection
    db.$pool.end();
  });
