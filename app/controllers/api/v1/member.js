/**
 * @file contains request handler of post resource
 */
const { member } = require("../../../models");
const {createToken, encryptPassword, checkPassword} = require("./someFunction")
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv')
dotenv.config();

module.exports = {

  async list(req, res) {
    try {
      const memberList = await member.findAll();
      
      res.status(200).json({
        status: "OK",
        message: "List member data success",
        data: {
          memberList,
        },
      });
    }
    catch (err) {
      res.status(400).json({
        status: "FAIL",
        message: `List member failed, ${err.message}`,
      });
    };
  },

  async register(req, res) {
    try{
      const first_name = req.body.first_name;
      const last_name = req.body.last_name;
      const username = req.body.username;
      const member_id = uuidv4();
      const role_user = "member";
      const email = req.body.email;
      const address = req.body.address;
      const password = await encryptPassword(req.body.password);
      
      const register = await member.create({
        first_name,
        last_name,
        username,
        member_id,
        role_user,
        email,
        address,
        password,
      })
      res.status(201).json({
        status: "OK",
        message: "Register member success",
        data: register,
      });
    }
    catch (err) {
      res.status(422).json({
        status: "FAIL",
        message: `Register member failed, ${err.message}`,
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
      
      req.member = await member.findByPk(req.params.id)
      const user = await req.member.update( 
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
        message: "Update member data success",
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
      const showMemberById = await member.findByPk(req.params.id);
  
      res.status(200).json({
        status: "OK",
        message: "Show data by id success",
        data: showMemberById,
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
      req.member = await member.findByPk(req.params.id)
      const remove = await req.member.destroy()

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
      const username = req.body.username;
      const password = req.body.password;
      const user = await member.findOne({
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
