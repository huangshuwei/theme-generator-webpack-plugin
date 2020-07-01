// vue.config.js
const path = require("path");
const themeGeneratorWebpackPlugin = require("theme-generator-webpack-plugin");

module.exports = {
    configureWebpack: {
        plugins: [
            // themeGeneratorWebpackPlugin
            new themeGeneratorWebpackPlugin({
                themes: [
                    {
                        // theme name [string]
                        themeName: "theme-black",
                        // this theme includes files[Array<string>]
                        themeFiles: [
                            path.resolve("./src/css/themes/black/app.scss"),
                            path.resolve("./src/css/themes/black/element.less")
                        ]
                    },
                    {
                        themeName: "theme-blue",
                        themeFiles: [
                            path.resolve("./src/css/themes/blue/app.scss"),
                            path.resolve("./src/css/themes/blue/element.less")
                        ]
                    },
                    {
                        themeName: "theme-orange",
                        themeFiles: [
                            path.resolve("./src/css/themes/orange/app.scss"),
                            path.resolve("./src/css/themes/orange/element.less")
                        ]
                    },
                    {
                        themeName: "theme-red",
                        themeFiles: [
                            path.resolve("./src/css/themes/red/app.scss"),
                            path.resolve("./src/css/themes/red/element.less")
                        ]
                    }
                ],
                // default theme [string]。it will create link tag in your html file.
                defaultTheme: "theme-black",
                // themes output folder name [string].Will be created in the public directory
                outputFolderName: "themes",
                // those html file will effect [Array<string>]
                htmlFileNames: ["index.html"],
                // html link id  [string]。default link id is "theme_creator_cli_style_id"
                htmlLinkId: "theme-generator-webpack-plugin_style_id"
            })
        ]
    }
};
