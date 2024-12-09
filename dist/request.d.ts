import http from "http";
export type KoaRequest = {
    req: http.IncomingMessage;
    res: http.ServerResponse;
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
declare const request: KoaRequest;
export default request;
