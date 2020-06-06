import path from "path";
import lodash from "lodash";
import { compileLess } from "../compiler/compile-less";
import { compileCss } from "../compiler/compile-css";
import { compileSass } from "../compiler/compile-sass";
import { themesConfigMsg } from "./utils";
import {
    CONFIG_THEMES,
    THEME_GENERATOR_WEBPACK_PLUGIN_LOG,
    CONFIG_THEMES_THEMENAME,
    CONFIG_THEMES_THEMEFILES
} from "./constant";
import consola from "consola";
import { isEmptyArray } from "./utils";

// 获取单个编译的主题内容
function getSingleCompiledCss(themesFiles: Array<string>): Promise<any> {
    const compileThemesPromise = themesFiles.map(
        (themeFile: string, index: number) => {
            const parsedPath = path.parse(themeFile);

            if (parsedPath.ext === ".less") {
                return compileLess(themeFile).then(res => {
                    return Promise.resolve({ order: index, content: res });
                });
            } else if (parsedPath.ext === ".scss") {
                return compileSass(themeFile).then(res => {
                    return Promise.resolve({ order: index, content: res });
                });
            } else {
                // 默认当 css 处理
                return compileCss(themeFile).then(res => {
                    return Promise.resolve({ order: index, content: res });
                });
            }
        }
    );

    return Promise.all(compileThemesPromise).then((cssContents: any) => {
        cssContents = lodash
            .orderBy(cssContents, ["order"], ["asc"])
            .map(item => item.content);

        return Promise.resolve(cssContents.join(""));
    });
}

// 获取编译的样式内容
export function getCompiledCss(themes: Array<any>): Promise<any> {
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
            return getSingleCompiledCss(themeItem["themeFiles"]).then(
                content => {
                    return Promise.resolve({
                        themeName: themeItem["themeName"],
                        content: content
                    });
                }
            );
        }
    });

    return Promise.all(compileThemesPromise)
        .then((res: any) => {
            return Promise.resolve(res);
        })
        .catch((error: any) => {
            consola.error(
                `${THEME_GENERATOR_WEBPACK_PLUGIN_LOG}Themes compile error:\n${error}`
            );
            return Promise.reject(error);
        });
}
