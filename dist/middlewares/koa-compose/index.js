"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
function default_1(middlewares) {
    let nextMiddlewareIndex = -1;
    return function composedMiddleware(context, outerDispatch) {
        function dispatch(index) {
            return __awaiter(this, void 0, void 0, function* () {
                if (index <= nextMiddlewareIndex)
                    throw new Error("next 方法只能调用一次！");
                if (index >= middlewares.length) {
                    /** 所有中间件都调完了，调用外层dispatch */
                    return yield outerDispatch();
                }
                const currentMiddleware = middlewares[index];
                try {
                    return yield currentMiddleware(context, dispatch.bind(null, index + 1));
                }
                catch (err) {
                    return Promise.reject(err);
                }
            });
        }
        return dispatch(0);
    };
}
