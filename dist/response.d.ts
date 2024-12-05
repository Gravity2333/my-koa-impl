import http from "http";
export type KoaResponse = {
    req: http.IncomingMessage;
    res: http.ServerResponse;
    header: Record<string, any>;
    headers: Record<string, any>;
    /** 响应体，类型任意，会根据类型封装 */
    body: any;
    /** 响应状态码 */
    status: number;
    /** 响应消息 对应statusMessage */
    message: string;
    /** 响应内容类型 对应ContentType */
    type: string;
};
declare const response: KoaResponse;
export default response;
