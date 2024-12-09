"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const layer_1 = __importDefault(require("./layer"));
const index_1 = __importDefault(require("../koa-compose/index"));
var Methods;
(function (Methods) {
    Methods["GET"] = "GET";
    Methods["POST"] = "POST";
    Methods["PUT"] = "PUT";
    Methods["DELETE"] = "DELETE";
})(Methods || (Methods = {}));
/** Router对象 */
// @ts-ignore
class Router {
    constructor(options) {
        this.params = {};
        this.stack = [];
        this.opts = {};
        this.methods = [];
        this.opts = options;
        this.methods = options.methods || Object.values(Methods);
    }
    /** 创建Layer 注册路由 */
    register(path, methods, middlewares) {
        // 创建Layer
        const layer = new layer_1.default(path, methods, middlewares);
        // 设置prefix
        if (this.opts.prefiex) {
            layer.setPrefix(this.opts.prefiex);
        }
        // 设置params处理中间件
        Object.keys(this.params).forEach((paramName) => {
            const paramsMiddleware = this.params[paramName];
            layer.param(paramName, paramsMiddleware);
        });
        // 入stack
        this.stack.push(layer);
        // 返回this
        return this;
    }
    /** match Layer */
    match(path, method = "") {
        //@ts-ignore
        const _matchd = {
            path: [],
            pathAndMethod: [],
            route: false,
        };
        for (const layer of this.stack) {
            // 匹配path
            if (layer.regexp.test(path)) {
                _matchd.path.push(layer);
                // 判断method是否匹配
                if (layer.methods.length === 0 || layer.methods.indexOf(method) >= 0) {
                    // layer methods为空 表示匹配所有的方法
                    // 或者 当前请求method在layer.methods之内
                    _matchd.pathAndMethod.push(layer);
                    // 判断是否最终匹配 也就是必须有一个确定的method匹配上 才可以
                    if (layer.methods.length > 0) {
                        _matchd.route = true;
                    }
                }
            }
        }
        return _matchd;
    }
    /** 生成composed 的中间件 */
    middleware() {
        // 记录一下this 防止this丢失
        const _router = this;
        function dispatch(context, next) {
            // 从上下文获取path,method
            const path = context.path;
            const methods = context.method;
            // match Layer
            const matched = _router.match(path, methods);
            // 判断 是否最终匹配到了 即匹配了path和method
            if (!matched.route)
                return next();
            // 匹配到了，组合所有匹配到的middleware
            const middlewareChain = matched.pathAndMethod.reduce((memo, layer) => {
                /** 创建一个中间件用来处理当前layer的信息 */
                const _middleWare = (ctx, next) => {
                    // 设置params
                    ctx.request.params = layer.params(ctx.path, ctx.request.params);
                    next();
                };
                return [...memo, _middleWare, ...layer.stack];
            }, []);
            return (0, index_1.default)(middlewareChain)(context, next);
        }
        // 给dispatch方法设置router属性，来处理嵌套路由
        dispatch.router = _router;
        return dispatch;
    }
    /** 注册中间件 */
    // @ts-ignore
    use(...middlewares) {
        /** 判断重载 */
        if (Array.isArray(middlewares[0]) &&
            typeof middlewares[0][0] === "string") {
            /** path为数组形式，递归调用use注册 */
            middlewares[0].forEach((m) => {
                /** 从第一个middleware截取参数 */
                this.use(m, ...middlewares.slice(1));
            });
            return this;
        }
        // 记录path
        let path = "";
        if (typeof middlewares[0] === "string") {
            /** path为string */
            path = middlewares[0];
            middlewares = middlewares.slice(1);
        }
        for (const m of middlewares) {
            if (m.router) {
                // 嵌套路由，.router由routes函数挂到m上
                // 克隆m
                const clonedRouter = Object.assign(Object.create(Router.prototype), m.router, {
                    stack: [...m.router.stack],
                });
                // 创建cloneLayer 并且加入到当前stack
                for (let i = 0; i < clonedRouter.stack.length; i++) {
                    const currentLayer = clonedRouter.stack[i];
                    const clonedLayer = Object.assign(Object.create(layer_1.default.prototype), currentLayer);
                    /** 设置前缀 */
                    if (path) {
                        clonedLayer.setPrefix(path);
                    }
                    /** 设置整体前缀 */
                    if (this.opts.prefiex) {
                        clonedLayer.setPrefix(this.opts.prefiex);
                    }
                    /** cloneKLayer入stack */
                    this.stack.push(clonedLayer);
                    // 替换ClonedRouter中的Layer
                    clonedRouter.stack[i] = clonedLayer;
                }
                // 为clonedRouter设置中间件
                // 设置params处理中间件
                Object.keys(this.params).forEach((paramName) => {
                    const paramsMiddleware = this.params[paramName];
                    clonedRouter.param(paramName, paramsMiddleware);
                });
            }
            else {
                /** 非嵌套情况 */
                this.register(path, [], [m]);
            }
        }
        return this;
    }
    /** 返回composed middleware */
    routes() {
        console.log(22);
        return this.middleware();
    }
    /** 给已经实例好的路由对象设置prefix
     * @example
     *
     * ```javascript
     * router.prefix('/things/:thing_id')
     * ```
     * @param {String} prefix
     * @returns {Router}
     */
    prefix(_prefix) {
        /** 去掉prefix结尾的 “/” */
        _prefix = _prefix.replace(/\/$/, "");
        /** 设置新的prefix */
        this.opts.prefiex = _prefix;
        /** 更新所有的prefix */
        this.stack.forEach((layer) => {
            layer.setPrefix(_prefix);
        });
        return this;
    }
    /** param中间件函数
     * @example
     *
     * router.param('id',(id,ctx,next)=>{
     *   if(users[id]){
     *     return next()
     *   }
     *   ctx.throw(401)
     * })
     */
    param(paramName, paramMiddleware) {
        /** 记录一下param处理中间件 */
        this.params[paramName] = paramMiddleware;
        this.stack.forEach((layer) => {
            layer.param(paramName, paramMiddleware);
        });
    }
}
// 添加methods方法
Object.values(Methods).forEach((method) => {
    const methodName = method.toLowerCase();
    // 使用类型断言告诉 TypeScript 这些方法已经存在
    Router.prototype[methodName] = function (path, ...middlewares) {
        if (Array.isArray(path)) {
            return path.forEach((p) => {
                this[methodName](p, ...middlewares.slice(1)); // 递归处理多个path
            });
        }
        this.register(path, [method], middlewares);
        return this;
    };
});
exports.default = Router;
