import { getCompiledCss } from "./common/get-compiled-css";

interface ThemeItem {
    themeName: string;
    themeFiles: Array<string>;
}

interface Option {
    themes: Array<ThemeItem>;
    defaultTheme: string;
    htmlFiles: Array<string>;
    outputFolderName?: string;
    htmlLinkId?: string;
    hash?: boolean;
}

const PLUGIN_NAME = "ThemeGeneratorWebpackPlugin";

class ThemeGeneratorWebpackPlugin {
    option: Option;
    constructor(option: Option) {
        const userOption: Option = option || {};

        const defaultOpts = {
            themes: [],
            defaultTheme: "",
            htmlFiles: [],
            outputFolderName: "themes",
            htmlLinkId: "theme_generator_webpack_plugin_style_id",
            hash: false
        };

        this.option = Object.assign(defaultOpts, userOption);
    }

    apply(compiler: any) {
        const option = this.option;

        // emit hook
        compiler.hooks.emit.tapAsync(
            PLUGIN_NAME,
            (compilation: any, callback: any) => {
                console.log("compile theme file start");
                console.time("compile theme file");
                getCompiledCss(option.themes).then(cssContents => {
                    cssContents.forEach((cssContent: any) => {
                        const fileName = cssContent.themeName + ".css";

                        compilation.assets[fileName] = {
                            source: () => cssContent.content,
                            size: () => cssContent.content.length
                        };
                    });
                    console.timeEnd("compile theme file");
                    callback();
                });
            }
        );

        // make hook
        compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation: any) => {
            // Hook into the html-webpack-plugin processing and add the html
            const HtmlWebpackPlugin = compiler.options.plugins
                .map((plugin: any) => plugin.constructor)
                .find(
                    (constructor: any) =>
                        constructor && constructor.name === "HtmlWebpackPlugin"
                );

            if (HtmlWebpackPlugin) {
                HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
                    PLUGIN_NAME,
                    (htmlPluginData: any, htmlWebpackPluginCallback: any) => {
                        htmlPluginData.html = htmlPluginData.html.replace(
                            /(?=<\/head>)/,
                            () => {
                                return getLink(option) + getScript(option);
                            }
                        );
                        htmlWebpackPluginCallback(null, htmlPluginData);
                    }
                );
            } else {
                throw new Error(
                    "Please ensure that `html-webpack-plugin` was used."
                );
            }
        });

        compiler.hooks.afterCompile.tapAsync(
            PLUGIN_NAME,
            (compilation: any, callback: any) => {
                // 把 HTML 文件添加到文件依赖列表，好让 Webpack 去监听 HTML 模块文件，在 HTML 模版文件发生变化时重新启动一次编译
                const option = this.option;

                let filePaths: Array<string> = [];
                option.themes.forEach((themeItem: ThemeItem) => {
                    filePaths = filePaths.concat(themeItem.themeFiles);
                });

                //compilation.fileDependencies.addAll(new Set(filePaths));
                filePaths.forEach((path: string) => {
                    if (!compilation.fileDependencies.has(path)) {
                        compilation.fileDependencies.add(path);
                    }
                });

                callback();
            }
        );
    }
}

// return link tag
function getLink(option: Option): string {
    let link = "";

    if (option.defaultTheme) {
        link = `<link id="${option.htmlLinkId}" rel="stylesheet" type="text/css" href="${option.defaultTheme}.css" />`;
    }

    return link;
}

// return script tag
function getScript(option: Option): string {
    let script = "";

    const themes = option.themes.map((themeItem: ThemeItem) => {
        return {
            key: themeItem.themeName,
            themePath: `./${themeItem.themeName}.css`
        };
    });

    return `<script type="text/javascript">
    window.generator_webpack_plugin_theme_vars = ${JSON.stringify(themes)};
</script>`;
}

module.exports = ThemeGeneratorWebpackPlugin;
