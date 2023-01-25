/**
 * @file contains function resource
*/

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
            message: `Encrypt failed, ${err.message}`,
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
          message: `Check password failed, ${err.message}`,
        });
      }
    },
    
    createToken(payload) {
      return jwt.sign(payload, process.env.JWT_SIGNATURE_KEY || "Rahasia");
    },
    
}