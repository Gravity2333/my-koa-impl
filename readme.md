# 简单实现koa 
( typescript ) 简化实现一个koa的基本功能，以了解其运作逻辑，源码逻辑困难的地方做了简化并且增加详细的注释

### 安装依赖
```sh
npm install
```

### 运行DEMO
```sh
npm run start
```

### 打包lib
```sh
npm run build
```

### 简单实用
```javascript
import MyKoa from "./lib/application";
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
    }else{
       return next()
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

```
### request包含方法：
```sh
access header headers 这俩指向一个东西 即req.headers

access url

access querystring

get origin protocol + host

access method

access path 不包含?query查询参数的url

access query 解析出的query -> obj

```

### response包含方法
```sh
access body

access header headers

set status

access message -> statusMessage

access type
```
### context别名包含
```sh
ctx.body 响应

ctx.message

ctx.type

ctx.status

ctx.header 请求头

ctx.method 请求方法

ctx.url 请求url

ctx.path 请求path

ctx.query 请求path

ctx.querystring 请求querystring# my-koa-impl
```
