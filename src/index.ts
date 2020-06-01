interface ThemeItem {
    themeName: string;
    themeFiles: Array<string>;
    defaultTheme: string;
    htmlFiles: Array<string>;
    outputFolderName?: string;
    htmlLinkId?: string;
}

interface Option {
    themes: Array<ThemeItem>;
}

class ThemeGeneratorWebpackPlugin {
    option: Option;
    constructor(Option: Option) {
        const defaultOpts = {
            themeName: "",
            themeFiles: [],
            defaultTheme: "",
            htmlFiles: [],
            outputFolderName: "themes",
            htmlLinkId: "theme_generator_webpack_plugin_style_id"
        };

        this.option = Object.assign(defaultOpts, Option);
    }

    apply(compiler: any) {
        const option = this.option;

        compiler.hooks.emit.tapAsync(
            "ThemeGeneratorWebpackPlugin",
            (compilation: any, callback: any) => {}
        );
    }
}
