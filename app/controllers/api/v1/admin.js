/**
 * @file contains request handler of post resource
 */
const { admin } = require("../../../models");

const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv')
dotenv.config();

function encryptPassword(password) {
  try {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, parseInt(process.env.salt), (err, encryptedPassword) => {
        if (!!err) {
          reject(err);
          return;
        }

        resolve(encryptedPassword);
      });
    });
  } catch (err) {
    res.status(400).json({
      status: "FAIL",
      message: `Encrypt failed, ${err.message}`,
    });
  }
}

function checkPassword(encryptedPassword, password) {
  try {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, encryptedPassword, (err, isPasswordCorrect) => {
        if (!!err) {
          reject(err);
          return;
        }

        resolve(isPasswordCorrect);
      });
    });
  } catch (err) {
    res.status(400).json({
      status: "FAIL",
      message: `Check password failed, ${err.message}`,
    });
  }
}

function createToken(payload) {
  return jwt.sign(payload, process.env.JWT_SIGNATURE_KEY || "Rahasia");
}

module.exports = {

  async list(req, res) {
    try {
      const adminList = await admin.findAll();
      
      res.status(200).json({
        status: "OK",
        message: "List admin data success",
        data: {
          adminList,
        },
      });
    }
    catch (err) {
      res.status(400).json({
        status: "FAIL",
        message: `List admin failed, ${err.message}`,
      });
    };
  },

  async register(req, res) {
    try{
      const first_name = req.body.first_name;
      const last_name = req.body.last_name;
      const username = req.body.username;
      const email = req.body.email;
      const address = req.body.address;
      const phone = req.body.phone;
      const password = await encryptPassword(req.body.password);
      
      const register = await admin.create({
        first_name,
        last_name,
        username,
        email,
        password,
      })
      res.status(201).json({
        status: "OK",
        message: "Register admin success",
        data: register,
      });
    }
    catch (err) {
      res.status(422).json({
        status: "FAIL",
        message: `Register admin failed, ${err.message}`,
      });
    };
  },

  async update(req, res) {
    try {
      const first_name = req.body.first_name
      const last_name = req.body.last_name
      const username = req.body.username
      const address = req.body.address
      const phone = req.body.phone
      const email = req.body.email
      
      req.admin = await admin.findByPk(req.params.id)
      const user = await req.admin.update( 
      {
        first_name,
        last_name,
        username,
        address,
        phone,
        email,
      })
      res.status(200).json({
        status: "OK",
        message: "Update admin data success",
        data: user,
      });
    }
    catch (err) {
      res.status(422).json({
        status: "FAIL",
        message: `Data failed to update, ${err.message}`,
      });
    };
  },

  async showById(req, res) {
    try{
      const showAdminById = await admin.findByPk(req.params.id);
  
      res.status(200).json({
        status: "OK",
        message: "Show data by id success",
        data: showAdminById,
      });
    }
    catch (err) {
      res.status(404).json({
        status: "FAIL",
        message: `Data not found, ${err.message}`,
      });
    };
  },

  async destroy(req, res) {
    try{
      req.admin = await admin.findByPk(req.params.id)
      const destroy = await req.admin.destroy()

      res.status(200).json({
        status: "OK",
        message: "Data deleted success",
        data: admin,
      });
    }
    catch (err) {
      res.status(422).json({
        status: "FAIL",
        message: `Delete Failed, (${err.message})`,
      });
    }
  },

  async login (req, res) {
    try{
      const username = req.body.username;
      const password = req.body.password;
      const user = await admin.findOne({
        where: {username},
      })
      if (!user) {
        res.status(404).json({ message: "Username not found"})
        return
      }
      const isPasswordCorrect = await checkPassword(user.password, password);
      if (!isPasswordCorrect) {
        res.status(409).json({ message: "The password that you've entered is incorrect" });
        return;
      }
      const token = createToken({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        email: user.email,
      })
      res.status(201).json({
        status: "OK",
        message: "Login Success",
        token,
      });
    } catch (err) {
        res.status(401).json({
          status: "FAILED",
          message: `Login Failed, ${err.message}`,
        });
    }
  },

  // async setAdmin(req, res, next) {
  //    try{
  //     const setAdmin = await admin.findByPk(req.params.id)

  //     res.status(200).json({
  //       status: "OK",
  //       message: "Get data by id success",
  //       data: setAdmin,
  //     });
      
  //    }
  //    catch (err) {
  //     res.status(404).json({
  //       status: "FAIL",
  //       message: `Data not found, ${err.message}`,
  //     });
  //    }
  // },

  // async setAdmin(req, res, next) {
  //   admin.findByPk(req.params.id)
  //     .then((admin) => {
  //       if (!admin) {
  //         res.status(404).json({
  //           status: "FAIL",
  //           message: `Data not found, ${err.message}`,
  //         });

  //         return;
  //       }

  //       req.admin = admin;
  //       next()
  //     })
  //     .catch((err) => {
  //       res.status(404).json({
  //         status: "FAIL",
  //         message: "Post not found!",
  //       });
  //     });
  // },

};
