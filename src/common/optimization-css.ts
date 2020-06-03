import { isProductionEnv } from "./utils";
import autoprefixer from "autoprefixer";
import postcss from "postcss";
import uglifycss from "uglifycss";
import postcssDiscardDuplicates from "postcss-discard-duplicates";
import postcssMergeRules from "postcss-merge-rules";

export async function optimizationCss(source: string) {
    let postcssPlugins: Array<any> = [
        autoprefixer,
        // 去除重复样式
        postcssDiscardDuplicates,
        // 合并重复选规则
        postcssMergeRules
    ];

    if (isProductionEnv()) {
        const { css } = await postcss(postcssPlugins).process(source, {
            from: undefined
        });
        // 生产模式自动压缩
        return await uglifycss.processString(css);
    } else {
        return source;
    }
}
