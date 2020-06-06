import path from "path";
import { readFileSync } from "fs-extra";

let existsDependenciesFilePath: Array<string> = [];

// https://regexr.com/5609v
const IMPORT_RE = /@import\s+?(?:(?:(?:[\w*\s{},]*)\s+from\s+?)|)(?:(?:".*?")|(?:'.*?'))[\s]*?(?:;|$|)/g;

function matchImports(code: string): string[] {
    return code.match(IMPORT_RE) || [];
}

function getPathByImport(code: string, filePath: string) {
    const divider = code.includes('"') ? '"' : "'";
    const relativePath = code.split(divider)[1];

    // exculde import from node_modules
    if (!relativePath.includes("~") && relativePath.includes(".")) {
        return path.join(filePath, "..", relativePath);
    }

    return null;
}

export function getDependenciesFilePath(filePath: string): Array<string> {
    if (existsDependenciesFilePath.includes(filePath)) {
        return [];
    }
    const code = readFileSync(filePath, "utf-8");

    existsDependenciesFilePath.push(filePath);

    const imports = matchImports(code);
    let paths = imports
        .map(item => getPathByImport(item, filePath))
        .filter(item => !!item) as string[];

    paths.forEach(path => {
        paths = paths.concat(getDependenciesFilePath(path));
    });

    return paths;
}

export function clearDependenciesCache() {
    console.log("clear deps cache.");
    existsDependenciesFilePath = [];
}
