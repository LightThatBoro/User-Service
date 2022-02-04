export const operationMediator = {
  usersGet: {
    parameters: `{
      query: {
        includeTotal?: components["parameters"]["IncludeTotal"],
        q?: components["parameters"]["QParam"],
        /** returns the single resource */
        id?: components["parameters"]["OptionalIdParam"],
        count?: components["parameters"]["CountParam"],
        page?: components["parameters"]["PageParam"],
      },
    }`,
    responses: `{
      200: components["responses"]["UsersResponse"],
    }`,
  },
  createUser: {
    responses: `{
      200: components["responses"]["UserResponse"],
    }`,
    requestBody: `components["requestBodies"]["UserUpsertBody]`,
  },
}

