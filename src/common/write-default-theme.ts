import lodash from "lodash";
const { pathExists, outputFile } = require("fs-extra");
import path from "path";
import { JSDOM } from "jsdom";
import {
    ROOT_PATH,
    CONFIG_DEFAULTTHEME,
    CONFIG_HTMLFILES,
    THEME_CREATOR_LOG
} from "./constant";
import { getThemesConfig } from "./utils";
import { setDomTheme } from "./set-dom-themes";
import consola from "consola";

export function writeDefaultThemes(): Promise<any> {
    const themesConfig = getThemesConfig();
    const defaultTheme = lodash.get(themesConfig, CONFIG_DEFAULTTHEME);
    const htmlFiles = lodash.get(themesConfig, CONFIG_HTMLFILES);

    const writeThemePromises = htmlFiles.map((htmlFilePath: any) => {
        const htmlFile = path.join(ROOT_PATH, htmlFilePath);

        if (!pathExists(htmlFile)) {
            return Promise.reject(`This file not exist :\r${htmlFile}`);
        }

        return JSDOM.fromFile(htmlFile, {
            runScripts: "outside-only"
        }).then((dom: any) => {
            // fixed output empty html,when html file is occupied
            const bodyContent = dom.window.document.getElementsByTagName(
                "body"
            )[0].innerHTML;
            if (bodyContent.length === 0) {
                return Promise.reject(
                    `This html file is occupied or empty:\n${htmlFile}`
                );
            } else {
                dom.window.document = setDomTheme(
                    defaultTheme,
                    dom.window.document
                );

                return outputFile(htmlFile, dom.serialize());
            }
        });
    });

    return new Promise((resolve, reject) => {
        Promise.all(writeThemePromises)
            .then(() => {
                consola.success(
                    `${THEME_CREATOR_LOG}Default theme is ${defaultTheme}`
                );

                resolve();
            })
            .catch(reject);
    });
}
