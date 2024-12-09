import { Dispatch, MiddleWare } from "../../application";
import { Context } from "../../context";
import { ILayer } from "./layer";
declare enum Methods {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}
interface IRouterOptions {
    prefiex?: string;
    methods?: Methods[];
}
/** param中间件函数类型 */
export interface ParamMiddleware {
    (id: string, context: Context, dispatch: Dispatch): any;
}
interface IRouter {
    /** params处理中间件记录对象 */
    params: Record<string, ParamMiddleware>;
    /** stack Layer对象stack */
    stack: ILayer[];
    /** opts: oprtions */
    opts: IRouterOptions;
    /** 支持的请求方法 */
    methods: Methods[];
    /** use方法,重载use方法 */
    use(path: string, ...middleware: MiddleWare[]): IRouter;
    use(path: string[], ...middleware: MiddleWare[]): IRouter;
    use(...middleWare: MiddleWare[]): IRouter;
    /** routes方法 */
    routes: () => MiddleWare;
    /** 给一个已经实例化好的路由修改prefix */
    prefix: (p: string) => IRouter;
    /** 给router设置params处理中间件 */
    param(paramName: string, paramMiddleware: ParamMiddleware): void;
}
interface Match {
    /** 所有路径匹配的Layer对象 */
    path: ILayer[];
    /** 路径和方法都匹配的Layer对象 */
    pathAndMethod: ILayer[];
    /** path是否匹配上 （方法和路径） */
    route: boolean;
    get(path: string | string[], ...middleware: MiddleWare[]): IRouter;
    post(path: string | string[], ...middleware: MiddleWare[]): IRouter;
    put(path: string | string[], ...middleware: MiddleWare[]): IRouter;
    delete(path: string | string[], ...middleware: MiddleWare[]): IRouter;
}
/** Router对象 */
declare class Router implements IRouter {
    params: Record<string, ParamMiddleware>;
    stack: ILayer[];
    opts: IRouterOptions;
    methods: Methods[];
    get(path: string | string[], ...middleware: MiddleWare[]): IRouter;
    post(path: string | string[], ...middleware: MiddleWare[]): IRouter;
    put(path: string | string[], ...middleware: MiddleWare[]): IRouter;
    delete(path: string | string[], ...middleware: MiddleWare[]): IRouter;
    constructor(options: IRouterOptions);
    /** 创建Layer 注册路由 */
    register(path: string, methods: Methods[], middlewares: MiddleWare[]): this;
    /** match Layer */
    match(path: string, method?: string): Match;
    /** 生成composed 的中间件 */
    private middleware;
    use(path: string, ...middleware: MiddleWare[]): IRouter;
    use(path: string[], ...middleware: MiddleWare[]): IRouter;
    use(...middleWare: MiddleWare[]): IRouter;
    /** 返回composed middleware */
    routes(): MiddleWare;
    /** 给已经实例好的路由对象设置prefix
     * @example
     *
     * ```javascript
     * router.prefix('/things/:thing_id')
     * ```
     * @param {String} prefix
     * @returns {Router}
     */
    prefix(_prefix: string): this;
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
    param(paramName: string, paramMiddleware: ParamMiddleware): void;
}
export default Router;
