import http from "http";

export type KoaResponse = {
  // http模块原生的request
  req: http.IncomingMessage;
  // http模块原生的response
  res: http.ServerResponse;

  //这俩指向一个东西 即req.headers
  header: Record<string, any>;
  headers: Record<string, any>;
  /** 响应体，类型任意，会根据类型封装 */
  body: any;
  /** 响应状态码 */
  status: number;
  /** 响应消息 对应statusMessage */
  message: string;
  /** 响应内容类型 对应ContentType */
  type: string;
};

const response = {
  /** 处理header */
  get header() {
    // 调用方式为 ctx.response.header 此时this指向response
    // 可以直接通过 this.res.getHeaders 获得
    return this.res.getHeaders();
  },

  /** 处理headers */
  get headers() {
    return this.header;
  },

  /** 设置status */
  get status() {
    return this.res.statusCode;
  },

  set status(val) {
    this.res.statusCode = val;
  },

  /** 处理message */
  get message() {
    return this.res.statusMessage;
  },

  set message(val) {
    this.res.statusMessage = val;
  },

  /** 处理ContentType */
  get type() {
    return this.headers["Content-Type"];
  },

  set type(val) {
    this.res.setHeader("Content-Type", val);
  },

  /** 处理body */
  get body() {
    /** 直接保存body即可，在中间件执行结束之后再处理 */
    return (this as any)._body;
  },

  set body(val) {
    // 如果访问了body，并且传入null/undefined 设置状态为204
    // 如果没修改body 就是默认的 404
    if (void 0 === val || null === val) {
      this.status = 204;
      this.message = "";
    } else {
      if (this.status < 500 && this.status >= 400) {
        this.status = 200;
        this.message = "";
      }
    }

    (this as any)._body = val;
  },
} as KoaResponse;

export default response;
