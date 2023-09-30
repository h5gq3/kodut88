const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");

// create an Express application
const app = express();
const port = process.env.PORT || 3000;

// middleware for parsing JSON requests
app.use(bodyParser.json());

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

// start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
