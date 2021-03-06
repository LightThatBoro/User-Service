import { TYPES_FOLDER } from "@frat/core";
import { readFile, writeFile } from "fs/promises";
import openapiTS, { SchemaObject } from "openapi-typescript";
import { join } from "path";

(async() => {
	const output = await openapiTS("./openapi.yaml", {
		formatter: (node: SchemaObject) => {
			if(node.format === "date-time") {
				return "Date | string"; // return the TypeScript “Date” type, as a string
			}
		}
		// for all other schema objects, let openapi-typescript decide (return undefined)
	});
	await writeFile("./src/types/gen.ts", output);

	const generatedFile = await readFile(join(TYPES_FOLDER, "gen.ts"), { encoding: "utf-8" });

	const operationsBlock = generatedFile.split("export interface operations {")[1]
		.split("export interface external")[0]; // getting the content of operations interface

	const operationsMediatorTs = `export const operationMediator = {${ operationsBlock }`
		.replace(/[;]/g, ",") // change the ";" to "," as per syntax of a ts object
		.replace(/parameters: [{]/g, "parameters: `{") // prepend "`" to beginning of parameters obj
		.replace(/requestBody: [{]/g, "requestBody: `{") // above but for requestBody with custom object
		.replace(/requestBody: co/g, "requestBody: `co") // above but for requestBody with component-ref
		.replace(/responses: [{]/g, "responses: `{") // above but for responses
		.replace(/Body"],/g, "Body]`,") // append the closing "`" of requestBody with component-ref
		.replace(/^    },/gm, "    }`,"); // append the closing "`" of above blocks

	await writeFile(join(TYPES_FOLDER, "operation-mediator.ts"), operationsMediatorTs);

	const schemaBlock = generatedFile.split(`export interface components {
  schemas:`)[1].split("responses")[0];

	const schemaNames = schemaBlock.match(/[^*]\s([A-Z][a-z]*)+:/g)
		?.map(e => e.trim().replace(":", ""));

	let typesIndexTs = "import { components } from \"./gen\";\n";

	for(const name of schemaNames!) {
		typesIndexTs+=`\nexport type I${name} = components["schemas"]["${name}"];\n`;
	}

	await writeFile(join(TYPES_FOLDER, "index.ts"), typesIndexTs);

})();
