# Typescript Service Template

Template for building typescript services

## Stack
- Typescript (language)
- OpenAPI (for documentation & design)
- TypeORM (have to configure the DB on your own)
- Serverless (can use Hapi/express or some other server too)

## Design

The template enforces a design driven architecture

- You first generate the openAPI document
- Enter the query, path & request body schema precisely
- Also ensure you generate a 200/204 response schema
- Must specify the scopes/auth if required
- Once you make modifications, call `yarn generate:types` to generate the typescript types from the doc

## Boilerplate
- The boilerplate in the template allows you to simply create "handlers" for each route that automatically parse the request & type validate the response. See the Handler type in `src/utils/make-api` & an example with `src/routes/users-get`
- The boilerplate does authentication automatically for routes that require it. No additional configuration is required. If extra scopes are required -- they are automatically detected from the doc & verified against
- The boilerplate also automatically handles the DB connection lifecycle and passes a connection to you for every route

### Authentication
- Specify the auth required for each route in the openAPI doc.
- Each auth scheme used in the doc is implemented in `make-api.ts`

### Controllers
- Each controller is specific to the route and must be placed inside a separate folder. Follow the naming scheme of `model-method.ts`. Where `model` is the model being updated & `method` is the method used. Eg. the get users controller must be `users-get.ts` 

``` ts
import { Boom } from "@hapi/boom";
import User from "../entity/User";
import { Handler } from "../utils/make-api";
// the "Handler" type automatically does type checks for the response as well
// creates a handler for the "usersGet" operationId
const handler: Handler<'usersGet'> = async(
    { 	// the parameters, query & request body are automatically combined into a single object
		// this is done so you don't have to think about the variables
		// there is no need to validate as that is handled by openAPI backend
        q,
        count,
        page
    }, 
	conn, // TypeORM connection
    user // user that made the request
) => {
    // a "Boom" error is automatically parsed and returned as a JSON formatted error response
    // with the specified status code
    throw new Boom('Not implemented', { statusCode: 404 })
}
export default handler
```

## Configuration
- For the environment configuration, there is a separate file for each NODE_ENV. The correct one is automatically picked based on the environment set
- You also of course, need to setup the DB on your local machine for deployment

## Linting
- Some nice little ESLint rules have been setup
- A PR check for correct linting has also been added
- Please make sure to run `yarn lint:fix` before submitting a PR, and ensure `yarn lint` exits successfully

## Testing
- Using Jest to run tests
- The `src/tests/make-test-server` script sets up an exprses application to run tests with

## Deployment
There is a sample GH action included that can deploy to AWS Lambda. If not using serverless, can alter the action to deploy to ELB or some other service.