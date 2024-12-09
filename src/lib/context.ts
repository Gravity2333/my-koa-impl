import http from "http";
import { KoaRequest } from "./request";
import { KoaResponse } from "./response";
import delegates from "delegates";

// 上下文对象定义
export type Context = {
  // Koa定义的Request
  request: KoaRequest;
  // koa定义的response
  response: KoaResponse;

  // http模块原生的request
  req: http.IncomingMessage;
  // http模块原生的response
  res: http.ServerResponse;

  // 别名, 代理代理request.header
  header: KoaRequest["header"];
  // 别名, 代理代理request.headers
  headers: KoaRequest["headers"];
  // 别名 代理request.header
  method: KoaRequest["method"];
  // 别名 代理request.url
  url: KoaRequest["url"];
  // 别名 代理request.path
  path: KoaRequest["path"];
  // 别名 代理request.query
  query: KoaRequest["query"];
  /** 别名 代理request.params */
  params: Record<string, any>;
  // 别名 代理request.queryString
  queryString: KoaRequest["queryString"];

  // 别名，代理response.body
  body: KoaResponse["body"];
  // 别名，代理response.message
  message: KoaResponse["message"];
  // 别名，代理response.type
  type: KoaResponse["type"];
  // 别名，代理response.status
  status: KoaResponse["status"];
};

const context = {} as Context;

/** 处理request代理 */
delegates(context, "request")
  .access("header")
  .access("headers")
  .access("method")
  .access("url")
  .access("path")
  .access("query")
  .access("params")
  .access("queryString");

/** 处理response代理 */
delegates(context, "response")
  .access("body")
  .access("message")
  .access("type")
  .access("status");

export default context;
