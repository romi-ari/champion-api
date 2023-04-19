/**
* @file contains service user 
*/
const { ref, getDownloadURL, uploadBytesResumable, deleteObject} = require("firebase/storage");
const {storage} = require("../../config/firebase-config");

// initializeApp(config.firebaseConfig)
// const storage = getStorage()

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require('joi');
const userRepo = require("../repositories/userRepo")
const championRepo = require("../repositories/championRepo")
const dotenv = require("dotenv");
dotenv.config();

const giveCurrentDateTime = () => {
  const today = new Date()
  const date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate()
  const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
  const dateTime = date +"-"+ time
  return dateTime
};

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

      //Requirements scheme
      const fnScheme = Joi.string().min(2).regex(/^[a-zA-Z]+$/).required()
      const req_fs = req.body.first_name

      const lnScheme = Joi.string().min(2).regex(/^[a-zA-Z]+$/).required()
      const req_ls = req.body.last_name

      const usernameScheme = Joi.string().min(3).regex(/^[a-zA-Z0-9_-]+$/).required()
      const req_username = req.body.username

      const emailSchema = Joi.string().email().required()
      const req_email = req.body.email

      const passwordSchema = Joi.string().regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/).required()
      const req_password = req.body.password

      const first_name = req_fs
      const last_name = req_ls
      const username = req_username
      const email = req_email
      const isPassword = req_password

      //Check whether the requirements for filling in the data have been met
      const fnErr = fnScheme.validate(first_name)
      if (fnErr.error) {
        return {
          response: 422,
          status: "FAIL",
          message: "Minimum first name length is 2 characters and does not contain numbers",
        }
      }

      const lnErr = lnScheme.validate(last_name)
      if (lnErr.error) {
        return {
          response: 422,
          status: "FAIL",
          message: "Minimum last name length is 2 characters and does not contain numbers",
        }
      }

      const usernameErr = usernameScheme.validate(username)
      if (usernameErr.error) {
        return {
          response: 422,
          status: "FAIL",
          message: `Minimum username length is 3 characters, only symbols - and _ are allowed`,
        }
      }

      const emailErr = emailSchema.validate(email)
      if (emailErr.error) {
        return {
          response: 422,
          status: "FAIL",
          message: "Invalid email address",
        }
      }

      const passwordErr = passwordSchema.validate(isPassword)
      if (passwordErr.error) {
        return {
          response: 422,
          status: "FAIL",
          message: "Password minimum 8 character long with at least one capital letter and one symbol ",
        }
      }

      const role_user = "admin"
      const password = await encryptPassword(isPassword)
      const profile_image = "/image/default_user_icon.png"

       //check if username exist
      const usernameExist = await userRepo.findOne(
        {where: {username}}
      )

      if (usernameExist !== null || undefined ||""){
        return {
          response: 403,
          status: "FAIL",
          message: "Username already registered",
        }
      }

      //check if email exist
      const emailExist = await userRepo.findOne(
        {where: {email}}
      )

      if(emailExist !== null || undefined || ""){
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

      //Requirements scheme
      const fnScheme = Joi.string().min(2).regex(/^[a-zA-Z]+$/).required()
      const req_fs = req.body.first_name

      const lnScheme = Joi.string().min(2).regex(/^[a-zA-Z]+$/).required()
      const req_ls = req.body.last_name

      const usernameScheme = Joi.string().min(3).regex(/^[a-zA-Z0-9_-]+$/).required()
      const req_username = req.body.username

      const emailSchema = Joi.string().email().required()
      const req_email = req.body.email

      const passwordSchema = Joi.string().regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/).required()
      const req_password = req.body.password

      const first_name = req_fs
      const last_name = req_ls
      const username = req_username
      const email = req_email
      const isPassword = req_password

      //Check whether the requirements for filling in the data have been met
      const fnErr = fnScheme.validate(first_name)
      if (fnErr.error) {
        return {
          response: 422,
          status: "FAIL",
          message: "Minimum first name length is 2 characters and does not contain numbers",
        }
      }

      const lnErr = lnScheme.validate(last_name)
      if (lnErr.error) {
        return {
          response: 422,
          status: "FAIL",
          message: "Minimum last name length is 2 characters and does not contain numbers",
        }
      }

      const usernameErr = usernameScheme.validate(username)
      if (usernameErr.error) {
        return {
          response: 422,
          status: "FAIL",
          message: `Minimum username length is 3 characters, only symbols - and _ are allowed`,
        }
      }

      const emailErr = emailSchema.validate(email)
      if (emailErr.error) {
        return {
          response: 422,
          status: "FAIL",
          message: "Invalid email address",
        }
      }

      const passwordErr = passwordSchema.validate(isPassword)
      if (passwordErr.error) {
        return {
          response: 422,
          status: "FAIL",
          message: "Password minimum 8 character long with at least one capital letter and one symbol",
        }
      }

      //check if username exist
      const usernameExist = await userRepo.findOne(
        {where: {username}}
      )

      if (usernameExist !== null || undefined ||""){
        return {
          response: 403,
          status: "FAIL",
          message: "Username already registered",
        }
      }

      //check if email exist
      const emailExist = await userRepo.findOne(
        {where: {email}}
      )

      if(emailExist !== null || undefined || ""){
        return {
          response: 403,
          status: "FAIL",
          message: "E-mail already registered",
        }
      }      

      const role_user = "member"
      const password = await encryptPassword(isPassword)
      const profile_image = "/image/default_user_icon.png"

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
          user,
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

  async updateUserProfile(req) {
    try{

      //Requirements scheme
      const fnScheme = Joi.string().min(2).regex(/^[a-zA-Z]+$/).required()
      const req_fs = req.body.first_name

      const lnScheme = Joi.string().min(2).regex(/^[a-zA-Z]+$/).required()
      const req_ls = req.body.last_name

      const usernameScheme = Joi.string().min(3).regex(/^[a-zA-Z0-9_-]+$/).required()
      const req_username = req.body.username

      const first_name = req_fs
      const last_name = req_ls
      const username = req_username

      //Check whether the requirements for filling in the data have been met
      const fnErr = fnScheme.validate(first_name)
      if (fnErr.error) {
        return {
          response: 422,
          status: "FAIL",
          message: "Minimum first name length is 2 characters and does not contain numbers",
        }
      }

      const lnErr = lnScheme.validate(last_name)
      if (lnErr.error) {
        return {
          response: 422,
          status: "FAIL",
          message: "Minimum last name length is 2 characters and does not contain numbers",
        }
      }

      const usernameErr = usernameScheme.validate(username)
      if (usernameErr.error) {
        return {
          response: 422,
          status: "FAIL",
          message: `Minimum username length is 3 characters, only symbols - and _ are allowed`,
        }
      }      

      //Check if the data entered is in the database
      if (!!username){

        const usernameExist = await userRepo.findOne(
          {where: {username}}
        )

        if (usernameExist !== null || undefined ||""){
          return {
            response: 403,
            status: "FAIL",
            message: "Username already registered",
          }
        }

        const user = await userRepo.update(req.user.id, {
          first_name,
          last_name,
          username,
        })

        return {user}

      }
  
    } catch (err){
      return {
        response: 400,
        status: "FAIL",
        message: "Update user profile failed",
        error: err.message,
      }
    } 
  },

  async updateProfilePicture(req) {
    try {
      // Delete old image from firebase storage
      const imageUrl = req.user.profile_image
      const fileName = decodeURIComponent(imageUrl.substring(imageUrl.lastIndexOf('/') + 1, imageUrl.indexOf('?')));
      const desertRef = ref(storage, `${fileName}`);
      deleteObject(desertRef)

      const dateTime = giveCurrentDateTime();
      const storageRef = ref(storage, `user-profiles/${dateTime + "_" + req.file.originalname}`)

      // Create file metadata including the content type 
      const metadata = {
          contentType: req.file.mimetype,
      };

      // Upload the file in the bucket storage
      const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata)

      //Grab the public url
      const url = await getDownloadURL(snapshot.ref)

      const profile_image = url
      const user = await userRepo.update(req.user.id, {
        profile_image,
      })
    
      return {user}

    } catch (err) {
      return {
        response: 400,
        status: "FAIL",
        message: "Update profile picture failed",
        error: err.message,
      }
    }
  },

  async changeEmail(req) {
    try{

      //Requirements scheme
      const emailSchema = Joi.string().email().regex(/@gmail\.com$/).required()
      const password = req.body.password
      const req_email = req.body.email

      const isPasswordCorrect = await checkPassword(req.user.password, password)
      if(!isPasswordCorrect) {
        return {
          response: 400, 
          message: "Incorrect password"
        }
      }

      const email = req_email
      const verified = false

      //Check whether the requirements for filling in the data have been met
      const emailErr = emailSchema.validate(email)
      if (emailErr.error) {
        return {
          response: 422,
          status: "FAIL",
          message: "Email must use @gmail.com",
        }
      }   

      if (!!email){

        const emailExist = await userRepo.findOne(
          {where: {email}}
        )

        if (emailExist !== null || undefined ||""){
          return {
            response: 403,
            status: "FAIL",
            message: "Email already registered",
          }
        }

        const user = await userRepo.update(req.user.id, {
          email,
          verified,
        })

        return {user}

      }
    } catch (err){
      return {
        response: 400,
        status: "FAIL",
        message: "Update email failed",
        error: err.message,
      }
    } 
  },

  async changePassword(req) {
    try{

      //Requirements scheme
      const passwordSchema = Joi.string().regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/).required()
      const old_password = req.body.old_password
      const new_password = req.body.new_password
      const confirm_password = req.body.confirm_password

      const isPasswordCorrect = await checkPassword(req.user.password, old_password)
      if(!isPasswordCorrect) {
        return {
          response: 400, 
          message: "Incorrect password"
        }
      }

      if(new_password !== confirm_password) {
        return {
          response: 400, 
          message: "Passwords did not match"
        }
      }

      const isPassword = confirm_password

      //Check whether the requirements for filling in the data have been met
      const passwordErr = passwordSchema.validate(isPassword)
      if (passwordErr.error) {
        return {
          response: 422,
          status: "FAIL",
          message: "Password minimum 8 character long with at least one capital letter and one symbol",
        }
      }   

      if (!!isPassword){
        const password = await encryptPassword(isPassword)

        const user = await userRepo.update(req.user.id, {
          password,
        })

        return {user}

      }
    } catch (err){
      return {
        response: 400,
        status: "FAIL",
        message: "Update password failed",
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
      console.log("tes", isPasswordCorrect)
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