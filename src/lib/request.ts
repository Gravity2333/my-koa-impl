import http from "http";
import url from "url";
import qs from "querystring";

export type KoaRequest = {
  // http模块原生的request
  req: http.IncomingMessage;
  // http模块原生的response
  res: http.ServerResponse;

  //这俩指向一个东西 即req.headers
  header: Record<string, any>;
  headers: Record<string, any>;
  /** 查询url */
  url: string;
  /** 查询路径 不包含查询参数 */
  path: string;
  /** 请求方法 */
  method: string;
  /** 查询query */
  queryString: string;
  /** 查询query对象 */
  query: Record<string, any>;
  /** params */
  params: Record<string, any>;
};

/** 简单实现request代理 */
const request = {
  /** 处理header */
  get header() {
    // 调用方式为 ctx.request.header 此时this指向request
    // 可以直接通过 this.req.headers 获得
    return this.req.headers;
  },

  set header(val) {
    this.req.headers = val;
  },

  /** 处理headers */
  get headers() {
    return this.header;
  },

  set headers(val) {
    this.headers = val;
  },

  /** 处理 url */
  get url() {
    return this.req.url;
  },

  set url(val) {
    this.req.url = val;
  },

  /** 处理 path */
  get path() {
    const { pathname } = url.parse(this.url);
    return pathname;
  },

  set path(val) {
    const urlObj = url.parse(this.url);
    urlObj.pathname = val;
    this.url = url.format(urlObj);
  },

  /** 处理 method */
  get method() {
    return this.req.method;
  },

  set method(val) {
    this.req.method = val;
  },

  /** 处理 queryString */
  get queryString() {
    const { query } = url.parse(this.url);
    return query;
  },

  set queryString(val) {
    const urlObj = url.parse(this.url);
    urlObj.query = val;
    this.url = url.format(urlObj);
  },

  /** 处理query */
  get query() {
    const queryString = this.queryString;
    return qs.parse(queryString);
  },

  set query(obj) {
    this.queryString = qs.stringify(obj);
  },
} as KoaRequest;

export default request;
