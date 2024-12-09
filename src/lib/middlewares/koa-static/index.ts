import path from "path"
import fs from 'fs'
import mime from 'mime'
import { Dispatch } from "../../application"
import { Context } from "../../context"

function koaStatic(staticDirPath: string) {
    return async (ctx: Context) => {
        const filePath = path.join(staticDirPath, ctx.path)
        const file = await fs.promises.readFile(filePath, { encoding: 'binary', flag: 'r' })
        const ext = path.extname(filePath)
        ctx.type = mime.getType(ext)!
        ctx.body = file
    }
}

export default koaStatic