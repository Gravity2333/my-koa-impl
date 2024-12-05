import MyKoa from "./lib/application";

const myKoa = new MyKoa();

myKoa.use(async (ctx, next) => {
  // 错误处理
  try {
    await next();
  } catch (err: any) {
    ctx.status = 500;
    ctx.type = "text/plain";
    ctx.body = err.message;
  }
});

myKoa.use(async (ctx, next) => {
  console.log("async use 1 befire");
  await next();
  console.log("async use 1 after");
});

myKoa.use(async (ctx, next) => {
  console.log("async use 2 befire");
  await new Promise((r) => {
    setTimeout(() => {
      r("async");
    }, 1000);
  });
  await next();
  console.log("async use 2 after");
});

myKoa.use((ctx) => {
  console.log("sync use 3 befire");
  ctx.type = "application/json";
  ctx.body = [
    {
      a: 100,
      b: 200,
    },
  ];
  // JSON.parse("{sadasda}");
  console.log("sync use 3 after");
});

// myKoa.use( (ctx, next) => {
//   console.log("sync use 1 befire");
//   next();
//   console.log("sync use 1 after");
// });

// myKoa.use( (ctx, next) => {
//   console.log("sync use 2 befire");
//   next();
//   console.log("sync use 2 after");
// });

// myKoa.use((ctx) => {
//   console.log("sync use 3 befire");
//   ctx.response.end("hello koa");
//   console.log("sync use 3 after");
// });

myKoa.listen();
