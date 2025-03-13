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
        parentActionId: "1",
        data: { timestamp: new Date(2020, 1, 1), color: "red", type: "painting" },
      },
    })
    .promise();

  await dbClient
    .put({
      TableName: TableNames.actions,
      Item: {
        pk: "3",
        parentActionId: "1",
        data: { timestamp: new Date(2010, 1, 1), color: "blue", image: "none" },
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
    timestamp: new Date(2010, 1, 1),
    color: "blue",
    image: "none",
  });
});
