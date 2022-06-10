export const operationMediator = {
  /** Get User information */
  getUser: {
    parameters: `{
      query: {
        /** get User info using id */
        userId: string[],
      },
    }`,
    responses: `{
      /** Here is your user */
      200: {
        content: {
          "application/json": {
            users?: components["schemas"]["User"][],
          },
        },
      },
    }`,
  },
  /** Create a new user */
  insertUser: {
    responses: `{
      /** User added successfully */
      200: {
        content: {
          "application/json": components["schemas"]["User"],
        },
      },
    }`,
    requestBody: `{
      content: {
        "application/json": components["schemas"]["UserInsertReq"],
      },
    }`,
  },
  /** Delete user */
  deleteUser: {
    parameters: `{
      query: {
        userId: string[],
      },
    }`,
    responses: `{
      /** User deleted successfully */
      200: {
        content: {
          "application/json": components["schemas"]["DeleteUser"],
        },
      },
    }`,
  },
  /** Update User */
  updateUser: {
    parameters: `{
      query: {
        userId: string,
      },
    }`,
    responses: `{
      /** User updated successfully */
      200: {
        content: {
          "application/json": components["schemas"]["User"],
        },
      },
    }`,
    requestBody: `{
      content: {
        "application/json": components["schemas"]["UserInsertReq"],
      },
    }`,
  },
}

