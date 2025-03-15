import { firstActionHandler } from "../index";
import { beforeAll, afterAll, test, expect } from "@jest/globals";
import { dbClient, TableNames, UserRoles } from "./../src/common/db";

beforeAll(async () => {
  await dbClient
    .put({
      TableName: "actions",
      Item: {
        pk: "1",
        role: UserRoles.basicuser,
        handler: "NEWEST",
      },
    })
    .promise();
  
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
        pk: "2",
        parentPk: "1",
        data: { timestamp: new Date(2020, 1, 1).getTime(), color: "red", type: "painting" },
      },
    })
    .promise();

  await dbClient
    .put({
      TableName: TableNames.actions,
      Item: {
        pk: "3",
        parentPk: "1",
        handler: "NEWEST",
        data: { timestamp: new Date(2010, 1, 1).getTime(), color: "blue", image: "none" },
      },
    })
    .promise();

  await dbClient
    .put({
      TableName: TableNames.actions,
      Item: {
        pk: "4",
        parentPk: "3",
        data: { timestamp: new Date(2023, 1, 1).getTime(), color: "yellow", image: "none" },
      },
    })
    .promise();

  await dbClient
    .put({
      TableName: TableNames.actions,
      Item: {
        pk: "5",
        parentPk: "3",
        data: { timestamp: new Date(2005, 1, 1).getTime(), color: "purple", image: "none" },
      },
    })
    .promise();
});

afterAll(async () => {
  // Delete test data after the test completes
  const deleteItems = [
    { TableName: TableNames.users, Key: { pk: "123" } },
    { TableName: TableNames.actions, Key: { pk: "1" } },
    { TableName: TableNames.actions, Key: { pk: "2" } },
    { TableName: TableNames.actions, Key: { pk: "3" } },
    { TableName: TableNames.actions, Key: { pk: "4" } },
    { TableName: TableNames.actions, Key: { pk: "5" } },
  ];

  await Promise.all(
    deleteItems.map(({ TableName, Key }) =>
      dbClient.delete({ TableName, Key }).promise()
    )
  );
});

test("Some items to count", async () => {

  const { body } = await firstActionHandler({
    Headers: { userId: "123" },
    body: { actionId: "1" },
  });

  expect(body).toStrictEqual({
    result: {
      timestamp: new Date(2023, 1, 1).getTime(),
      color: "yellow",
      image: "none",
    },
  });
});