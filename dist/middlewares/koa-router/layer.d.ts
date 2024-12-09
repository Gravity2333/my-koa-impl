import { MiddleWare } from "../../application";
import type { Keys } from "path-to-regexp";
import { ParamMiddleware } from "./router";
export interface ILayerOptions {
    end?: boolean;
}
/** Layer对象用来保存路由对象 */
export interface ILayer {
    /** 记录methods */
    methods: string[];
    /** 记录path */
    path: string;
    /** 路径匹配正则 */
    regexp: RegExp;
    /** 用来记录params的key */
    paramNames: Keys;
    /** 记录中间件 */
    stack: MiddleWare[];
    /** opts */
    options: ILayerOptions;
    /** 增加prefix */
    setPrefix(prefix: string): void;
    /** 获取params */
    params: (path: string, lastParams: Record<string, any>) => Record<string, any>;
    /** 注册param中间件 */
    param: (paramName: string, paramMiddleware: ParamMiddleware) => ILayer;
}
/** 每个path对应一个layer */
declare class Layer implements ILayer {
    methods: string[];
    paramNames: Keys;
    path: string;
    regexp: RegExp;
    stack: MiddleWare[];
    options: ILayerOptions;
    constructor(path: string, methods: string[], middlewares: any);
    /** 获得一个params对象 */
    params(path: string, lastParams?: Record<string, any>): {
        [x: string]: any;
    };
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
    param(paramName: string, paramMiddleware: ParamMiddleware): this;
    /** 设置prefix
     *  处理 new Router({prefix: /prefix}) 的形式
     */
    setPrefix(prefix: string): void;
}
export default Layer;
