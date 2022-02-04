export const operationMediator = {
  usersGet: {
    parameters: `{
      query: {
        /** Search for users */
        q?: string | null,
        count?: number,
        page?: number,
      },
    }`,
    responses: `{
      /** OK */
      200: {
        content: {
          "application/json": {
            users: components["schemas"]["User"][],
          },
        },
      },
    }`,
  },
  createUser: {
    responses: `{
      /** Created */
      200: {
        content: {
          "application/json": components["schemas"]["User"],
        },
      },
    }`,
  },
}

