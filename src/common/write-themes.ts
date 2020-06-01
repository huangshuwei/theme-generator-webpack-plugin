import path from "path";
import lodash from "lodash";
import fs from "fs-extra";
import { compileLess } from "../compiler/compile-less";
import { compileCss } from "../compiler/compile-css";
import { compileSass } from "../compiler/compile-sass";
import {
    getThemesConfig,
    getOutputAbsolutePath,
    themesConfigMsg
} from "./utils";
import {
    ROOT_PATH,
    CONFIG_THEMES,
    THEME_CREATOR_LOG,
    CONFIG_THEMES_THEMENAME,
    CONFIG_THEMES_THEMEFILES
} from "./constant";
import consola from "consola";
import { isEmptyArray } from "./utils";

// 输出单个主题
function writeSingleTheme(
    fileName: string,
    themesFiles: Array<string>
): Promise<any> {
    const outputFilePath: string = path.join(
        getOutputAbsolutePath(),
        fileName + ".css"
    );

    const compileThemesPromise = themesFiles.map(
        (themeFile: string, index: number) => {
            const sourceFilePath = path.join(ROOT_PATH, themeFile);
            const parsedPath = path.parse(sourceFilePath);

            if (parsedPath.ext === ".less") {
                return compileLess(sourceFilePath).then(res => {
                    return Promise.resolve({ order: index, content: res });
                });
            } else if (parsedPath.ext === ".scss") {
                return compileSass(sourceFilePath).then(res => {
                    return Promise.resolve({ order: index, content: res });
                });
            } else {
                // 默认当 css 处理
                return compileCss(sourceFilePath).then(res => {
                    return Promise.resolve({ order: index, content: res });
                });
            }
        }
    );

    return Promise.all(compileThemesPromise).then((cssContents: any) => {
        cssContents = lodash
            .orderBy(cssContents, ["order"], ["asc"])
            .map(item => item.content);

        return fs.outputFile(outputFilePath, cssContents.join("")).then(() => {
            return Promise.resolve(outputFilePath);
        });
    });
}

/* 输出主题文件 */
export function writeThemes(): Promise<any> {
    const themesConfig = getThemesConfig();
    const themes = lodash.get(themesConfig, CONFIG_THEMES);

    // 重要配置不能为空
    if (isEmptyArray(themes)) {
        return Promise.reject(themesConfigMsg(CONFIG_THEMES));
    }

    const compileThemesPromise = themes.map((themeItem: any) => {
        if (isEmptyArray(themeItem["themeFiles"])) {
            return Promise.reject(themesConfigMsg(CONFIG_THEMES_THEMEFILES));
        } else if (!themeItem["themeName"]) {
            return Promise.reject(themesConfigMsg(CONFIG_THEMES_THEMENAME));
        } else {
            // 输出单个主题文件
            return writeSingleTheme(
                themeItem["themeName"],
                themeItem["themeFiles"]
            );
        }
    });

    return new Promise((resolve, reject) => {
        Promise.all(compileThemesPromise)
            .then((themePaths: any) => {
                resolve();

                consola.success(
                    `${THEME_CREATOR_LOG} Output ${
                        themePaths.length
                    } themes:\n${themePaths.join("\n")}`
                );
            })
            .catch((error: any) => {
                reject(error);
                consola.error(
                    `${THEME_CREATOR_LOG}Themes compile error:\n${error}`
                );
            });
    });
}
