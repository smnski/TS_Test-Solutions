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

test("No items to count", async () => {
  const { body } = await handler({
    Headers: { userid: "123" },
    body: JSON.stringify({ actionid: "1" }),
  });

  expect(body).toStrictEqual({ result: 0 });
});

test("Some items to count", async () => {
  await dbClient
    .put({
      TableName: "actions",
      Item: {
        pk: "2",
        parentActionId: "1",
        data: {},
      },
    })
    .promise();

  const { body } = await handler({
    Headers: { userid: "123" },
    body: JSON.stringify({ actionid: "1" }),
  });

  expect(body).toStrictEqual({ result: 1 });
});
