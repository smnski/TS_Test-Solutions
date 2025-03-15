import handler from "../index";
import { beforeAll, afterAll, test, expect } from "@jest/globals";
import { dbClient, TableNames, UserRoles } from "../src/common/db";

beforeAll(async () => {
  await dbClient
    .put({
      TableName: TableNames.users,
      Item: {
        pk: "123",
        role: UserRoles.sysadmin,
      },
    })
    .promise();

  await dbClient
    .put({
      TableName: TableNames.actions,
      Item: {
        pk: "6",
        handler: "MULTIPLIER",
        role: UserRoles.basicuser,
      },
    })
    .promise();
});

afterAll(async () => {
  // Delete test data after the test completes
  const deleteItems = [
    { TableName: TableNames.users, Key: { pk: "123" } },
    { TableName: TableNames.actions, Key: { pk: "6" } },
    { TableName: TableNames.actions, Key: { pk: "1" } },
    { TableName: TableNames.actions, Key: { pk: "2" } },
    { TableName: TableNames.actions, Key: { pk: "3" } },
    { TableName: TableNames.actions, Key: { pk: "4" } },
    { TableName: TableNames.actions, Key: { pk: "5" } },
    { TableName: TableNames.actions, Key: { pk: "7" } },
    { TableName: TableNames.actions, Key: { pk: "8" } },
  ];

  await Promise.all(
    deleteItems.map(({ TableName, Key }) =>
      dbClient.delete({ TableName, Key }).promise()
    )
  );
});

test("Some items to count", async () => {
  await dbClient
    .put({
      TableName: "actions",
      Item: {
        pk: "1",
        parentPk: "6",
        handler: "COUNTER",
        role: UserRoles.basicuser,
        data: {},
      },
    })
    .promise();

  await dbClient
    .put({
      TableName: "actions",
      Item: {
        pk: "4",
        parentPk: "6",
        handler: "COUNTER",
        role: UserRoles.basicuser,
        data: {},
      },
    })
    .promise();

  await dbClient
    .put({
      TableName: "actions",
      Item: {
        pk: "8",
        parentPk: "1",
        data: {},
      },
    })
    .promise();

  await dbClient
    .put({
      TableName: "actions",
      Item: {
        pk: "2",
        parentPk: "1",
        data: {},
      },
    })
    .promise();

  await dbClient
    .put({
      TableName: "actions",
      Item: {
        pk: "3",
        parentPk: "1",
        data: {},
      },
    })
    .promise();

  await dbClient
    .put({
      TableName: "actions",
      Item: {
        pk: "5",
        parentPk: "4",
        data: {},
      },
    })
    .promise();

  await dbClient
    .put({
      TableName: "actions",
      Item: {
        pk: "7",
        parentPk: "4",
        data: {},
      },
    })
    .promise();

  const { body } = await handler({
    Headers: { userid: "123" },
    body: JSON.stringify({ actionid: "6" }),
  });

  expect(body).toStrictEqual({ result: 6 });
});
