'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('SponsorTier','width');
    await queryInterface.removeColumn('SponsorTier','height');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('SponsorTier','width', {
      type: Sequelize.INTEGER,
      allowNull: true,
      require: false
    });

    await queryInterface.addColumn('SponsorTier','height', {
      type: Sequelize.INTEGER,
      allowNull: true,
      require: false
    });
  }
};
