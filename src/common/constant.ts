import { existsSync } from "fs-extra";
import { join, dirname } from "path";

function findRootDir(dir: string): string {
    if (dir === "/") {
        return "/";
    }

    if (existsSync(join(dir, THEMES_CONFIG))) {
        return dir;
    }

    return findRootDir(dirname(dir));
}

// env
export const ENV_DEVELOPMENT = "development";
export const ENV_PRODUCTION = "production";

// log info
export const THEME_CREATOR_LOG = "[theme-creator-cli info] ";

// names
export const THEMES_CONFIG = "themes.config.js";
export const SWITCH_THEME_DEV = "switch-theme-dev.js";
export const THEME_SWITCH_CLI_STYLE_ID = "theme_creator_cli_style_id";
export const THEME_SWITCH_CLI_SCRIPT_ID = "theme_creator_cli_script_id";

// Root paths
export const CWD = process.cwd();
export const ROOT_PATH = findRootDir(CWD);
export const THEMES_CONFIG_PATH = join(ROOT_PATH, THEMES_CONFIG);
export const THEMES_DB_PATH = join(__dirname, "../../db/themes.db.json");
export const DIST_PATH = join(__dirname, "../../dist");
// vue、react 默认的输出目录 /public/themes
export const OUTPUT_FOLDER_PATH = join(ROOT_PATH, "public");

// themes config names
export const CONFIG_THEMES = "themes";
export const CONFIG_THEMES_THEMENAME = "themes<array>.themeName";
export const CONFIG_THEMES_THEMEFILES = "themes<array>.themeFiles";
export const CONFIG_OUTPUTFOLDERNAME = "outputFolderName"; // vue、react 输出到 "/public"下的目录名称
export const CONFIG_WATCHDIR = "watchDir";
export const CONFIG_DEFAULTTHEME = "defaultTheme";
export const CONFIG_HTMLFILES = "htmlFiles";
export const CONFIG_HTMLLINKID = "htmlLinkId";
