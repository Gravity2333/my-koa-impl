import { Dispatch, MiddleWare } from "../../application";
import { Context } from "../../context";
declare function koaMount(mountPath: string, middleware: MiddleWare): (ctx: Context, next: Dispatch) => Promise<void>;
export default koaMount;
