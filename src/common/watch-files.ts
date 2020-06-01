import path from "path";
import { writeThemes } from "../common/write-themes";
import { writeThemeDb } from "../common/write-themes-db";
import { writeDefaultThemes } from "../common/write-default-theme";
import consola from "consola";
import lodash from "lodash";
import chokidar from "chokidar";
import { getThemesConfig } from "../common/utils";
import {
    ROOT_PATH,
    THEME_CREATOR_LOG,
    CONFIG_WATCHDIR,
    THEMES_CONFIG_PATH
} from "../common/constant";

export async function watchFileChange() {
    const themesConfig = getThemesConfig();
    let watchDirs = lodash.get(themesConfig, CONFIG_WATCHDIR);

    watchDirs = watchDirs.map((dir: string) => {
        return path.join(ROOT_PATH, dir);
    });

    const matchedRule = /\.(css|scss|less)$/;
    const whiteList = [THEMES_CONFIG_PATH];

    const watcher = chokidar
        .watch(watchDirs, { persistent: true })
        .on("change", async path => {
            if (matchedRule.test(path) || whiteList.indexOf(path) > -1) {
                consola.info(
                    `\r\n${THEME_CREATOR_LOG} The following file has changed:\n ${path}`
                );
                await writeThemes()
                    .then(() => {
                        consola.success(
                            `${THEME_CREATOR_LOG}Themes recompile completed.`
                        );
                    })
                    .catch(error => {
                        consola.error(
                            `${THEME_CREATOR_LOG}Themes recompile error:\n${error}`
                        );
                    });
                await writeThemeDb();
                await writeDefaultThemes();
            }
        });

    // 配置文件添加监听
    watcher.add(THEMES_CONFIG_PATH);
}
