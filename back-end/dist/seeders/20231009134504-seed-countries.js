"use strict";
const { parseCountries } = require("../scripts/parse-PDF");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // parse PDF to get countries
        const data = await parseCountries("../data/data.pdf");
        console.log(data);
        // insert countries into the database
        // add timestamps for each country (createdAt and updatedAt)
        return queryInterface.bulkInsert("Countries", data.map((country) => ({
            name: country.name,
            timezone: country.timezone,
            createdAt: new Date(),
            updatedAt: new Date(),
        })), {});
        // return queryInterface.bulkInsert("Countries", data, {});
    },
    async down(queryInterface, Sequelize) {
        // delete all countries from the database
        return queryInterface.bulkDelete("Countries", null, {});
    },
};
//# sourceMappingURL=20231009134504-seed-countries.js.map