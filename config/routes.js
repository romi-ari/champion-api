const express = require("express");
const controllers = require("../app/controllers");

const appRouter = express.Router();
const apiRouter = express.Router();

/* Mount GET / handler */
appRouter.get("/", controllers.main.index);

//================== Admin Endpoint ==================//
apiRouter.post("/api/v1/login", controllers.api.v1.admin.login);
apiRouter.get("/api/v1/admin", controllers.api.v1.admin.list);
apiRouter.post("/api/v1/register-admin", controllers.api.v1.admin.register);
apiRouter.put("/api/v1/admin/:id",
  controllers.api.v1.admin.setadmin,
  controllers.api.v1.admin.update
);
apiRouter.get("/api/v1/admin/:id",
  controllers.api.v1.admin.setadmin,
  controllers.api.v1.admin.show
);
apiRouter.delete("/api/v1/admin/:id",
  controllers.api.v1.admin.setadmin,
  controllers.api.v1.admin.destroy
);

//================== Member Endpoint ==================//

apiRouter.get("/api/v1/member", controllers.api.v1.member.list);
apiRouter.post("/api/v1/create-member", controllers.api.v1.member.create);
apiRouter.put("/api/v1/member/:id",
  controllers.api.v1.member.setmember,
  controllers.api.v1.member.update
);
apiRouter.get("/api/v1/member/:id",
  controllers.api.v1.member.setmember,
  controllers.api.v1.member.show
);
apiRouter.delete("/api/v1/member/:id",
  controllers.api.v1.member.setmember,
  controllers.api.v1.member.destroy
);

//================== Champion Endpoint ==================//

apiRouter.get("/api/v1/champion", controllers.api.v1.champion.list);
apiRouter.post("/api/v1/create-champion", controllers.api.v1.champion.create);
apiRouter.put("/api/v1/champion/:id",
  controllers.api.v1.champion.setChampion,
  controllers.api.v1.champion.update
);
apiRouter.get("/api/v1/champion/:id",
  controllers.api.v1.champion.setChampion,
  controllers.api.v1.champion.show
);
apiRouter.delete("/api/v1/champion/:id",
  controllers.api.v1.champion.setChampion,
  controllers.api.v1.champion.destroy
);

apiRouter.use(controllers.api.main.onLost);
apiRouter.use(controllers.api.main.onError);

appRouter.use(apiRouter);

/** Mount Not Found Handler */
appRouter.use(controllers.main.onLost);

/** Mount Exception Handler */
appRouter.use(controllers.main.onError);

module.exports = appRouter;
