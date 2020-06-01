import {
    THEME_SWITCH_CLI_STYLE_ID,
    THEME_SWITCH_CLI_SCRIPT_ID,
    THEME_CREATOR_LOG,
    THEMES_DB_PATH,
    CONFIG_HTMLLINKID
} from "./constant";
import { getThemesConfig } from "./utils";

import lodash from "lodash";

// add style link
function addStyleLink(
    document: any,
    currentTheme: any,
    htmlLinkId: string
): any {
    let linkNode = document.getElementById(htmlLinkId);

    if (linkNode) {
        linkNode.setAttribute("href", currentTheme.themePath);
    } else {
        let creatLink = document.createElement("link");
        creatLink.type = "text/css";
        creatLink.id = htmlLinkId;
        creatLink.rel = "stylesheet";
        creatLink.href = currentTheme.themePath;
        document.getElementsByTagName("head")[0].appendChild(creatLink);
    }
    return document;
}

// add script vars
function addScriptVars(document: any, themesDb: any): any {
    let script = document.getElementById(THEME_SWITCH_CLI_SCRIPT_ID);

    if (script) {
        script.innerHTML = `window.theme_creator_cli_themeVars = ${JSON.stringify(
            themesDb
        )}`;
    } else {
        let creatScript = document.createElement("script");
        creatScript.type = "text/javascript";
        creatScript.id = THEME_SWITCH_CLI_SCRIPT_ID;
        creatScript.innerHTML = `window.theme_creator_cli_themeVars = ${JSON.stringify(
            themesDb
        )}`;
        document.getElementsByTagName("head")[0].appendChild(creatScript);
    }
    return document;
}

export function setDomTheme(themeName: string, document: any): any {
    const themesConfig = getThemesConfig();
    let htmlLinkId = lodash.get(themesConfig, CONFIG_HTMLLINKID);
    htmlLinkId = htmlLinkId ? htmlLinkId : THEME_SWITCH_CLI_STYLE_ID;

    const themesDb = require(THEMES_DB_PATH);

    const currentTheme = themesDb.find((x: any) => x.key === themeName);

    try {
        if (!currentTheme) {
            console.error(
                `${THEME_CREATOR_LOG} can not find theme name '${themeName}'`
            );
        }

        if (currentTheme) {
            // add style link
            document = addStyleLink(document, currentTheme, htmlLinkId);
            // add script vars
            document = addScriptVars(document, themesDb);
        }
    } catch (error) {
        console.error("error::", error);
    }

    return document;
}
