import { getCompiledCss } from "./common/get-compiled-css";
import {
    getDependenciesFilePath,
    clearDependenciesCache
} from "./common/get-dependencies";

interface ThemeItem {
    themeName: string;
    themeFiles: Array<string>;
}

interface Option {
    themes: Array<ThemeItem>;
    defaultTheme: string;
    htmlFileNames: Array<string>;
    outputFolderName?: string;
    htmlLinkId?: string;
    hash?: boolean;
}

let compileCount = 0;

class ThemeGeneratorWebpackPlugin {
    option: Option;
    constructor(option: Option) {
        const userOption: Option = option || {};

        const defaultOpts = {
            themes: [],
            defaultTheme: "",
            htmlFileNames: [],
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

        // make hook
        /* compiler.hooks.make.tapAsync(
            "compilerStylePlugin",
            (compilation: any, callback: any) => {
                console.log("compile theme file start");
                console.time("compile theme file");

            }
        ); */

        // compilation hook
        compiler.hooks.emit.tapAsync(
            "InsertHtmlContentPlugin",
            (compilation: any, callback: any) => {
                console.log("InsertHtmlContentPlugin coming");

                const { htmlFileNames } = this.option;

                console.log(2222222);

                let fontSize = ++compileCount * 10 + "px";
                let color = compileCount === 1 ? "red" : "orange";
                let cssContent = `*{
                    font-size:${fontSize};
                    color:${color};
                }`;

                console.log("cssContent::", cssContent);

                setTimeout(() => {
                    compilation.assets["test.css"] = {
                        source: () => cssContent,
                        size: () => cssContent.length
                    };

                    callback();
                }, 2000);

                /*  getCompiledCss(option.themes).then(cssContents => {
                    cssContents.forEach((cssContent: any) => {
                        const fileName = cssContent.themeName + ".css";

                        compilation.assets[fileName] = {
                            source: () => cssContent.content,
                            size: () => cssContent.content.length
                        };
                    });
                    console.timeEnd("compile theme file");
                    console.log(1111111);
                    callback();
                }); */
                //callback();
            }
        );

        // watchRun hook
        /*  compiler.hooks.watchRun.tapAsync(
            "ReCompileStylePlugin",
            (compiler: any, callback: any) => {
                let filesChange = compiler.watchFileSystem.watcher.mtimes;

                console.log("filesChange::", JSON.stringify(filesChange));

                callback();
            }
        ); */

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
                    // recompile
                    if (!compilation.fileDependencies.has(path)) {
                        compilation.fileDependencies.add(path);
                    }

                    // hot reload
                    /* if (!compilation.contextDependencies.has(path)){
                        compilation.contextDependencies.add(path);
                    } */
                    compilation.contextDependencies.add(path);
                });

                /*  const basename = path.basename(filename);
                compilation.assets[basename] = {
                    source: () => results.source,
                    size: () => results.size.size
                  }; */

                callback();
            }
        );
    }
}

// return link tag
function getLink(option: Option): string {
    let link = "";

    if (option.defaultTheme) {
        link = `<link id="${
            option.htmlLinkId
        }" rel="stylesheet" type="text/css" href="./${
            option.defaultTheme
        }.css?v=${new Date().getTime()}" />`;
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
