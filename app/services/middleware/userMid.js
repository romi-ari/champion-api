const userSvc = require("../userSvc");

module.exports = {

    async authorize(req, res, next){
        try {
          const bearerToken = req.headers.authorization;
          const token = bearerToken.split("Bearer ")[1];
          const tokenPayload = jwt.verify(
            token,
            process.env.JWT_SIGNATURE_KEY || "Rahasia"
          )
    
          //PENCARIAN DATA USER BERDASARKAN DARI TOKEN ID YANG LOGIN
          const user = await userSvc.findByPk(tokenPayload.id);
          req.user = user;
          next();
        } catch (err) {
          res.status(401).json({
            message: err.message,
          })
        }
    }
}