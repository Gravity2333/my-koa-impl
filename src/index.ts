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


const myKoa = new MyKoa();

const userRouter = new KoaRouter({
  prefiex: "/user",
});

userRouter.get("/list", (ctx, next) => {
  ctx.type = "application/json";
  ctx.body = data;
});

userRouter.use(stuRouter.routes());
userRouter.use(teacherRouter.routes())

userRouter.prefix('/api/')
// console.log(router.routes())
console.log(userRouter);
// myKoa.use(router.routes());

myKoa.use(userRouter.routes());
myKoa.listen();
