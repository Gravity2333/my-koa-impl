"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const context_1 = __importDefault(require("./context"));
const request_1 = __importDefault(require("./request"));
const response_1 = __importDefault(require("./response"));
const stream_1 = require("stream");
class MyKoa {
    constructor() {
        this.middlewares = [];
        // 注意这里的this指向问题 this._callback是httpServer调用的，所以其this会被绑定为Server对象
        this.server = http_1.default.createServer(this._callback.bind(this));
    }
    /**
     * 内部函数，处理httpServer的回调
     * @param request
     * @param response
     */
    _callback(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            // 创建Context对象
            const context = this.createContext(request, response);
            // 初始化状态，设置response.status = 404
            // 如果后面没有赋值给body 会返回 404 Not Found
            context.response.status = 404;
            context.response.body = "Not Found";
            // 组合所有中间件
            const composedMiddleware = this.compose(this.middlewares);
            yield composedMiddleware(context, () => Promise.resolve());
            // 在所有中间件都运行结束后，解析body 设置响应
            // 保证用最后一次body的设置最终值
            const body = context.body;
            if (typeof body === "string") {
                context.res.end(body);
            }
            else if (Buffer.isBuffer(body)) {
                context.res.end(body);
            }
            else if (body instanceof stream_1.Stream) {
                body.pipe(context.res);
            }
            else if (typeof body === "number") {
                context.res.end(String(body));
            }
            else if (typeof body === "object" && body !== null) {
                context.res.end(JSON.stringify(body));
            }
            else {
                context.res.end();
            }
        });
    }
    /**
     * 创建Context对象
     * @param {request} http的请求对象
     * @param {response} http的响应对象
     * @returns {Context} 上下文
     */
    createContext(httpRequest, httpResponse) {
        /** 注意，context request response对象，本质上都是对http.request http.response的代理
         *  其中，http.request，http.response 分别以 req res的属性传入context request response对象
         */
        /** 通过object.create的方式 可以避免多个上下文之间数据冲突问题 */
        const _context = Object.create(context_1.default);
        const _request = Object.create(request_1.default);
        const _response = Object.create(response_1.default);
        /** 组合_context */
        _context.request = _request;
        _context.response = _response;
        /** 给context request response 对象分别赋 req res属性 */
        _context.req = _response.req = _request.req = httpRequest;
        _context.res = _response.res = _request.res = httpResponse;
        return _context;
    }
    /**
     * 监听端口，默认localhost:8888
     * @param port
     * @param hostname
     * @param listeningListener
     */
    listen(port = 8888, hostname = "127.0.0.1", listeningListener = () => {
        console.log("MyKoa listening on http://127.0.0.1:8888");
    }) {
        this.server.listen(port, hostname, listeningListener);
    }
    /**
     * 注册中间件
     * @param middleWare
     */
    use(middleWare) {
        this.middlewares.push(middleWare);
    }
    /**
     * 组合中间件，把多个中间件组合成一个
     * @param {middlewares}
     * @returns {middleware}
     */
    compose(middlewares) {
        /** 下一个要执行的中间件index
         *  这里主要为了防止多次调用dispatch函数
         *  当每个dispatch被调用时，会将nextMiddlewareIndex设置为对应middleware的index
         *  只有当前middleware的index>nextMiddlewareIndex 时，才能执行dispatch
         */
        let nextMiddlewareIndex = -1;
        /** 注意这个返回的composedMiddleware，其中dispatch为外部传来的dispatch 也就是当这个中间件执行完成之后，继续调用后面的中间件 */
        return function composedMiddleware(context, outerDispatch) {
            /**
             * dispatch
             * @param {index} middleware的index
             * 说明：这里的dispatch功能为: 执行第index个middleware，并且将第index+1的middleware封装传递给第index个中间件
             * 注意，为了实现完整的洋葱模型，这里的dispatch需要返回Promise
             */
            const dispatch = (index) => __awaiter(this, void 0, void 0, function* () {
                if (index <= nextMiddlewareIndex)
                    throw new Error("next方法不能被多次调用！");
                // 更新nextMiddlewareIndex
                nextMiddlewareIndex = index;
                let middleware;
                // 判断是否还有中间件可以取
                if (index >= (middlewares === null || middlewares === void 0 ? void 0 : middlewares.length)) {
                    // 没有可取中间件，说明没有下一个中间件了，此时执行的中间件赋为外层传入的_dispatch
                    return yield outerDispatch();
                }
                middleware = middlewares[index];
                try {
                    // 执行中间件，并且递归传入index+1的dispatch，注意这里dispatch由中间件内部调用，使用bind
                    // 注意，中间件可能是异步的，返回Promise 需要用await等待
                    return yield middleware(context, dispatch.bind(null, index + 1));
                }
                catch (err) {
                    return Promise.reject(err);
                }
            });
            // 执行dispatch(0) 也就是执行第一个中间件
            return dispatch(0);
        };
    }
}
exports.default = MyKoa;
