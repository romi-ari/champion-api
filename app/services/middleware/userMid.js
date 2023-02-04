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

    //check apakah role terdapat di dalam roles
    authorizedRoles.map (role => {
      if(user.role_user !== role){
        res.status(401).json({
          status: "FAIL",
          message: "Unauthorized access"
        })
        return
      }
    }) 
    
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({
      message: err.message,
    })
  }
};

function authorizeUser(req, res, next) {
  authorize(req, res, next, ["member", "admin",]);
};

function authorizeAdmin(req, res, next) {
  authorize(req, res, next, ["admin"]);
};

module.exports = {authorize, authorizeUser, authorizeAdmin}
