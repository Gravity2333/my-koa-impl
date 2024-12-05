"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = __importDefault(require("url"));
const querystring_1 = __importDefault(require("querystring"));
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
        const { pathname } = url_1.default.parse(this.url);
        return pathname;
    },
    set path(val) {
        const urlObj = url_1.default.parse(this.url);
        urlObj.pathname = val;
        this.url = url_1.default.format(urlObj);
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
        const { query } = url_1.default.parse(this.url);
        return query;
    },
    set queryString(val) {
        const urlObj = url_1.default.parse(this.url);
        urlObj.query = val;
        this.url = url_1.default.format(urlObj);
    },
    /** 处理query */
    get query() {
        const queryString = this.queryString;
        return querystring_1.default.parse(queryString);
    },
    set query(obj) {
        this.queryString = querystring_1.default.stringify(obj);
    },
};
exports.default = request;
