export const SUBSCRIBERS_FOLDER = "src/subscribers";

export const TYPES_FOLDER = "src/types";

export const ROUTES_FOLDER = "src/routes";

export const routeFileBoilerplate = (camelName: string) => `import { Boom } from "@hapi/boom";
import { Handler } from "../utils/make-api";

// the "Handler" type automatically does type checks for the response as well
const handler: Handler<"${ camelName }"> = async(
\t{}, // the parameters, query & request body are automatically combined
\t{ db },
\t{ firebaseAuth } // user that made the request
) => {
\tthrow new Boom("Not implemented", { statusCode: 404 });
};

export default handler;
`;

export const subFileBoilerplate = (pascalName: string) => `import { ISubscriberParams } from "../types";\n\nexport const ${ pascalName } = async({ userId, data, db }: ISubscriberParams) => {
\treturn;
};`;

export const camelize = (s: string) => s.replace(/-./g, x => x[1].toUpperCase());

export const pascalize = (s: string) => s.replace(/(^\w|-\w)/g,
	x => x.replace(/-/, "").toUpperCase());

export const kebabize = (s: string) => s.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
