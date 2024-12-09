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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const mime_1 = __importDefault(require("mime"));
function koaStatic(staticDirPath) {
    return (ctx) => __awaiter(this, void 0, void 0, function* () {
        const filePath = path_1.default.join(staticDirPath, ctx.path);
        const file = yield fs_1.default.promises.readFile(filePath, { encoding: 'binary', flag: 'r' });
        const ext = path_1.default.extname(filePath);
        ctx.type = mime_1.default.getType(ext);
        ctx.body = file;
    });
}
exports.default = koaStatic;
