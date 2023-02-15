'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        first_name:"Ryland Lester",
        last_name:"Saint",
        username:"Ryland",
        role_user:"superadmin",
        profile_image:"/image/default_user_icon.png",
        verified: true,
        email:"Ryland@mail.com",
        password:"$2y$10$/pZ3Ngc6vrGIbL46LXzigu/t7nSNrKQD5SjrM6d/VBNVSoHa7OGBa",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        first_name:"Linden Nic",
        last_name:"Hollis",
        username:"Linden",
        role_user:"admin",
        profile_image:"/image/default_user_icon.png",
        verified: true,
        email:"linden@mail.com",
        password:"$2y$10$P6LFeIpFtmihf1kYKsSf7OswGNpGTDN2O3kvUNOzOMY.uvmveF2V6",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        first_name:"Jaren Royce",
        last_name:"Frankie",
        username:"Jaren",
        role_user:"member",
        profile_image:"/image/default_user_icon.png",
        verified: true,
        email:"jaren@mail.com",
        password:"$2y$10$mQ4Hhge.d5c6q77AdCs8Suy57yWCKANtdKlCbt0Lx85eKXfeHi49e",
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
    
  }
};
