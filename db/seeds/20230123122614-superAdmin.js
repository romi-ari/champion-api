'use strict';

/** @type {import('sequelize-cli').Migration} */

const {encryptPassword} = require("../../app/controllers/api/v1/someFunction")
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('admins', [{
        first_name: "Aron",
        last_name: "Smith",
        username: "aron",
        admin_id: uuidv4(),
        role_user: "superAdmin",
        email: "aron@mail.com",
        address: "Jl. abcd",
        password: await encryptPassword("aron"),
        createdAt: new Date(),
        updatedAt: new Date(),
    }]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('People', null, {});
  }
};
