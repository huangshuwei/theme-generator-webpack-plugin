import { readFileSync } from "fs-extra";
import { optimizationCss } from "../common/optimization-css";

export async function compileCss(filePath: string): Promise<string> {
    const source = readFileSync(filePath, "utf-8");
    return optimizationCss(source);
}
