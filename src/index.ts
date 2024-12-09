import MyKoa from "./lib/application";
import KoaRouter from "./lib/middlewares/koa-router/router";
import userRouter from "./routers/users";
import apiRouter from "./routers/api";
import developerRouter from "./routers/developers";
import koaStatic from './lib/middlewares/koa-static'
import koaMount from './lib/middlewares/koa-mount'
import path from "path";

const myKoa = new MyKoa();

// 处理错误
myKoa.use(async (ctx, next) => {
    try {
        await next()
    } catch (e) {
        ctx.response.status = 500
        ctx.body = e
    }
})

myKoa.use(koaMount('/web-static',koaStatic(path.resolve(__dirname, '../public'))))

//redirct
myKoa.use((ctx,next) => {
    if(ctx.path === '' || ctx.path === '/'){
        ctx.status = 301
        ctx.res.setHeader('location','/web-static/index.html')
    }
})

// 注册developer router
userRouter.use(developerRouter.routes());

// 注册user路由
apiRouter.use(userRouter.routes());

// 注册api路由
myKoa.use(apiRouter.routes());

// 监听
myKoa.listen();
