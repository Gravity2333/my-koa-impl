import MyKoa from "./lib/application";
import KoaRouter from "./lib/middlewares/koa-router/router";
import userRouter from "./routers/users";
import apiRouter from "./routers/api";
import developerRouter from "./routers/developers";

const myKoa = new MyKoa();

// 注册developer router
userRouter.use(developerRouter.routes());

// 注册user路由
apiRouter.use(userRouter.routes());

// 注册api路由
myKoa.use(apiRouter.routes());

// 监听
myKoa.listen();
