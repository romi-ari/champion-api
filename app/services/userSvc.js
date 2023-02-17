/**
* @file contains service user 
*/

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepo = require("../repositories/userRepo")
const championRepo = require("../repositories/championRepo")
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
      const role_user = "admin"
      const profile_image = "/image/default_user_icon.png"
      const email = req.body.email
      const password = await encryptPassword(req.body.password)
      
      const usernameExist = await userRepo.findOne(
        {where: {username}}
      )
      if (usernameExist !== null){
        return {
          response: 403,
          status: "FAIL",
          message: "Username already registered",
        }
      }

      const emailExist = await userRepo.findOne(
        {where: {email}}
      )
      if(emailExist !== null){
        return {
          response: 403,
          status: "FAIL",
          message: "E-mail already registered",
        }
      } 

      const user = await userRepo.create({
        first_name,
        last_name,
        username,
        role_user,
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
      const role_user = "member"
      const profile_image = "/image/default_user_icon.png"
      const email = req.body.email
      const password = await encryptPassword(req.body.password)
      
      const usernameExist = await userRepo.findOne(
        {where: {username}}
      )
      if (usernameExist !== null){
        return {
          response: 403,
          status: "FAIL",
          message: "Username already registered",
        }
      }

      const emailExist = await userRepo.findOne(
        {where: {email}}
      )
      if(emailExist !== null){
        return {
          response: 403,
          status: "FAIL",
          message: "E-mail already registered",
        }
      } 

      const user = await userRepo.create({
        first_name,
        last_name,
        username,
        role_user,
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
      const first_name = req.body.first_name
      const last_name = req.body.last_name
      const username = req.body.username
      const role_user = req.body.role_user
      const profile_image = req.body.profile_image
      const email = req.body.email      

      if(!!req.body.password){
        const password = await encryptPassword(req.body.password)
        
        if(!!username){
          const usernameExist = await userRepo.findOne(
            {where: {username}}
          )
          if (usernameExist !== null){
            return {
              response: 403,
              status: "FAIL",
              message: "Username already registered",
            }
          }
        }

        if (!!email){
          const emailExist = await userRepo.findOne(
            {where: {email}}
          )
          if (emailExist !== null){
            return {
              response: 403,
              status: "FAIL",
              message: "E-mail already registered",
            }
          }
        }
        
        const user = await userRepo.update(req.user.id, {
          first_name,
          last_name,
          username,
          role_user,
          profile_image,
          email,
          password,
        })
        return {user}
      }else{
        if(!!username){
          const usernameExist = await userRepo.findOne(
            {where: {username}}
          )
          if (usernameExist !== null){
            return {
              response: 403,
              status: "FAIL",
              message: "Username already registered",
            }
          }
        } 
        
        if (!!email){
          const emailExist = await userRepo.findOne(
            {where: {email}}
          )
          if (emailExist !== null){
            return {
              response: 403,
              status: "FAIL",
              message: "E-mail already registered",
            }
          }
        }

        const user = await userRepo.update(req.user.id, {
          first_name,
          last_name,
          username,
          role_user,
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
        verified: user.verified,
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

  async approved(req) {
    try{
      const approved = req.body.approved 

      const champion = await championRepo.update(req.params.id, {
        approved,
      })
      return {champion}
    }catch (err){
      return {
        response: 400,
        status: "FAIL", 
        message: "Approved champion failed",
        error: err.message
      }
    }
  },
}