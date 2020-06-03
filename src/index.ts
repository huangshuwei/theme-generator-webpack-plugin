import { getCompiledCss } from "./common/get-compiled-css";
import { getDependenciesFilePath, clearDependenciesCache } from "./common/get-dependencies";

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

        process.env.NODE_ENV = compiler.options.mode;

        //console.log("compiler.options::", compiler.options);

        // emit hook
        compiler.hooks.emit.tapAsync(
            "compilerStylePlugin",
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
        compiler.hooks.compilation.tap(
            "InsertHtmlTagPlugin",
            (compilation: any) => {
                // Hook into the html-webpack-plugin processing and add the html
                const HtmlWebpackPlugin = compiler.options.plugins
                    .map((plugin: any) => plugin.constructor)
                    .find(
                        (constructor: any) =>
                            constructor &&
                            constructor.name === "HtmlWebpackPlugin"
                    );

                if (HtmlWebpackPlugin) {
                    HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
                        "HtmlWebpackBeforEmitPlugin",
                        (
                            htmlPluginData: any,
                            htmlWebpackPluginCallback: any
                        ) => {
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
            }
        );

        // watchRun hook
        compiler.hooks.watchRun.tapAsync(
            "ReCompileStylePlugin",
            (compiler: any, callback: any) => {
                let filesChange = compiler.watchFileSystem.watcher.mtimes;

                console.log("filesChange::", JSON.stringify(filesChange));

                callback();
            }
        );

        // afterCompile hook
        compiler.hooks.afterCompile.tapAsync(
            "AddDependenciesFilePlugin",
            (compilation: any, callback: any) => {
                // 把 HTML 文件添加到文件依赖列表，好让 Webpack 去监听 HTML 模块文件，在 HTML 模版文件发生变化时重新启动一次编译
                const option = this.option;

                // clear dependencies cache
                clearDependenciesCache();

                let filePaths: Array<string> = [];
                option.themes.forEach((themeItem: ThemeItem) => {
                    filePaths = filePaths.concat(themeItem.themeFiles);
                });

                filePaths.forEach((path: string) => {
                    const depsFilePaths = getDependenciesFilePath(path);
                    filePaths = filePaths.concat(depsFilePaths);
                });

                filePaths = [...new Set(filePaths)];

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
