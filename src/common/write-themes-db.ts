import path from "path";
import lodash from "lodash";
import fs from "fs-extra";
import { getThemesConfig, getOutputRelativePath } from "./utils";
import { THEMES_DB_PATH, CONFIG_THEMES } from "./constant";

interface themeDbItem {
    key: string;
    themePath: string;
}

/* 输出主题db文件 */
export function writeThemeDb(): Promise<void> {
    const themesConfig = getThemesConfig();

    let themesDb: Array<themeDbItem> = [];

    const themes = lodash.get(themesConfig, CONFIG_THEMES);

    themes.forEach((themeItem: any) => {
        const filename = themeItem["themeName"];

        themesDb.push({
            key: filename,
            themePath: getOutputRelativePath(filename)
        });
    });

    // 输出主题db文件
    return fs.outputFile(path.join(THEMES_DB_PATH), JSON.stringify(themesDb));
}
