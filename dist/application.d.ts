import type { Context } from "./context";
type Dispatch = () => Promise<void>;
/**
 * middleware可以为同步/异步（返回Promise）
 */
interface MiddleWare {
    (context: Context, dispatch: Dispatch): any;
}
export default class MyKoa {
    private server;
    private middlewares;
    constructor();
    /**
     * 内部函数，处理httpServer的回调
     * @param request
     * @param response
     */
    private _callback;
    /**
     * 创建Context对象
     * @param {request} http的请求对象
     * @param {response} http的响应对象
     * @returns {Context} 上下文
     */
    private createContext;
    /**
     * 监听端口，默认localhost:8888
     * @param port
     * @param hostname
     * @param listeningListener
     */
    listen(port?: number, hostname?: string, listeningListener?: () => void): void;
    /**
     * 注册中间件
     * @param middleWare
     */
    use(middleWare: MiddleWare): void;
    /**
     * 组合中间件，把多个中间件组合成一个
     * @param {middlewares}
     * @returns {middleware}
     */
    compose(middlewares: MiddleWare[]): MiddleWare;
}
export {};
