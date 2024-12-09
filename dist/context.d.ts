import http from "http";
import { KoaRequest } from "./request";
import { KoaResponse } from "./response";
export type Context = {
    request: KoaRequest;
    response: KoaResponse;
    req: http.IncomingMessage;
    res: http.ServerResponse;
    header: KoaRequest["header"];
    headers: KoaRequest["headers"];
    method: KoaRequest["method"];
    url: KoaRequest["url"];
    path: KoaRequest["path"];
    query: KoaRequest["query"];
    /** 别名 代理request.params */
    params: Record<string, any>;
    queryString: KoaRequest["queryString"];
    body: KoaResponse["body"];
    message: KoaResponse["message"];
    type: KoaResponse["type"];
    status: KoaResponse["status"];
};
declare const context: Context;
export default context;
