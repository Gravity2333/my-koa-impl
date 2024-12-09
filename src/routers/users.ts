import KoaRouter from "../lib/middlewares/koa-router/router";
import userList from "../mock/users";
// 创建路由
const userRouter = new KoaRouter({});
// 设置前缀
userRouter.prefix("/user/");
userRouter.get("/list", (ctx, next) => {
  ctx.type = "application/json";
  ctx.body = userList;
});

export default userRouter;
