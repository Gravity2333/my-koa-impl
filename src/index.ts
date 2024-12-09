import MyKoa from "./lib/application";
import KoaRouter from "./lib/middlewares/koa-router/router";

const myKoa = new MyKoa();

const router = new KoaRouter({
  prefiex: "/user",
});

// router.use((ctx, next) => {
//   (ctx as any).commonMiddleware = "commonMiddleware run";
//   next();
// });

// router.use("/api", (ctx, next) => {
//   (ctx as any).commonMiddleware = "commonMiddleware run";
//   next();
// });

// router.use(["/list", "/info"], (ctx, next) => {
//   (ctx as any).getInfo = "getInfo run";
//   next();
// });

router.get("/list", (ctx, next) => {
  ctx.body = [{ a: 100 }];
});

// console.log(router.routes())
// console.log(router);
// myKoa.use(router.routes());

myKoa.use(router.routes());
myKoa.listen();
