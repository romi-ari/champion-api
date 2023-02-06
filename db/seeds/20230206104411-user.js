'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        first_name:"Ryland Lester",
        last_name:"Saint",
        username:"Ryland",
        user_id:"eac3cca6-2cd6-440e-9493-1c2084bb83e9",
        role_user:"superadmin",
        address:"Jl. Rose",
        phone:"0812345678",
        profile_image:"/image/default_user_icon.png",
        email:"Ryland@mail.com",
        password:"$2y$10$/pZ3Ngc6vrGIbL46LXzigu/t7nSNrKQD5SjrM6d/VBNVSoHa7OGBa",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        first_name:"Linden Nic",
        last_name:"Hollis",
        username:"Linden",
        user_id:"e642e49c-7c2f-4b2b-b0f6-121e4a3dce8a",
        role_user:"admin",
        address:"Jl. Newcastle",
        phone:"0822345678",
        profile_image:"/image/default_user_icon.png",
        email:"linden@mail.com",
        password:"$2y$10$P6LFeIpFtmihf1kYKsSf7OswGNpGTDN2O3kvUNOzOMY.uvmveF2V6",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        first_name:"Jaren Royce",
        last_name:"Frankie",
        username:"Jaren",
        user_id:"254ca3da-1541-4476-b760-8dc9ab09bca8",
        role_user:"member",
        address:"Jl. Mountain",
        phone:"0832345678",
        profile_image:"/image/default_user_icon.png",
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
