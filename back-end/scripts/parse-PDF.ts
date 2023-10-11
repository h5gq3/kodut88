const fs = require("fs");
const pdf = require("pdfdataextract");
import { CountryAttributes } from "types/Country";
import { OfficeAttributes } from "types/Office";
// import Country from "models/Country";
// import Office from "models/Office";

async function parseCountries(filePath: string): Promise<CountryAttributes[]> {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf.PdfData.extract(dataBuffer);
  const countries: CountryAttributes[] = [];
  for (const page of data.text) {
    const lines: string[] = page.split("\n");
    for (const line of lines) {
      // country line has timezone in the end that starts with `GMT`
      const regex = /GMT/;
      const country = line.match(regex);
      if (country) {
        countries.push({
          name: line.slice(0, country.index! - 1),
          timezone: line.slice(country.index),
        });
      }
    }
  }
  return countries;
}

async function parseOffices(filePath: string): Promise<OfficeAttributes[]> {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf.PdfData.extract(dataBuffer);
  const offices: OfficeAttributes[] = [];
  for (const page of data.text) {
    const lines: string[] = page.split("\n");
    for (const line of lines) {
      // office line starts with `Office` and has longitude in the end
      const longitudeRegex = /^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]{1,10})$/;
      const longitude = line.split(" ").pop() as string;
      const officeLine =
        longitudeRegex.test(longitude) && line.startsWith("Office")
          ? line
          : null;
      if (officeLine) {
        // note we handle United Kingdom as a special case
        const officeInfo = (field: string): string => {
          const separated = officeLine.split(" ");
          switch (field) {
            case "name":
              return separated[0] + " " + separated[1];
            case "city":
              return separated[2];
            case "country":
              return separated[3] === "United"
                ? "United Kingdom"
                : separated[3];
            case "latitude":
              return separated[3] === "United" ? separated[5] : separated[4];
            case "longitude":
              return separated[3] === "United" ? separated[6] : separated[5];
            default:
              return "";
          }
        };
        offices.push({
          name: officeInfo("name"),
          city: officeInfo("city"),
          country: officeInfo("country"),
          latitude: parseFloat(officeInfo("latitude")),
          longitude: parseFloat(officeInfo("longitude")),
        });
      }
    }
  }
  return offices;
}

module.exports = {
  parseCountries,
  parseOffices,
};
