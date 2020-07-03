// vue.config.js
const path = require("path");

function recursiveIssuer(m) {
    if (m.issuer) {
        return recursiveIssuer(m.issuer);
    } else if (m.name) {
        return m.name;
    } else {
        return false;
    }
}

module.exports = {
    /*   entry: {
        foo: path.resolve(__dirname, "src/foo"),
        bar: path.resolve(__dirname, "src/bar")
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                themeBlack: {
                    name: "theme-black",
                    test: (m, c, entry = "theme-black") =>
                        m.constructor.name === "CssModule" &&
                        recursiveIssuer(m) === entry,
                    chunks: "all",
                    enforce: true
                },
                themeOrange: {
                    name: "theme-orange",
                    test: (m, c, entry = "theme-orange") =>
                        m.constructor.name === "CssModule" &&
                        recursiveIssuer(m) === entry,
                    chunks: "all",
                    enforce: true
                }
            }
        }
    }, */
    configureWebpack: config => {
        //console.log("config option::", config);

        const entry = {
            themeBlack: path.resolve(__dirname, "src/theme-black"),
            themeOrange: path.resolve(__dirname, "src/theme-orange")
        };

        const optimization = {
            splitChunks: {
                cacheGroups: {
                    themeBlack: {
                        name: "theme-black",
                        test: (m, c, entry = "theme-black") =>
                            m.constructor.name === "CssModule" &&
                            recursiveIssuer(m) === entry,
                        chunks: "all",
                        enforce: true
                    },
                    themeOrange: {
                        name: "theme-orange",
                        test: (m, c, entry = "theme-orange") =>
                            m.constructor.name === "CssModule" &&
                            recursiveIssuer(m) === entry,
                        chunks: "all",
                        enforce: true
                    }
                }
            }
        };

        Object.assign(config, {
            entry,
            optimization
        });
    },
    /*
     * When set to true, eslint-loader will only emit warnings during webpack's compilation process in order not to break the flow during development.
     * If you want it to emit errors instead (i.e. when building for production), set it like this: lintOnSave: 'error'
     */
    lintOnSave: process.env.NODE_ENV !== "production" || "error"
};
