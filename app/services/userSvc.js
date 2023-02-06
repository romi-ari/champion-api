/**
* @file contains service user 
*/

const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepo = require("../repositories/userRepo")
const dotenv = require("dotenv");
dotenv.config();

const encryptPassword = (password) => {
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
    } catch (error) {
      res.status(400).json({
        status: "FAIL",
        message: error.message,
      });
    }
  }
  
const checkPassword = (encryptedPassword, password) => {
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
  } catch (error) {
    res.status(400).json({
      status: "FAIL",
      message: error.message,
    });
  }
}
  
const createToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SIGNATURE_KEY || "Secret");
}

module.exports = {
  
  async list() {
    try {
      const users = await userRepo.findAll()
      const userTotal = await userRepo.getTotalUser()
      
      if(!(users && userTotal)){
        return{
          response: 404,
          status: "FAIL", 
          message: `No Data`,
        }
      }
      return {
          users: users,
          total: userTotal,
      }
    }catch (err){
      return {
        response: 400,
        status: "FAIL", 
        message: "List user failed",
        error: err.message
      }
    }
},

  async registerAdmin(req){
    try{
      const first_name = req.body.first_name
      const last_name = req.body.last_name
      const username = req.body.username
      const user_id = uuidv4()
      const role_user = "admin"
      const address = req.body.address
      const phone = req.body.phone
      const profile_image = "/image/default_user_icon.png"
      const email = req.body.email
      const password = await encryptPassword(req.body.password)
      const user = await userRepo.create({
        first_name,
        last_name,
        username,
        user_id,
        role_user,
        address,
        phone,
        profile_image,
        email,
        password,
      })
      return {user}
    } catch (err){
      return {
        response: 400,
        status: "FAIL",
        message: "Register user failed",
        error: err.message,
      }
    }                                      
  },

  async registerMember(req){
    try{
      const first_name = req.body.first_name
      const last_name = req.body.last_name
      const username = req.body.username
      const user_id = uuidv4()
      const role_user = "member"
      const address = req.body.address
      const phone = req.body.phone
      const profile_image = "/image/default_user_icon.png"
      const email = req.body.email
      const password = await encryptPassword(req.body.password)
      const user = await userRepo.create({
        first_name,
        last_name,
        username,
        user_id,
        role_user,
        address,
        phone,
        profile_image,
        email,
        password,
      })
      return {user}
    } catch (err){
      return {
        response: 400,
        status: "FAIL",
        message: "Register user failed",
        error: err.message,
      }
    }                                      
  },

  async listById(req){
    try {
      const id = req.params.id
      const user = await userRepo.findByPk(id)
      
      if(!user){
        return{
          response: 404,
          status: "FAIL", 
          message: `Can't find user by id ${id}`,
        }
      }
      return {
          data: user,
      }
    }catch (err){
      return {
        response: 400,
        status: "FAIL", 
        message: "Find user by id failed",
        error: err.message
      }
    }
  },

  async update(req) {
    try{
      console.log("ini role:", req.user)
      const first_name = req.body.first_name
      const last_name = req.body.last_name
      const username = req.body.username
      const role_user = req.body.role_user
      const address = req.body.address
      const phone = req.body.phone
      const profile_image = req.body.profile_image
      const email = req.body.email      

      if(!!req.body.password){
        const password = await encryptPassword(req.body.password)
        const user = await userRepo.update(req.user.id, {
          first_name,
          last_name,
          username,
          role_user,
          address,
          phone,
          profile_image,
          email,
          password,
        })
        return {user}
      }else{
        const user = await userRepo.update(req.user.id, {
          first_name,
          last_name,
          username,
          role_user,
          address,
          phone,
          profile_image,
          email,
        })
        return {user}
      }
    } catch (err){
      return {
        response: 400,
        status: "FAIL",
        message: "Update user failed",
        error: err.message,
      }
    } 
  },

  async destroy(req) {
      try{
        const id = req.params.id

        const user = await userRepo.delete({
          where: {id},
        })

        if(!user) {
          return{
            response: 400,
            status: "FAIL",  
            message: `Can't find user by id: ${id}`
          }
        }
        return {user}
      }catch (err){
        return {
          response: 400,
          status: "FAIL", 
          message: "Delete user failed",
          error: err.message
        }
      }
  },

  async login (req){
    try{
      const email = req.body.email
      const password = req.body.password

      const user = await userRepo.findOne({
        where: {email},
      })
      if (!user) {
        return {
          response: 404, 
          message: "Email address not found"
        }
      }

      const isPasswordCorrect = await checkPassword(user.password, password)
      if(!isPasswordCorrect) {
        return {
          response: 400, 
          message: "Incorrect password"
        }
      }

      const token = createToken({
        id: user.id,
        username: user.username,
        role_user: user.role_user,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
      return {token}
    }catch (err){
      return {
        response: 400,
        status: "FAIL", 
        message: "Login failed",
        error: err.message
      }
    }
  },
}