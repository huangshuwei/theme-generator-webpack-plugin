import { join } from "path";

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
export const THEMES_DB_PATH = join(__dirname, "../../db/themes.db.json");
export const DIST_PATH = join(__dirname, "../../dist");

// themes config names
export const CONFIG_THEMES = "themes";
export const CONFIG_THEMES_THEMENAME = "themes<array>.themeName";
export const CONFIG_THEMES_THEMEFILES = "themes<array>.themeFiles";
export const CONFIG_OUTPUTFOLDERNAME = "outputFolderName"; // vue、react 输出到 "/public"下的目录名称
export const CONFIG_WATCHDIR = "watchDir";
export const CONFIG_DEFAULTTHEME = "defaultTheme";
export const CONFIG_HTMLFILES = "htmlFiles";
export const CONFIG_HTMLLINKID = "htmlLinkId";
