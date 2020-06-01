import fs from "fs-extra";
import path from "path";
import { getOutputAbsolutePath } from "./utils";
import { DIST_PATH, THEMES_DB_PATH } from "./constant";

// @ts-ignore 初始没生成会导致错误，使用 require
/* import themesDb from "../../db/themes.db.json"; */

export function copyThemes(): Promise<any> {
    let themeName;

    const themesDb = require(THEMES_DB_PATH);

    const copyFilePromises = themesDb.map((themeItem: any) => {
        themeName = `${themeItem.key}.css`;
        return fs.copy(
            path.join(DIST_PATH, themeName),
            path.join(getOutputAbsolutePath(), themeName)
        );
    });

    return new Promise((resolve, reject) => {
        Promise.all(copyFilePromises)
            .then(resolve)
            .catch(reject);
    });
}
