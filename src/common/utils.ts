import { THEMES_CONFIG } from "./constant";
import minimist from "minimist";

// 将命令行传递的参数以对象形式返回
export function parseCmdArgs() {
    return minimist(process.argv.slice(2)) || {};
}

export function isProductionEnv(): boolean {
    return false;
}

// 主题配置消息
export function themesConfigMsg(attr: string): string {
    return `"${attr}" is incorrect in "${THEMES_CONFIG}" config file.`;
}

// is empty array
export function isEmptyArray(source: any): boolean {
    return !(Array.isArray(source) && source.length > 0);
}
