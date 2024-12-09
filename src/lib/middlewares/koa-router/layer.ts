import { MiddleWare } from "../../application";
import { pathToRegexp } from "path-to-regexp";
import type { Keys } from "path-to-regexp";

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
