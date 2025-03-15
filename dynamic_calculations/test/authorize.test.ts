import { firstActionHandler } from "../index";
import { test, expect, afterAll } from "@jest/globals";

import { dbClient, TableNames, UserRoles } from "./../src/common/db";

const testUsers = ["123", "234"];
const testActions = ["1"];

afterAll(async () => {
  for (const userId of testUsers) {
    await dbClient
      .delete({
        TableName: TableNames.users,
        Key: { pk: userId },
      })
      .promise();
  }
  for (const actionId of testActions) {
    await dbClient
      .delete({
        TableName: TableNames.actions,
        Key: { pk: actionId },
      })
      .promise();
  }
});

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

test("Disallowed", async () => {
  await dbClient
    .put({
      TableName: TableNames.users,
      Item: {
        pk: "234",
        role: UserRoles.enterprise,
      },
    })
    .promise();

  await dbClient
    .put({
      TableName: TableNames.actions,
      Item: {
        pk: "1",
        handler: "COUNTER",
        role: UserRoles.sysadmin,
      },
    })
    .promise();

  const { statusCode } = await firstActionHandler({
    Headers: { userId: "234" },
    body: { actionId: "1" },
  });

  expect(statusCode).toBe(403);
});