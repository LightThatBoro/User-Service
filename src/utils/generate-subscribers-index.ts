import { writeFile } from "fs/promises";
import { join, parse } from "path";
import { Subscribers } from "../types";
import { readdirRecursive } from "./generate-routes-index";

const SUBSCRIBERS_FOLDER = "src/subscribers";

const subFileBoilerplate = (pascalName: string) => `import { ISubscriberParams } from "../types";\n\nexport const ${ pascalName } = async({ userId, data, db }: ISubscriberParams) => {
\treturn;
};`;

const pascalize = (s: string) => s.replace(/(^\w|-\w)/g,
	x => x.replace(/-/, "").toUpperCase());

const kebabize = (s: string) => s.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

const generateSubscriberFile = async() => {
	for(const key of Object.keys(Subscribers)) {
		await writeFile(join(SUBSCRIBERS_FOLDER, `${ kebabize(key) }.ts`), subFileBoilerplate(key));
	}
};

const generateSubscribersIndex = async() => {
	const files = await readdirRecursive(SUBSCRIBERS_FOLDER);
	let indexTs = "//generated file, run 'yarn gen:subscribers' to update\n\n";
	let exports = "";

	for(let file of files) {
		const { name, ext } = parse(file);
		if(ext.endsWith("ts") && name !== "index") {
			// strip relative path, use path from inside routes folder
			// also -3 to remove ".ts" extension
			file = "." + file.slice(SUBSCRIBERS_FOLDER.length, -3);
			const pascalName = pascalize(name);
			indexTs += `import { ${ pascalName } } from "${ file }";\n`;
			exports += `\t${ pascalName },\n`;
		}
	}

	indexTs += "\nexport default {\n";

	indexTs += exports;

	indexTs += "};";

	await writeFile(join(SUBSCRIBERS_FOLDER, "index.ts"), indexTs);
};

generateSubscriberFile().then(() => {
	generateSubscribersIndex().then(() => console.log("updated subscribers"));
});
