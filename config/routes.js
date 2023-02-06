/**
* @file contains endpoint
*/

const express = require("express")
const apiRouter = express.Router()
const path = require('path');
const cors = require('cors');
const controllers = require("../app/controllers")
const {mid}  = require("../app/services")

apiRouter.use(cors());
apiRouter.use(express.static(path.join(__dirname, '../bin/public')));

//============ Member, Admin, Superadmin can access this endpoint ============//

apiRouter.post("/api/v1/login", 
    controllers.api.v1.userCtrl.login
)
apiRouter.put("/api/v1/update",
    mid.userToken.authorize,
    mid.userToken.authorizeUser,
    controllers.api.v1.userCtrl.update
)

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
apiRouter.get("/api/v1/admin/:id", 
    mid.userToken.authorize, 
    controllers.api.v1.userCtrl.listById
)
apiRouter.delete("/api/v1/delete/:id", 
    mid.userToken.authorize, 
    controllers.api.v1.userCtrl.destroy
)

//============ Member endpoint ============//

apiRouter.post("/api/v1/register-member", 
    controllers.api.v1.userCtrl.registerMember
)
apiRouter.delete("/api/v1/delete/:id", 
    mid.userToken.authorize, 
    controllers.api.v1.userCtrl.destroy
)

//============ Champion endpoint ============//

apiRouter.get("/api/v1/champion", 
    controllers.api.v1.championCtrl.list
)
apiRouter.post("/api/v1/champion",
    controllers.api.v1.championCtrl.registerChampion
)
apiRouter.get("/api/v1/champion/:id", 
    controllers.api.v1.championCtrl.listById
)
apiRouter.put("/api/v1/champion/:id", 
    controllers.api.v1.championCtrl.update
)
apiRouter.delete("/api/v1/champion/:id", 
    controllers.api.v1.championCtrl.destroy
)

//============ Middleware ============//

apiRouter.use(controllers.api.main.onLost);
apiRouter.use(controllers.api.main.onError);

module.exports = apiRouter;