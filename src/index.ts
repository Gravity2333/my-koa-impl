import MyKoa from "./lib/application";
import KoaRouter from "./lib/middlewares/koa-router/router";

const data = [
  { name: "dasdas", age: 18, type: "student" },
  { name: "dadassdas", age: 18, type: "student" },
  { name: "dassaddas", age: 18, type: "student" },
  { name: "dasdasdas", age: 18, type: "student" },
  { name: "dasdsas", age: 18, type: "student" },

  { name: "teacher - 1 ", age: 18, type: "teacher" },
  { name: "teacher - 1 das", age: 18, type: "teacher" },
  { name: "teacher - 1 das", age: 18, type: "teacher" },
  { name: "teacher - 1 das", age: 18, type: "teacher" },
  { name: "teacher - 1 s", age: 18, type: "teacher" },

  { name: "dasdas", age: 18, type: "user" },
  { name: "dadassdas", age: 18, type: "user" },
  { name: "dassaddas", age: 18, type: "user" },
  { name: "dasdasdas", age: 18, type: "user" },
  { name: "dasdsas", age: 18, type: "user" },
];

const stuRouter = new KoaRouter({
  prefiex: "/student",
});

stuRouter.get("/list", (ctx, next) => {
  ctx.type = "application/json";
  ctx.body = data.filter((f) => f.type === "student");
});

const teacherRouter = new KoaRouter({
  prefiex: "/teacher",
});

teacherRouter.get("/list", (ctx, next) => {
  ctx.type = "application/json";
  ctx.body = data.filter((f) => f.type === "teacher");
});

teacherRouter.get("/:id/info", (ctx, next) => {
  ctx.type = "application/json";
  ctx.body = {
    name: "TEST TEACHER",
    id: ctx.params.id,
    desc: " WIODJWDOPWJOPWD",
  };
});

const myKoa = new MyKoa();

myKoa.use((ctx, next) => {
  console.log(ctx.queryString, ctx.query);
  next();
});

const userRouter = new KoaRouter({});
// 设置前缀
userRouter.prefix("/user/");
userRouter.param("id", (id, ctx, next) => {
  console.log(id);
  next();
});

userRouter.get("/list", (ctx, next) => {
  ctx.type = "application/json";
  ctx.body = data;
});

userRouter.use(stuRouter.routes());
userRouter.use(teacherRouter.routes());

// console.log(router.routes())
console.log(userRouter);
// myKoa.use(router.routes());

myKoa.use(userRouter.routes());
myKoa.listen();
