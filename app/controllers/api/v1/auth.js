
/**
 * @file contains request handler of post resource
*/
const {admin} = require("../../../models")
const {createToken, checkPassword, isAdminMember, isLogin} = require("./someFunction")
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();

module.exports = {

    async tokenLogin (req, res, next) {
        try{
            const bearerToken = req.headers.authorization
            const token = bearerToken.split("Bearer ")[1]
            const tokenPayload = jwt.verify(
                token,
                process.env.JWT_SIGNATURE_KEY || "Rahasia"
            )

            const user = await isAdminMember(tokenPayload.id);
            req.user = user;
            next();
        }
        catch (err) {
            res.status(401).json({ 
              status: "FAIL",
              message: "Failed to retrieve token",
              error : err.message,
            });
        }
    },

    async login (req, res) {
        try{
          const email = req.body.email
          const password = req.body.password
          const whoIsLogin = await isLogin({where: {email}})
          console.log("find user: ", whoIsLogin)

          if (!whoIsLogin) {
            res.status(404).json({ 
              status: "FAIL",
              message: "Invalid email",
            })
            return
          }
          const matchUserPassword = await checkPassword(whoIsLogin.password, password);
          console.log("find password: ", matchUserPassword)

          if (!matchUserPassword) {
            res.status(409).json({
              status: "FAIL",
              message: "Wrong password", 
            });
            return
          }

          const token = createToken({
            id: matchUserPassword.id,
            email: matchUserPassword.email,
            username: matchUserPassword,
            role_user: matchUserPassword.role_user,
          })
          res.status(201).json({
            status: "OK",
            message: "Login Success",
            token,
          });
        } 
        catch (err) {
          res.status(401).json({
            status: "FAILED",
            message: `Login Failed, ${err.message}`,
          });
        }
      },

}