import path from "path";
import { get } from "lodash";
import {
    THEMES_CONFIG_PATH,
    OUTPUT_FOLDER_PATH,
    CONFIG_OUTPUTFOLDERNAME,
    THEMES_CONFIG,
    ENV_PRODUCTION
} from "./constant";
import minimist from "minimist";

// 获取主题配置信息
export function getThemesConfig() {
    delete require.cache[THEMES_CONFIG_PATH];

    try {
        return require(THEMES_CONFIG_PATH);
    } catch (err) {
        return {};
    }
}

// 将命令行传递的参数以对象形式返回
export function parseCmdArgs() {
    return minimist(process.argv.slice(2)) || {};
}

/*
获取输出目录绝对路径.如 C:\\app\\public\\themes
*/
export function getOutputAbsolutePath() {
    const outputFolderName =
        get(getThemesConfig(), CONFIG_OUTPUTFOLDERNAME) || "themes";
    return path.join(OUTPUT_FOLDER_PATH, outputFolderName);
}

/*
获取输出目录相对于 public 文件夹路径（相对路径）。默认是 ./themes
*/
export function getOutputRelativePath(fileName: string) {
    const outputFolderName =
        get(getThemesConfig(), CONFIG_OUTPUTFOLDERNAME) || "themes";

    return `./${outputFolderName}/${fileName}.css`;
}

// is production mod
export function isProductionEnv(): Boolean {
    return process.env.NODE_ENV === ENV_PRODUCTION;
}

// 主题配置消息
export function themesConfigMsg(attr: string): string {
    return `"${attr}" is incorrect in "${THEMES_CONFIG}" config file.`;
}

// is empty array
export function isEmptyArray(source: any): boolean {
    return !(Array.isArray(source) && source.length > 0);
}
