const fs = require("fs");
const fastcsv = require("fast-csv");
const db = require("./db");

// file paths for CSV files
const officesCSVFile = "data/table_offices.csv";
const countriesCSVFile = "data/table_countries.csv";

async function importData() {
  try {
    // check if the 'table_countries' CSV file exists before attempting to read it
    if (!fs.existsSync(countriesCSVFile)) {
      throw new Error(`file not found: ${countriesCSVFile}`);
    }

    // read and insert data from the 'countries' CSV file
    const countriesStream = fs.createReadStream(countriesCSVFile);
    const countriesCSV = fastcsv.parseStream(countriesStream, {
      headers: true,
    });

    // map country names to country IDs for use in the 'offices' CSV import
    const countryMap = new Map();
    for await (const row of countriesCSV) {
      // check if the country already exists in the table
      const existingCountry = await db.oneOrNone(
        "SELECT id FROM Countries WHERE country = $1",
        [row.country]
      );

      if (!existingCountry) {
        const result = await db.one(
          "INSERT INTO Countries(country, timezone) VALUES($1, $2) RETURNING id",
          [row.country, row.timezone]
        );
        console.log(row.country, result.id);
        countryMap.set(row.country, result.id);
      }
    }

    console.log("data imported successfully into the Countries table.");

    // check if the 'table_offices' CSV file exists before attempting to read it
    if (!fs.existsSync(officesCSVFile)) {
      throw new Error(`file not found: ${officesCSVFile}`);
    }

    // read and insert data from the 'offices' CSV file
    const officesStream = fs.createReadStream(officesCSVFile);
    const officesCSV = fastcsv.parseStream(officesStream, { headers: true });

    await db.tx(async (t) => {
      for await (const row of officesCSV) {
        // check if the office already exists in the table
        const existingOffice = await db.oneOrNone(
          "SELECT id FROM Offices WHERE office = $1 AND city = $2",
          [row.name, row.city]
        );
        if (!existingOffice) {
          const countryId = countryMap.get(row.country);
          if (countryId !== undefined) {
            await t.none(
              "INSERT INTO Offices(office, city, country_id, latitude, longitude, is_imported) VALUES($1, $2, $3, $4, $5, $6)",
              [
                row.name,
                row.city,
                countryId,
                parseFloat(row.latitude),
                parseFloat(row.longitude),
                true,
              ]
            );
          }
        }
      }
    });

    console.log("data imported successfully into the Offices table.");
  } catch (error) {
    console.error("error importing data:", error);
  } finally {
    // close the database connection
    db.$pool.end();
  }
}

// call the importData function to start the data import process
importData();
