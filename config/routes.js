/**
* @file contains endpoint
*/

const express = require("express")
const apiRouter = express.Router()
const controllers = require("../app/controllers")
const { mid } = require("../app/services")

//============ Other endpoint ============//

apiRouter.post("/api/v1/login", controllers.api.v1.userCtrl.login)

//============ Admin endpoint ============//

apiRouter.get("/api/v1/admin",
    mid.userToken.authorize,
    mid.userToken.authorizeAdmin,
    controllers.api.v1.userCtrl.list
)
apiRouter.post("/api/v1/register-admin", 
    mid.userToken.authorize,
    mid.userToken.authorizeAdmin, 
    controllers.api.v1.userCtrl.registerAdmin
)
apiRouter.get("/api/v1/admin/:id", mid.userToken.authorize, controllers.api.v1.userCtrl.listById)
apiRouter.put("/api/v1/update/", mid.userToken.authorize, controllers.api.v1.userCtrl.update)
apiRouter.delete("/api/v1/delete/:id", mid.userToken.authorize, controllers.api.v1.userCtrl.destroy)

//============ Member endpoint ============//

apiRouter.post("/api/v1/register-member", controllers.api.v1.userCtrl.registerMember)
apiRouter.put("/api/v1/member/update/", mid.userToken.authorize, controllers.api.v1.userCtrl.update)
apiRouter.delete("/api/v1/delete/:id", mid.userToken.authorize, controllers.api.v1.userCtrl.destroy)

//============ Middleware ============//
  
apiRouter.use(controllers.api.main.onLost);
apiRouter.use(controllers.api.main.onError);

module.exports = apiRouter;