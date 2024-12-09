import KoaRouter from "../lib/middlewares/koa-router/router";
// 创建路由
const apiRouter = new KoaRouter({});
// 设置前缀
apiRouter.prefix("/api/");

export default apiRouter;
