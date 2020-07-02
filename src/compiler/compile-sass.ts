import sass from "node-sass";
import tildeImporter from "node-sass-tilde-importer";
import { optimizationCss } from "../common/optimization-css";

export async function compileSass(filePath: string) {
    const { css } = await sass.renderSync({
        file: filePath,
        // A node-sass custom importer which turns ~ into absolute paths to the nearest parent node_modules directory.
        importer: tildeImporter
    });

    return optimizationCss(css);
}
