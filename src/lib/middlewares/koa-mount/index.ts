import path from "path"
import fs from 'fs'
import mime from 'mime'
import { Dispatch, MiddleWare } from "../../application"
import { Context } from "../../context"
import { pathToRegexp } from "path-to-regexp"

function koaMount(mountPath: string, middleware: MiddleWare) {
    const { regexp: mountPathReg } = pathToRegexp(mountPath, { end: false })
    return async (ctx: Context, next: Dispatch) => {
        if (mountPathReg.test(ctx.path)) {
            ctx.path = ctx.path.replace(mountPath.replace(/\/$/, ""), "")
            console.log(ctx.path)
            await middleware(ctx, next)
        } else {
            await next()
        }
    }
}

export default koaMount