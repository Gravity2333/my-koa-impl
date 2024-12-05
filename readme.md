# 简单实现koa 
### request包含方法：

access header headers 这俩指向一个东西 即req.headers

access url

access querystring

get origin protocol + host

access method

access path 不包含?query查询参数的url

access query 解析出的query -> obj


### response包含方法
access body

access header headers

set status

access message -> statusMessage

access type

### context别名包含
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

