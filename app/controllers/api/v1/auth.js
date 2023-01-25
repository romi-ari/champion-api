
/**
 * @file contains request handler of post resource
*/

const { admin, member } = require("../../../models");
const {createToken, checkPassword} = require("./someFunction")
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

            const user = await admin.findByPk(tokenPayload.id);
            req.user = user;
            next();
        }
        catch (err) {
            res.status(401).json({
                message: err.message,
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

    // async login (req, res) {
    //     try{
    //       const email = req.body.email
    //       const password = req.body.password

    //       const userAdmin = await admin.findOne({where: {email},})
    //       const userMember = await member.findOne({where: {email},})

    //       if (!(userAdmin || userMember)) {
    //         res.status(404).json({ message: "email or Password invalid"})
    //         return
    //       }

    //       const matchAdminPassword = await checkPassword(userAdmin.password, password);
    //       const matchMemberPassword = await checkPassword(userMember.password, password);

    //       if (!(matchAdminPassword)) {
    //         const token = createToken({
    //             id: userAdmin.id,
    //             email: userAdmin.email,
    //             role_user: userAdmin.role_user,
    //             email: userAdmin.email,
    //             password: userAdmin.password,
    //         })
    //         res.status(201).json({
    //             status: "OK",
    //             message: "Login Success",
    //             token,
    //         });
    //         res.status(404).json({ message: "email or Password invalid"})
    //         return
    //       } else if (!(matchMemberPassword)) {
    //         const token = createToken({
    //             id: userMember.id,
    //             email: userMember.email,
    //             role_user: userMember.role_user,
    //             email: userMember.email,
    //             password: userMember.password,
    //         })
    //         res.status(201).json({
    //             status: "OK",
    //             message: "Login Success",
    //             token,
    //         });
    //         res.status(404).json({ message: "email or Password invalid"})
    //         return
    //       }

        //   const matchMemberPassword = await checkPassword(userMember.password, password);

        //   if (!(matchAdminPassword || matchMemberPassword)) {
        //     res.status(409).json({ message: "The password that you've entered is incorrect" });
        //     return;
        //   }
    //     } 
    //     catch (err) {
    //         res.status(401).json({
    //           status: "FAILED",
    //           message: `Login Failed, ${err.message}`,
    //         });
    //     }
    //   },

}