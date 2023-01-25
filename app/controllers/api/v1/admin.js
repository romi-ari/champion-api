/**
 * @file contains request handler of post resource
 */
const { admin, admins } = require("../../../models");
const {createToken, encryptPassword, checkPassword} = require("./someFunction")
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {

  async list(req, res) {
    try {
      const adminList = await admin.findAll();
      const adminTotal = adminList.length
      
      res.status(200).json({
        status: "OK",
        message: "List admin data success",
        data: {
          adminList,
        },
        total: {
          adminTotal,
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
      const admin_id = uuidv4();
      const role_user = "admin";
      const email = req.body.email;
      const address = req.body.address;
      const password = await encryptPassword(req.body.password);
      
      const register = await admin.create({
        first_name,
        last_name,
        username,
        admin_id,
        role_user,
        email,
        address,
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

  async showById(req,res) {
    try{
      const showAdminById = await admin.findByPk(req.params.id)

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
    }
  },

  async destroy(req, res) {
    try{
      req.admin = await admin.findByPk(req.params.id)
      const destroy = await req.admin.destroy()

      res.status(200).json({
        status: "OK",
        message: "Data deleted success",
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
      const username = req.body.username
      const password = req.body.password
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
        username: user.username,
        role_user: user.role_user,
        email: user.email,
        password: user.password,
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

};
