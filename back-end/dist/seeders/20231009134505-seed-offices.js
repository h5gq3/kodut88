"use strict";
const { parseOffices } = require("../scripts/parse-PDF");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // parse PDF to get offices
        const data = await parseOffices("../data/data.pdf");
        // get countries' IDs from the database
        const countries = await queryInterface.select(null, "Countries", {
            attributes: ["id", "name"],
        });
        const countryMap = new Map();
        countries.forEach((country) => {
            console.log(country);
            countryMap.set(country.name, country.id);
        });
        // insert offices into the database
        // add timestamps for each office (createdAt and updatedAt)
        return queryInterface.bulkInsert("Offices", data.map((office) => ({
            name: office.name,
            city: office.city,
            countryId: countryMap.get(office.country),
            country: office.country,
            latitude: office.latitude,
            longitude: office.longitude,
            is_imported: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        })), {});
    },
    async down(queryInterface, Sequelize) {
        // delete all offices from the database
        return queryInterface.bulkDelete("Offices", null, {});
    },
};
//# sourceMappingURL=20231009134505-seed-offices.js.map