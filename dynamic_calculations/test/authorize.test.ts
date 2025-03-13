import handler from "../index";
import { test, expect } from "@jest/globals";

import { dbClient, TableNames, UserRoles } from "./../src/common/db";

test("Disallowed", async () => {
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
        ROLE: UserRoles.basicuser,
      },
    })
    .promise();

  const { statusCode } = await handler({
    Headers: { userid: "123" },
    body: JSON.stringify({ actionid: "1" }),
  });

  expect(statusCode).toBe(403);

  // remove test items

  await dbClient
    .delete({
      TableName: TableNames.users,
      Key: {
        pk: "123",
      },
    })
    .promise();

  await dbClient
    .delete({
      TableName: TableNames.actions,
      Key: {
        pk: "1",
      },
    })
    .promise();
});

test("Allowed", async () => {
  await dbClient
    .put({
      TableName: TableNames.users,
      Item: {
        pk: "123",
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
        ROLE: UserRoles.sysadmin,
      },
    })
    .promise();

  const { statusCode } = await handler({
    Headers: { userid: "234" },
    body: JSON.stringify({ actionid: "1" }),
  });

  expect(statusCode).toBe(200);

  await dbClient
    .delete({
      TableName: TableNames.users,
      Key: {
        pk: "234",
      },
    })
    .promise();
  await dbClient
    .delete({
      TableName: TableNames.actions,
      Key: {
        pk: "1",
      },
    })
    .promise();
});
