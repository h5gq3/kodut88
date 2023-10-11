require("dotenv").config();
import path from "path";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
// sequelize generates index.js so we don't have types for models:
// import { Country, Office } from "../models";
import db from "../models";
import Country from "../models";
import { CountryAttributes } from "types/Country";
import Office from "../models";
import { OfficeAttributes } from "types/Office";
import utils from "./utils";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// serve React app
app.use(express.static(path.join(__dirname, "../../front-end/build")));

// see API_usage.md for more details

// get all countries
// /api/countries
app.get("/api/countries", async (req: Request, res: Response) => {
  try {
    const countries = await db.Country.findAll();
    res.json(countries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// get offices in a country
// /api/offices-in/:country
app.get("/api/offices-in/:country", async (req: Request, res: Response) => {
  try {
    const country = await db.Country.findOne({
      where: {
        name: req.params.country,
      },
    });
    if (!country) {
      res.status(404).json({ error: "Country not found" });
      return;
    }
    const offices = await db.Office.findAll({
      where: {
        country: country.id,
      },
    });
    // get current time in the country
    const localTime = utils.getCurrentLocalTime(country.timezone);
    // calculate distance from the office to the user
    const officesResponse = offices.map((office: OfficeAttributes) => {
      const distance = utils.calculateDistance(
        office.latitude,
        office.longitude
      );
      return {
        office_name: office.name,
        city: office.city,
        country: req.params.country,
        distance: distance.toFixed(2),
        local_time: localTime,
      };
    });
    res.json(officesResponse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// remove a country
// /api/remove-country/:country
app.delete(
  "/api/remove-country/:country",
  async (req: Request, res: Response) => {
    try {
      const country = await db.Country.findOne({
        where: {
          name: req.params.country,
        },
      });
      if (!country) {
        res.status(404).json({ error: "Country not found" });
        return;
      }
      // if  there are offices in this country, we can't remove it
      const offices = await db.Office.findAll({
        where: {
          country: country.id,
        },
      });
      if (offices.length > 0) {
        res.status(400).json({
          error: "Can't remove country with offices. Remove offices first",
        });
        return;
      }

      await country.destroy();
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "An error occurred while removing the country." });
    }
  }
);

// create an office
// /api/create-office
app.post("/api/create-office", async (req: Request, res: Response) => {
  try {
    const country = await db.Country.findOne({
      where: {
        name: req.body.country,
      },
    });
    if (!country) {
      res.status(404).json({ error: "Country not found" });
      return;
    }
    const office = await db.Office.create({
      name: req.body.name,
      city: req.body.city,
      country: country.id,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
    });
    res.json(office);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while creating the office location." });
  }
});

// remove an office
// /api/remove-office/:officeName
app.delete(
  "/api/remove-office/:officeName",
  async (req: Request, res: Response) => {
    try {
      const office = await db.Office.findOne({
        where: {
          name: req.params.officeName,
        },
      });
      if (!office) {
        res.status(404).json({ error: "Office not found" });
        return;
      }
      // imported offices can't be removed
      if (office.is_imported) {
        res.status(400).json({
          error: "Can't remove imported office.",
        });
        return;
      }
      await office.destroy();
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "An error occurred while removing the office." });
    }
  }
);

// create a country
// /api/create-country
app.post("/api/create-country", async (req: Request, res: Response) => {
  try {
    const country = await db.Country.create({
      name: req.body.name,
      timezone: req.body.timezone,
    });
    res.json(country);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while creating the country." });
  }
});

// get timezone by country
// /api/timezone/:country
app.get("/api/timezone/:country", async (req: Request, res: Response) => {
  try {
    const country = await db.Country.findOne({
      where: {
        name: req.params.country,
      },
    });
    if (!country) {
      res.status(404).json({ error: "Country not found" });
      return;
    }
    res.json({ timezone: country.timezone });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// all other routes are handled by React
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../../front-end/build/index.html"));
});

// app.listen(port, () => {
//   console.log(`App listening at http://localhost:${port}`);
// });

const start = async (): Promise<void> => {
  try {
    await db.sequelize.sync().then(() => {
      console.log("DB connection successful.");
    });
    app.listen(port, () => {
      console.log(`App listening at http://localhost:${port}`);
    });
  } catch (err) {
    console.error(err);
  }
};

start();
