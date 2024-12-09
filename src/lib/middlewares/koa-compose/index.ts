import { Dispatch, MiddleWare } from "../../application";
import { Context } from "../../context";

export default function (middlewares: MiddleWare[]) {
  let nextMiddlewareIndex = -1;
  return function composedMiddleware(
    context: Context,
    outerDispatch: Dispatch
  ) {
    async function dispatch(index: number): Promise<any> {
      if (index <= nextMiddlewareIndex)
        throw new Error("next 方法只能调用一次！");
      if (index >= middlewares.length) {
        /** 所有中间件都调完了，调用外层dispatch */
        return await outerDispatch();
      }
      const currentMiddleware = middlewares[index];
      try {
        return await currentMiddleware(context, dispatch.bind(null, index + 1));
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return dispatch(0);
  };
}
