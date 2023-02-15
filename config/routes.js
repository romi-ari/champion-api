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

//============ Member, Admin, and Superadmin can access this endpoint ============//

apiRouter.post("/api/v1/login", 
    controllers.api.v1.userCtrl.login
)
apiRouter.put("/api/v1/update",
    mid.userToken.authorize,
    mid.userToken.authorizeUser,
    controllers.api.v1.userCtrl.update
)
apiRouter.post("/api/v1/champion",
    mid.userToken.authorize,
    mid.userToken.authorizeUser,
    controllers.api.v1.championCtrl.registerChampion
)


//============ Super Admin and Admin  endpoint ============//

apiRouter.get("/api/v1/admin",
    mid.userToken.authorize,
    mid.userToken.authorizeSuperAndAdmin,
    controllers.api.v1.userCtrl.list
)
apiRouter.post("/api/v1/register-admin", 
    mid.userToken.authorize,
    mid.userToken.authorizeSuperAdmin, 
    controllers.api.v1.userCtrl.registerAdmin
)
apiRouter.put("/api/v1/champion/approved/:id",
    mid.userToken.authorize,
    mid.userToken.authorizeSuperAndAdmin,
    controllers.api.v1.userCtrl.approved
)
apiRouter.get("/api/v1/admin/:id", 
    mid.userToken.authorize,
    mid.userToken.authorizeAdmin, 
    controllers.api.v1.userCtrl.listById
)
apiRouter.delete("/api/v1/delete/:id", 
    mid.userToken.authorize,
    mid.userToken.authorizeSuperAdmin, 
    controllers.api.v1.userCtrl.destroy
)

//============ Member endpoint ============//

apiRouter.post("/api/v1/register-member", 
    controllers.api.v1.userCtrl.registerMember
)
apiRouter.post("/send-verify-email",
    mid.userToken.authorize, 
    mid.userToken.authorizeMember,
    controllers.api.v1.userVerificationCtrl.sendVerificationEmail
)
apiRouter.post("/verify-email/:verification_token",
    mid.userToken.authorize, 
    mid.userToken.authorizeMember,
    controllers.api.v1.userVerificationCtrl.verifyEmail
)
//============ Champion endpoint ============//

apiRouter.get("/api/v1/champion",
    mid.userToken.authorize,
    mid.userToken.authorizeUser,
    controllers.api.v1.championCtrl.list
)
// apiRouter.get("/api/v1/champion/approved",
//     controllers.api.v1.championCtrl.listApproved
// )
apiRouter.get("/api/v1/champion/:id",
    mid.userToken.authorize,
    mid.userToken.authorizeUser, 
    controllers.api.v1.championCtrl.listById
)
apiRouter.put("/api/v1/champion/:id",
    mid.userToken.authorize,
    mid.userToken.authorizeUser,
    controllers.api.v1.championCtrl.update
)
apiRouter.delete("/api/v1/champion/:id",
    mid.userToken.authorize,
    mid.userToken.authorizeUser, 
    controllers.api.v1.championCtrl.destroy
)

//============ Middleware ============//

apiRouter.use(controllers.api.main.onLost);
apiRouter.use(controllers.api.main.onError);

module.exports = apiRouter;