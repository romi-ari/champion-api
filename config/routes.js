/**
* @file contains endpoint
*/

const express = require("express")
const apiRouter = express.Router()
const path = require('path');
const cors = require('cors');
const multer = require("multer")
const controllers = require("../app/controllers")
const {mid}  = require("../app/services")
const upload = multer({ storage: multer.memoryStorage() })

apiRouter.use(cors());
apiRouter.use(express.static(path.join(__dirname, '../bin/public')));

//============ Everyone can access this endpoint ============//

apiRouter.post("/forgot-password",
    controllers.api.v1.userVerificationCtrl.sendForgotPassword
)

apiRouter.post("/forgot-password/:forgot_password_token",
    controllers.api.v1.userVerificationCtrl.verifyPassword
)

//============ Member, Admin, and Superadmin can access this endpoint ============//

apiRouter.post("/api/v1/login", 
    controllers.api.v1.userCtrl.login
)

apiRouter.put("/settings/account",
    mid.userToken.authorize,
    mid.userToken.authorizeUser,
    controllers.api.v1.userCtrl.updateUserProfile
)

apiRouter.put("/profile-picture/upload", upload.single("file"),
    mid.userToken.authorize,
    mid.userToken.authorizeUser,
    controllers.api.v1.userCtrl.updateProfilePicture
)

apiRouter.put("/settings/email",
    mid.userToken.authorize,
    mid.userToken.authorizeUser,
    controllers.api.v1.userCtrl.changeEmail
)

apiRouter.put("/settings/security",
    mid.userToken.authorize,
    mid.userToken.authorizeUser,
    controllers.api.v1.userCtrl.changePassword
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

apiRouter.get("/verify-email/:verify_email_token",
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
    controllers.api.v1.championCtrl.updateChampion
)

apiRouter.put("/champion-profile/upload/:id", upload.single("file"),
    mid.userToken.authorize,
    mid.userToken.authorizeUser,
    controllers.api.v1.championCtrl.updateChampionProfilePicture
)

apiRouter.delete("/api/v1/champion/:id",
    mid.userToken.authorize,
    mid.userToken.authorizeUser, 
    controllers.api.v1.championCtrl.destroy
)

//============ Test ============//


//============ Middleware ============//

apiRouter.use(controllers.api.main.onLost);
apiRouter.use(controllers.api.main.onError);

module.exports = apiRouter;