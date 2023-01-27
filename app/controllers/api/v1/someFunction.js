/**
 * @file contains function resource
*/
const { admin, member } = require("../../../models");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv')
dotenv.config();

module.exports = {
  
    encryptPassword(password) {
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
            message: "Encrypt failed",
            error: err.message,
          });
        }
    },
    
    checkPassword(encryptedPassword, password) {
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
          message: "Password doesn't match",
          error: err.message,
        });
      }
    },
    
    createToken(payload) {
      return jwt.sign(payload, process.env.JWT_SIGNATURE_KEY || "Rahasia");
    },
    
    isAdminMember(isAdmins, isMembers) {
      try{
        if (!isAdmins) {
          return admin.findByPk();
        }
        else if (!isMembers){
          return member.findByPk();
        }
      }
      catch (err) {
        res.status(400).json({
          status: "FAIL",
          message: "Something failed",
          error: err.message,
        });
      }
    },

    isLogin (isLoginAdmin, isLoginMember) {
      try{
        if (!isLoginAdmin) {
          return admin.findOne();
        }
        else if (!isLoginMember){
          return member.findOne();
        }
      }
      catch (err) {
        res.status(400).json({
          status: "FAIL",
          message: "Something failed",
          error: err.message,
        });
      }
    }
}