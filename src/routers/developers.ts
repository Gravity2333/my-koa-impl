import KoaRouter from "../lib/middlewares/koa-router/router";
import userList from "../mock/users";

const developers = userList.filter((user) => user.profession === "Developer");
// 创建路由
const developerRouter = new KoaRouter({
  prefiex: "/developer",
});

developerRouter.get("/list", (ctx, next) => {
  ctx.type = "application/json";
  ctx.body = developers;
});

developerRouter.get("/:id/info", (ctx, next) => {
  const { id } = ctx.params;
  ctx.type = "application/json";
  ctx.body = developers.find((d) => d.id == id) || [];
});

export default developerRouter;
