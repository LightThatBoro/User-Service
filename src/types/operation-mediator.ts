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
            users: components["schemas"]["user-model"][],
          },
        },
      },
    }`,
  },
}

