"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_to_regexp_1 = require("path-to-regexp");
/** 每个path对应一个layer */
class Layer {
    constructor(path, methods, middlewares) {
        this.options = {};
        /** 设置方法 */
        this.methods = methods;
        /** 将middlewares传入stack
         *  如果传入的不是中间件数组 需要进行转换
         */
        this.stack = Array.isArray(middlewares) ? middlewares : [middlewares];
        for (const s of this.stack) {
            if (typeof s !== "function") {
                throw new Error("中间件必须传入函数！");
            }
        }
        /** 没有问题了，给path赋值 */
        this.path = path;
        /** 生成正则表达式 */
        const { regexp, keys } = !path
            ? (0, path_to_regexp_1.pathToRegexp)(path, { end: false })
            : (0, path_to_regexp_1.pathToRegexp)(path);
        /** 设置正则 */
        this.regexp = regexp;
        /** 设置paramNames */
        this.paramNames = keys;
    }
    /** 获得一个params对象 */
    params(path, lastParams = {}) {
        var _a;
        const currentParams = {};
        /** 捕获到的参数 */
        const captures = ((_a = path.match(this.regexp)) === null || _a === void 0 ? void 0 : _a.slice(1)) || [];
        this.paramNames.forEach(({ name }, index) => {
            currentParams[name] = captures[index];
        });
        return Object.assign(Object.assign({}, lastParams), currentParams);
    }
    /** param中间件函数
     * @example
     *
     * layer.param('id',(id,ctx,next)=>{
     *   if(users[id]){
     *     return next()
     *   }
     *   ctx.throw(401)
     * })
     */
    param(paramName, paramMiddleware) {
        const handleMiddleware = (ctx, next) => {
            // 注意 params处理中间件是加到layer.stack前面的，此时ctx.params已经有params内容了
            paramMiddleware(ctx.params[paramName], ctx, next);
        };
        // 在handleMiddleware上挂上paramName，方便寻找插入位置
        handleMiddleware.paramName = paramName;
        // 插入的逻辑是，从stack头开始找，如果某个中间件没有paramName 则表示这个中间件不是params处理中间件，则直接插入到前面
        // 如果有id，代表是paran处理中间件 则按照其paramName在this.paramNames的顺序查找
        const paramNames = this.paramNames.map((p) => p.name);
        const x = paramNames.indexOf(paramName);
        // paramName 在 paramNames内 才插入
        if (x >= 0) {
            this.stack.some((fn, index) => {
                if (!fn.paramName || paramNames.indexOf(fn.paramName) > x) {
                    /** 插入到index */
                    this.stack.splice(index, 0, handleMiddleware);
                    return true;
                }
            });
        }
        return this;
    }
    /** 设置prefix
     *  处理 new Router({prefix: /prefix}) 的形式
     */
    setPrefix(prefix) {
        /** 重新设置path */
        const regEnd = (() => {
            var _a, _b;
            if (((_a = this.options) === null || _a === void 0 ? void 0 : _a.end) !== void 0) {
                return (_b = this.options) === null || _b === void 0 ? void 0 : _b.end;
            }
            const checkEnd = !!this.path;
            this.options.end = checkEnd;
            return checkEnd;
        })();
        this.path = `${prefix}${this.path}`;
        /** 重新设置正则 */
        const { regexp, keys } = (0, path_to_regexp_1.pathToRegexp)(this.path, {
            end: regEnd,
        });
        this.regexp = regexp;
        /** 重新设置paramNames */
        this.paramNames = keys;
    }
}
exports.default = Layer;
