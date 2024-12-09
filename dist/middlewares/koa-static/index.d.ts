import { Context } from "../../context";
declare function koaStatic(staticDirPath: string): (ctx: Context) => Promise<void>;
export default koaStatic;
