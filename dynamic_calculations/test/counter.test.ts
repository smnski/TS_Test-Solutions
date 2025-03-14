import handler from "../index";
import { beforeAll, test, expect } from "@jest/globals";
import { dbClient, TableNames, UserRoles } from "./../src/common/db";

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
        pk: "1",
        handler: "COUNTER",
        ROLE: UserRoles.basicuser,
      },
    })
    .promise();
});

test("Some items to count", async () => {

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
        handler: "COUNTER",
        data: {},
      },
    })
    .promise();

    await dbClient
    .put({
      TableName: "actions",
      Item: {
        pk: "4",
        parentPk: "3",
        data: {},
      },
    })
    .promise();

    await dbClient
    .put({
      TableName: "actions",
      Item: {
        pk: "5",
        parentPk: "3",
        data: {},
      },
    })
    .promise();

    await dbClient
    .put({
      TableName: "actions",
      Item: {
        pk: "6",
        parentPk: "3",
        data: {},
      },
    })
    .promise();

  const { body } = await handler({
    Headers: { userid: "123" },
    body: JSON.stringify({ actionid: "1" }),
  });

  expect(body).toStrictEqual({ result: 2 });
});
