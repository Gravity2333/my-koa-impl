import { Dispatch, MiddleWare } from "../../application";
import { pathToRegexp } from "path-to-regexp";
import type { Keys } from "path-to-regexp";
import { ParamMiddleware } from "./router";
import { Context } from "../../context";

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
  params: (
    path: string,
    lastParams: Record<string, any>
  ) => Record<string, any>;

  /** 注册param中间件 */
  param: (paramName: string, paramMiddleware: ParamMiddleware) => ILayer;
}

/** 每个path对应一个layer */
class Layer implements ILayer {
  methods: string[];
  paramNames: Keys;
  path: string;
  regexp: RegExp;
  stack: MiddleWare[];
  options: ILayerOptions = {};
  constructor(path: string, methods: string[], middlewares: any) {
    /** 设置方法 */
    this.methods = methods;
    /** 将middlewares传入stack
     *  如果传入的不是中间件数组 需要进行转换
     */
    this.stack = Array.isArray(middlewares) ? middlewares : [middlewares];

    for (const s of this.stack) {
      if (typeof s !== "function") {
        throw new Error("中间件必须传入函数！");
      }
    }

    /** 没有问题了，给path赋值 */
    this.path = path;

    /** 生成正则表达式 */
    const { regexp, keys } = !path
      ? pathToRegexp(path, { end: false })
      : pathToRegexp(path);
    /** 设置正则 */
    this.regexp = regexp;
    /** 设置paramNames */
    this.paramNames = keys;
  }

  /** 获得一个params对象 */
  params(path: string, lastParams: Record<string, any> = {}) {
    const currentParams: Record<string, any> = {};
    /** 捕获到的参数 */
    const captures = path.match(this.regexp)?.slice(1) || [];
    this.paramNames.forEach(({ name }, index) => {
      currentParams[name] = captures[index];
    });
    return {
      ...lastParams,
      ...currentParams,
    };
  }

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
  param(paramName: string, paramMiddleware: ParamMiddleware) {
    const handleMiddleware = (ctx: Context, next: Dispatch) => {
      // 注意 params处理中间件是加到layer.stack前面的，此时ctx.params已经有params内容了
      paramMiddleware(ctx.params[paramName], ctx, next);
    };

    // 在handleMiddleware上挂上paramName，方便寻找插入位置
    handleMiddleware.paramName = paramName;

    // 插入的逻辑是，从stack头开始找，如果某个中间件没有paramName 则表示这个中间件不是params处理中间件，则直接插入到前面
    // 如果有id，代表是paran处理中间件 则按照其paramName在this.paramNames的顺序查找
    const paramNames = this.paramNames.map((p) => p.name);

    const x = paramNames.indexOf(paramName);

    // paramName 在 paramNames内 才插入
    if (x >= 0) {
      this.stack.some((fn: any, index: number) => {
        if (!fn.paramName || paramNames.indexOf(fn.paramName) > x) {
          /** 插入到index */
          this.stack.splice(index, 0, handleMiddleware);
          return true;
        }
      });
    }

    return this;
  }

  /** 设置prefix
   *  处理 new Router({prefix: /prefix}) 的形式
   */
  setPrefix(prefix: string) {
    /** 重新设置path */
    const regEnd = (() => {
      if (this.options?.end !== void 0) {
        return this.options?.end;
      }
      const checkEnd = !!this.path;
      this.options.end = checkEnd;
      return checkEnd;
    })();

    this.path = `${prefix}${this.path}`;
    /** 重新设置正则 */
    const { regexp, keys } = pathToRegexp(this.path, {
      end: regEnd,
    });
    this.regexp = regexp;
    /** 重新设置paramNames */
    this.paramNames = keys;
  }
}

export default Layer;
