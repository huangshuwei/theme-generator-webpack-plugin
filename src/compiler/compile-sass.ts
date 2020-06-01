import { renderSync } from "sass";
import { optimizationCss } from "../common/optimization-css";

export async function compileSass(filePath: string) {
    const { css } = await renderSync({ file: filePath });
    return optimizationCss(css);
}
