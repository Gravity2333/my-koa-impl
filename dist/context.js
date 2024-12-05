"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const delegates_1 = __importDefault(require("delegates"));
const context = {};
/** 处理request代理 */
(0, delegates_1.default)(context, "request")
    .access("header")
    .access("headers")
    .access("method")
    .access("url")
    .access("path")
    .access("query")
    .access("queryString");
/** 处理response代理 */
(0, delegates_1.default)(context, "response")
    .access("body")
    .access("message")
    .access("type")
    .access("status");
exports.default = context;
