require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { DateTime } = require("luxon");
const db = require("./db");

// create an Express application
const app = express();
const port = process.env.API_PORT || 3000;

// middleware for parsing JSON requests
app.use(bodyParser.json());

// Serve the static files from the React app
app.use(express.static(path.join(...[__dirname, "..", "front-end", "build"])));

// TODO: define API routes

// get list of countries
app.get("/api/countries", async (req, res) => {
  try {
    const countries = await db.any("SELECT * FROM Countries");
    res.json(countries);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred." });
  }
});

// get timezone for a country
app.get("/api/timezone/:country", async (req, res) => {
  try {
    const { country } = req.params;

    const query =
      "SELECT timezone FROM Countries WHERE LOWER(country) = LOWER($1)";
    const result = await db.oneOrNone(query, [country]);

    if (result) {
      res.json({ timezone: result.timezone });
    } else {
      res
        .status(404)
        .json({ error: "Timezone not found for the selected country" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// create a new office entry
app.post("/api/create-office", async (req, res) => {
  try {
    // check if the provided country exists in the database
    const { countryName, officeName, city, latitude, longitude } = req.body;
    const country = await db.query(
      "SELECT * FROM Countries WHERE LOWER(country) = LOWER($1)",
      [countryName]
    );

    if (!country.length) {
      return res
        .status(404)
        .json({ error: "Country not found in the database." });
    }

    // check if an office with the same details already exists
    const existingOffice = await db.query(
      "SELECT * FROM Offices WHERE LOWER(office) = LOWER($1) AND LOWER(city) = LOWER($2) AND latitude = $3 AND longitude = $4",
      [officeName, city, latitude, longitude]
    );

    if (existingOffice.length) {
      return res
        .status(400)
        .json({ error: "An office with the same details already exists." });
    }

    // if the country exists and no duplicate office exists, insert the new office location
    const result = await db.query(
      "INSERT INTO Offices (office, city, country_id, latitude, longitude) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [officeName, city, country[0].id, latitude, longitude]
    );

    res.status(201).json(result[0]);
  } catch (error) {
    console.error("Error creating office:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the office location." });
  }
});

// create a new country
app.post("/api/create-country", async (req, res) => {
  try {
    // extract country details from the request body
    const { countryName, timezone } = req.body;

    // check if a country with the same name already exists
    const existingCountry = await db.query(
      "SELECT * FROM Countries WHERE LOWER(country) = LOWER($1)",
      [countryName]
    );

    if (existingCountry.length) {
      return res
        .status(400)
        .json({ error: "A country with the same name already exists." });
    }

    // if no duplicate country exists, insert the new country
    const result = await db.query(
      "INSERT INTO Countries (country, timezone) VALUES ($1, $2) RETURNING *",
      [countryName, timezone]
    );

    res.status(201).json(result[0]);
  } catch (error) {
    console.error("Error creating country:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the country." });
  }
});

// remove an office
app.delete("/api/remove-office/:name", async (req, res) => {
  try {
    const officeName = req.params.name;

    // check if the office to be removed was imported from the CSV file
    const isImportedOffice = await db.query(
      "SELECT * FROM Offices WHERE LOWER(office) = LOWER($1) AND is_imported = true",
      [officeName]
    );

    if (isImportedOffice.length) {
      return res.status(403).json({ error: "Cannot delete imported offices." });
    }

    // if it's not an imported office, delete it
    const result = await db.query(
      "DELETE FROM Offices WHERE LOWER(office) = LOWER($1) RETURNING *",
      [officeName]
    );

    if (result.length) {
      res.status(204).end(); // No content, successful deletion
    } else {
      res.status(400).json({ error: "Office not found." });
    }
  } catch (error) {
    console.error("Error deleting office:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the office." });
  }
});

// remove a country
app.delete("/api/remove-country/:name", async (req, res) => {
  try {
    const countryName = req.params.name;

    // check if there are any offices in the country
    const officesInCountry = await db.query(
      "SELECT * FROM Offices WHERE country_id = (SELECT id FROM Countries WHERE LOWER(country) = LOWER($1))",
      [countryName]
    );

    if (officesInCountry.length > 0) {
      return res
        .status(403)
        .json({ error: "Cannot remove a country with existing offices." });
    }

    // if there are no offices in the country, delete the country
    const result = await db.query(
      "DELETE FROM Countries WHERE LOWER(country) = LOWER($1) RETURNING *",
      [countryName]
    );

    if (result.length) {
      res.status(204).end(); // no content, successful removal
    } else {
      res.status(400).json({ error: "Country not found." });
    }
  } catch (error) {
    console.error("Error removing country:", error);
    res
      .status(500)
      .json({ error: "An error occurred while removing the country." });
  }
});

// get offices in a country
app.get("/api/offices-in/:country", async (req, res) => {
  try {
    const countryName = req.params.country;

    // query offices in the specified country
    const officesInCountry = await db.query(
      "SELECT * FROM Offices WHERE country_id = (SELECT id FROM Countries WHERE LOWER(country) = LOWER($1))",
      [countryName]
    );

    const countryTimezone = await db.oneOrNone(
      "SELECT timezone FROM Countries WHERE LOWER(country) = LOWER($1)",
      [countryName]
    );

    if (!countryTimezone) {
      return res.status(400).json({ error: "Country not found" });
    }

    if (!officesInCountry.length) {
      return res
        .status(400)
        .json({ error: "No offices found for this country." });
    }

    // specify the coordinates of the reference location (58.376185, 26.727048)
    const referenceLatitude = 58.376185;
    const referenceLongitude = 26.727048;

    // calculate distance and local time for each office
    const officesWithDetails = officesInCountry.map((office) => {
      const officeLatitude = parseFloat(office.latitude);
      const officeLongitude = parseFloat(office.longitude);

      // calculate distance using the Haversine formula
      const distance = calculateDistance(
        referenceLatitude,
        referenceLongitude,
        officeLatitude,
        officeLongitude
      );

      // get local time for the office's location
      const localTime = getCurrentLocalTime(countryTimezone.timezone);

      if (!localTime) {
        return res
          .status(400)
          .json({ error: "Local time calculation failed." });
      }

      return {
        office_name: office.office,
        city: office.city,
        country: countryName,
        distance: distance.toFixed(2), // round distance to two decimal places
        local_time: localTime,
      };
    });

    res.json(officesWithDetails);
  } catch (error) {
    console.error("Error querying offices in country:", error);
    res.status(500).json({
      error: "An error occurred while querying offices in the country.",
    });
  }
});

// Haversine formula to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const lat1Rad = (lat1 * Math.PI) / 180;
  const lon1Rad = (lon1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;
  const lon2Rad = (lon2 * Math.PI) / 180;

  const dLat = lat2Rad - lat1Rad;
  const dLon = lon2Rad - lon1Rad;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in kilometers
  return distance;
}

function convertGMTToEtcGMT(gmtString) {
  try {
    // Extract the GMT offset value from the input string
    const offsetMatch = gmtString.match(/[+-]\d+/);

    if (offsetMatch) {
      const offset = parseInt(offsetMatch[0]);

      // Determine the sign (plus or minus) from the input string
      const sign = gmtString.includes("+") ? "-" : "+";

      // Create the Etc/GMT time zone string with the offset and opposite sign
      const etcGMTString = `Etc/GMT${sign}${offset}`;

      return etcGMTString;
    } else {
      throw new Error("Invalid input format");
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

// function to get the current local time for a location
function getCurrentLocalTime(timezone) {
  // use Luxon to get the current time based on latitude and longitude
  const etcGMT = convertGMTToEtcGMT(timezone);
  if (etcGMT) {
    const now = DateTime.now().setZone(etcGMT);
    return now.toLocaleString(DateTime.DATETIME_SHORT);
  }
}

// all other routes point to the React app
app.get("*", (req, res) => {
  res.sendFile(
    path.join(...[__dirname, "..", "front-end", "build", "index.html"])
  );
});

// start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
