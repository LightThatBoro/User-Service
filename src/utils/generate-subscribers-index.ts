import { writeFile } from "fs/promises";
import { join, parse } from "path";
import { readdirRecursive } from "./generate-routes-index";

const SUBSCRIBERS_FOLDER = "src/subscribers";

const pascalize = (s: string) => s.replace(/(^\w|-\w)/g,
	x => x.replace(/-/, "").toUpperCase());

const generateSubscribersIndex = async() => {
	const files = await readdirRecursive(SUBSCRIBERS_FOLDER);
	let indexTs = "//generated file, run 'yarn gen:subscribers' to update\n\n";
	let exports = "";
	let enums = "";

	for(let file of files) {
		const { name, ext } = parse(file);
		if(ext.endsWith("ts") && name !== "index") {
			// strip relative path, use path from inside routes folder
			// also -3 to remove ".ts" extension
			file = "." + file.slice(SUBSCRIBERS_FOLDER.length, -3);
			const pascalName = pascalize(name);
			indexTs += `import { ${pascalName} } from "${ file }";\n`;
			exports += `\t${ pascalName },\n`;
			enums += `\t${ pascalName } = "${ pascalName }",\n`;
		}
	}

	indexTs += "\nexport default {\n";

	indexTs += exports;

	indexTs += "};";

	indexTs += "\n\nexport enum Subscribers {\n";

	indexTs += enums;

	indexTs += "}";

	await writeFile(join(SUBSCRIBERS_FOLDER, "index.ts"), indexTs);
};

generateSubscribersIndex().then(() => console.log("updated subscribers"));
