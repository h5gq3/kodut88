"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Create table 'Offices'
     */
    await queryInterface.createTable("Offices", {
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
      city: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      countryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Countries",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      country: {
        type: Sequelize.STRING(50),
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      latitude: {
        type: Sequelize.DECIMAL(9, 6),
      },
      longitude: {
        type: Sequelize.DECIMAL(9, 6),
      },
      is_imported: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Drop table 'Offices'
     */
    await queryInterface.dropTable("Offices");
  },
};
