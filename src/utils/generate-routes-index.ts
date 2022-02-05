import { camelize, kebabize, ROUTES_FOLDER, TEST_FOLDER, testFileBoilerplate, typeormRouteFileBoilerplate } from "@frat/core";
import { readdir, stat, writeFile } from "fs/promises";
import { join, parse, } from "path";
import { operationMediator } from "../types/operation-mediator";

export const readdirRecursive = async(dir: string): Promise<string[]> => {
	const subdirs = await readdir(dir);
	const files = await Promise.all(
		subdirs.map(
			async(subdir) => {
				const res = join(dir, subdir);
				return (await stat(res)).isDirectory() ? readdirRecursive(res) : [ res ];
			}
		)
	);
	return files.reduce((a, f) => a.concat(f), []);
};

const generateRoutes = async() => {
	for(const key of Object.keys(operationMediator)) {
		await writeFile(join(ROUTES_FOLDER, `${ kebabize(key) }.ts`), typeormRouteFileBoilerplate(key));
		await writeFile(join(TEST_FOLDER, `test.${ key }.ts`), testFileBoilerplate(kebabize(key).replace("-", " ")));
	}
};

const generateRoutesIndex = async() => {
	const files = await readdirRecursive(ROUTES_FOLDER);
	let indexTs = "//generated file, run 'yarn gen:routes' to update\n\nexport default {\n";
	for(let file of files) {
		const { name, ext } = parse(file);
		if(ext.endsWith("ts") && name !== "index") {
			// strip relative path, use path from inside routes folder
			// also -3 to remove ".ts" extension
			file = "." + file.slice(ROUTES_FOLDER.length, -3);
			indexTs += `\t${ camelize(name) }: async() => (await import("${ file }")).default,\n`;
		}
	}

	indexTs += "};";

	await writeFile(join(ROUTES_FOLDER, "index.ts"), indexTs);
};

generateRoutes().then(() => generateRoutesIndex().then(() => console.log("updated routes")));
