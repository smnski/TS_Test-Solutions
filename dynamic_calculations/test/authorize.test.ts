import { firstActionHandler } from "../index";
import { test, expect } from "@jest/globals";

import { dbClient, TableNames, UserRoles } from "./../src/common/db";

test("Allowed", async () => {
  await dbClient
    .put({
      TableName: TableNames.users,
      Item: {
        pk: "123",
        role: UserRoles.basicuser,
      },
    })
    .promise();

  await dbClient
    .put({
      TableName: TableNames.actions,
      Item: {
        pk: "1",
        handler: "COUNTER",
        role: UserRoles.basicuser,
      },
    })
    .promise();

  const { statusCode } = await firstActionHandler({
    Headers: { userId: "123" },
    body: { actionId: "1" },
  });

  expect(statusCode).toBe(200);
});