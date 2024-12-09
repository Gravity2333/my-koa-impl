import { Dispatch, MiddleWare } from "../../application";
import { Context } from "../../context";
import Layer, { ILayer } from "./layer";
import compose from "../koa-compose/index";

enum Methods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
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
  use(path: string, ...middleware: MiddleWare[]): IRouter; // 返回IRouter 实现链调用
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
// @ts-ignore
class Router implements IRouter {
  params: Record<string, ParamMiddleware> = {};
  stack: ILayer[] = [];
  opts: IRouterOptions = {};
  methods: Methods[] = [];
  // @ts-ignore
  get(path: string | string[], ...middleware: MiddleWare[]): IRouter;
  // @ts-ignore
  post(path: string | string[], ...middleware: MiddleWare[]): IRouter;
  // @ts-ignore
  put(path: string | string[], ...middleware: MiddleWare[]): IRouter;
  // @ts-ignore
  delete(path: string | string[], ...middleware: MiddleWare[]): IRouter;
  constructor(options: IRouterOptions) {
    this.opts = options;
    this.methods = options.methods || Object.values(Methods);
  }

  /** 创建Layer 注册路由 */
  register(path: string, methods: Methods[], middlewares: MiddleWare[]) {
    // 创建Layer
    const layer = new Layer(path, methods, middlewares);
    // 设置prefix
    if (this.opts.prefiex) {
      layer.setPrefix(this.opts.prefiex);
    }
    // 设置params处理中间件
    Object.keys(this.params).forEach((paramName) => {
      const paramsMiddleware = this.params[paramName];
      layer.param(paramName, paramsMiddleware);
    });

    // 入stack
    this.stack.push(layer);
    // 返回this
    return this;
  }

  /** match Layer */
  match(path: string, method: string = ""): Match {
    //@ts-ignore
    const _matchd: Match = {
      path: [],
      pathAndMethod: [],
      route: false,
    };

    for (const layer of this.stack) {
      // 匹配path
      if (layer.regexp.test(path)) {
        _matchd.path.push(layer);

        // 判断method是否匹配
        if (layer.methods.length === 0 || layer.methods.indexOf(method) >= 0) {
          // layer methods为空 表示匹配所有的方法
          // 或者 当前请求method在layer.methods之内
          _matchd.pathAndMethod.push(layer);

          // 判断是否最终匹配 也就是必须有一个确定的method匹配上 才可以
          if (layer.methods.length > 0) {
            _matchd.route = true;
          }
        }
      }
    }

    return _matchd;
  }

  /** 生成composed 的中间件 */
  private middleware(): MiddleWare {
    // 记录一下this 防止this丢失
    const _router = this;
    function dispatch(context: Context, next: Dispatch) {
      // 从上下文获取path,method
      const path = context.path;
      const methods = context.method;
      // match Layer
      const matched = _router.match(path, methods);

      // 判断 是否最终匹配到了 即匹配了path和method
      if (!matched.route) return next();

      // 匹配到了，组合所有匹配到的middleware
      const middlewareChain: MiddleWare[] = matched.pathAndMethod.reduce(
        (memo: MiddleWare[], layer) => {
          /** 创建一个中间件用来处理当前layer的信息 */
          const _middleWare = (ctx: Context, next: Dispatch) => {
            // 设置params
            ctx.request.params = layer.params(ctx.path, ctx.request.params);

            next();
          };
          return [...memo, _middleWare, ...layer.stack];
        },
        []
      );
      return compose(middlewareChain)(context, next);
    }

    // 给dispatch方法设置router属性，来处理嵌套路由
    dispatch.router = _router;
    return dispatch;
  }

  // @ts-ignore
  use(path: string, ...middleware: MiddleWare[]): IRouter; // 返回IRouter 实现链调用
  use(path: string[], ...middleware: MiddleWare[]): IRouter;
  use(...middleWare: MiddleWare[]): IRouter;
  /** 注册中间件 */
  // @ts-ignore
  public use(...middlewares: MiddleWare[]) {
    /** 判断重载 */
    if (
      Array.isArray(middlewares[0]) &&
      typeof middlewares[0][0] === "string"
    ) {
      /** path为数组形式，递归调用use注册 */
      middlewares[0].forEach((m) => {
        /** 从第一个middleware截取参数 */
        this.use(m, ...middlewares.slice(1));
      });
      return this as unknown as IRouter;
    }

    // 记录path
    let path = "";

    if (typeof middlewares[0] === "string") {
      /** path为string */
      path = middlewares[0];
      middlewares = middlewares.slice(1);
    }

    for (const m of middlewares) {
      if ((m as any).router) {
        // 嵌套路由，.router由routes函数挂到m上
        // 克隆m
        const clonedRouter = Object.assign(
          Object.create(Router.prototype),
          (m as any).router,
          {
            stack: [...(m as any).router.stack],
          }
        ) as IRouter;

        // 创建cloneLayer 并且加入到当前stack
        for (let i = 0; i < clonedRouter.stack.length; i++) {
          const currentLayer = clonedRouter.stack[i];
          const clonedLayer = Object.assign(
            Object.create(Layer.prototype),
            currentLayer
          );
          /** 设置前缀 */
          if (path) {
            clonedLayer.setPrefix(path);
          }
          /** 设置整体前缀 */
          if (this.opts.prefiex) {
            clonedLayer.setPrefix(this.opts.prefiex);
          }
          /** cloneKLayer入stack */
          this.stack.push(clonedLayer);
          // 替换ClonedRouter中的Layer
          clonedRouter.stack[i] = clonedLayer;
        }

        // 为clonedRouter设置中间件
        // 设置params处理中间件
        Object.keys(this.params).forEach((paramName) => {
          const paramsMiddleware = this.params[paramName];
          clonedRouter.param(paramName, paramsMiddleware);
        });
        
      } else {
        /** 非嵌套情况 */
        this.register(path, [], [m]);
      }
    }

    return this as unknown as IRouter;
  }

  /** 返回composed middleware */
  public routes() {
    console.log(22);
    return this.middleware();
  }

  /** 给已经实例好的路由对象设置prefix
   * @example
   *
   * ```javascript
   * router.prefix('/things/:thing_id')
   * ```
   * @param {String} prefix
   * @returns {Router}
   */
  prefix(_prefix: string) {
    /** 去掉prefix结尾的 “/” */
    _prefix = _prefix.replace(/\/$/, "");
    /** 设置新的prefix */
    this.opts.prefiex = _prefix;
    /** 更新所有的prefix */
    this.stack.forEach((layer) => {
      layer.setPrefix(_prefix);
    });
    return this;
  }

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
  param(paramName: string, paramMiddleware: ParamMiddleware) {
    /** 记录一下param处理中间件 */
    this.params[paramName] = paramMiddleware;

    this.stack.forEach((layer) => {
      layer.param(paramName, paramMiddleware);
    });
  }
}

// 添加methods方法
Object.values(Methods).forEach((method) => {
  const methodName = method.toLowerCase();
  // 使用类型断言告诉 TypeScript 这些方法已经存在
  (Router.prototype as any)[methodName] = function (
    path: string | string[],
    ...middlewares: MiddleWare[]
  ) {
    if (Array.isArray(path)) {
      return path.forEach((p) => {
        (this as any)[methodName](p, ...middlewares.slice(1)); // 递归处理多个path
      });
    }

    this.register(path, [method], middlewares);
    return this;
  };
});

export default Router;
