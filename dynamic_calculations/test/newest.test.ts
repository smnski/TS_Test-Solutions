import handler from "../index";
import { beforeAll, test, expect } from "@jest/globals";
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

test("Some items to count", async () => {
  await dbClient;

  const { body } = await handler({
    Headers: { userid: "123" },
    body: JSON.stringify({ actionid: "1" }),
  });

  expect(body).toStrictEqual({
    timestamp: new Date(2023, 1, 1).getTime(), //remove getTime later
    color: "yellow",
    image: "none",
  });
});
