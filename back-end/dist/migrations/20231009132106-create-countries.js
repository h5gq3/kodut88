"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Create table 'Countries'
         */
        await queryInterface.createTable("Countries", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            timezone: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        /**
         * Drop table 'Countries'
         */
        await queryInterface.dropTable("Countries");
    },
};
//# sourceMappingURL=20231009132106-create-countries.js.map