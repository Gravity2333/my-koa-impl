import { Dispatch, MiddleWare } from "../../application";
import { Context } from "../../context";
export default function (middlewares: MiddleWare[]): (context: Context, outerDispatch: Dispatch) => Promise<any>;
