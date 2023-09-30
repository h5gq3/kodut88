const fs = require("fs");
const pdf = require("pdfdataextract");

// load the PDF file
const pdfPath = "data/data.pdf";
const dataBuffer = fs.readFileSync(pdfPath);

// extract text from the PDF
pdf.PdfData.extract(dataBuffer)
  .then(function (data) {
    // this gets us string[] (string per page)
    const texts = data.text;

    // join pages' strings together
    const text = texts.join("\n");

    // split the text into lines
    const lines = text.split("\n");

    // extract table data from text lines for both tables and save to CSV files
    //
    // note that this is not a good solution but
    // since `pdfdataextract` library cannot parse table structure
    // (and there's no alternatives),
    // we solve it this way

    // TABLE 1 (offices)
    //
    // find table 1 header string
    const hl1 = lines.filter((v) => v.startsWith("name"));

    if (hl1.length == 0) {
      throw new Error('no line starts with "name"');
    }

    if (hl1.length > 1) {
      throw new Error('several lines start with "name", narrow down predicate');
    }

    // array of table 1 header column names
    // I can use .split(" ") because header column names don't contain whitespace
    const h1 = hl1[0].split(" ");

    // array of table 1 data rows
    const d1 = lines
      .filter((row) => {
        const longitudeRegex =
          /^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]{1,10})$/;
        return (
          row.startsWith("Office") && longitudeRegex.test(row.split(" ").pop())
        );
      })
      .map((row) => {
        const officeRegex = /Office\s+\d+/;
        const officeName = row.match(officeRegex)[0];
        return [
          row.match(officeRegex)[0],
          ...row.slice(officeName.length + 1).split(" "),
        ];
      });

    // convert table 1 data into CSV format
    //
    // note that since United Kingdom is the only country that contains
    // whitespace, and I don't have a regex or stored array of countries
    // to perform contry-specific filtering,
    // I'll just YOLO and replace `United,Kingdom` with `United Kingdom`
    // Of course I could implement this filtereing, but since the whole
    // process of parsing these tables from PDF as cleartext is a joke,
    // it doesn't matter too much
    const csv1 = [
      h1.join(","),
      ...d1
        .map((row) => row.join(","))
        .map((row) => row.replace(/United,Kingdom/, "United Kingdom")),
    ].join("\n");

    // TABLE 2 (countries)
    //
    // find table 2 header string
    const hl2 = lines.filter((v) => v.startsWith("country"));

    if (hl2.length == 0) {
      throw new Error('no line starts with "country"');
    }

    if (hl2.length > 1) {
      throw new Error(
        'several lines start with "country", narrow down predicate'
      );
    }

    // array of table 2 column names
    const h2 = hl2[0].split(" ");
    // array of table 2 data rows
    const d2 = lines
      .filter((v) => v.split(" ").pop().startsWith("GMT"))
      .map((row) => row.split(" "));

    // convert table 1 data into CSV format
    const csv2 = [
      h2.join(","),
      ...d2
        .map((row) => row.join(","))
        .map((row) => row.replace(/United,Kingdom/, "United Kingdom")),
    ].join("\n");

    // save both tables CSV data to a file
    fs.writeFile("data/table_offices.csv", csv1, (err) => {
      if (err) throw err;
      console.log("Offices table CSV data saved to table_offices.csv");
    });

    fs.writeFile("data/table_countries.csv", csv2, (err) => {
      if (err) throw err;
      console.log("Countries table CSV data saved to table_countries.csv");
    });
  })
  .catch((err) => console.log(err));
