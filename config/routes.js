/**
* @file contains endpoint
*/

const express = require("express")
const apiRouter = express.Router()
const controllers = require("../app/controllers")

//============ Other endpoint ============//

apiRouter.post("/api/v1/login", controllers.api.v1.userCtrl.login)

//============ User endpoint ============//

apiRouter.get("/api/v1/user", controllers.api.v1.userCtrl.list)
apiRouter.post("/api/v1/register", controllers.api.v1.userCtrl.register)
apiRouter.get("/api/v1/user/:id", controllers.api.v1.userCtrl.listById)
apiRouter.put("/api/v1/user/update/:id", controllers.api.v1.userCtrl.update)
apiRouter.delete("/api/v1/user/delete/:id", controllers.api.v1.userCtrl.destroy)

//============ Middleware ============//
  
apiRouter.use(controllers.api.main.onLost);
apiRouter.use(controllers.api.main.onError);

module.exports = apiRouter;