const userRepo = require("../../repositories/userRepo");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv')
dotenv.config()

async function authorize(req, res, next, authorizedRoles){
  try {
    const bearerToken = req.headers.authorization;
    const token = bearerToken.split("Bearer ")[1];
    const tokenPayload = jwt.verify(token, process.env.JWT_SIGNATURE_KEY || "Rahasia")
    
    const user = await userRepo.findByPk(tokenPayload.id);
    req.user = user;
    //check apakah role terdapat di dalam roles
    // authorizedRoles.map (role => {
    //   console.log("ini role:",role)
    //   if(user.role_user !== role){
    //     res.status(401).json({
    //       status: "FAIL",
    //       message: "Unauthorized access"
    //     })
    //   }
    // }) 
    if(!authorizedRoles.includes(user.role_user)){
      res.status(401).json({
        status: "FAIL",
        message: "Unauthorized access"
      })
      return
    }
    next();
  } catch (err) {
    res.status(401).json({
      message: err.message,
    })
  }
};

function authorizeUser(req, res, next) {
  authorize(req, res, next, ["member","admin","superadmin"]);
};

function authorizeSuperAndAdmin(req, res, next) {
  authorize(req, res, next, ["admin","superadmin"]);
};

function authorizeAdmin(req, res, next) {
  authorize(req, res, next, ["admin"]);
};

function authorizeSuperAdmin(req, res, next) {
  authorize(req, res, next, ["superadmin"]);
};

module.exports = {authorize, authorizeUser, authorizeSuperAndAdmin, authorizeAdmin, authorizeSuperAdmin}
