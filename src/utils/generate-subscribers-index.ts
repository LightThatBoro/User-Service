import { kebabize, pascalize, SUBSCRIBERS_FOLDER, typeormSubFileBoilerplate } from "@frat/core";
import { existsSync } from "fs";
import { writeFile } from "fs/promises";
import { join, parse } from "path";
import { Subscribers } from "../types/pubsub-types";
import { readdirRecursive } from "./generate-routes-index";

const generateSubscriberFile = async() => {
	for(const key of Object.keys(Subscribers)) {
		const subscriberFilePath = join(SUBSCRIBERS_FOLDER, `${kebabize(key)}.ts`);
		if(!existsSync(subscriberFilePath)) {
			await writeFile(subscriberFilePath, typeormSubFileBoilerplate(key));
		}
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
			indexTs += `import { ${pascalName} } from "${file}";\n`;
			exports += `\t${pascalName},\n`;
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
