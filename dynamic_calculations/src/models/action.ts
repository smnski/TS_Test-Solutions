import Role from "./role";

import { dbClient, TableNames } from "../common/db";
import HandlerAssigner from "../handlers/handlerAssigner";

export class Action {
  id;
  pk;
  parentActionId;
  parentRule;
  parentRuleId;
  role;
  handler;

  constructor(input) {
    this.id = input.id;
    this.pk = input.pk;
    this.parentRule = input.parentRule;
    this.parentRuleId = input.parentRuleId;
    this.role = Role.from(input.role);
    this.handler = HandlerAssigner.from(input.handler);
  }

  static async getById(id) {
    const res = (await dbClient.get({ TableName: TableNames.actions, Key: { pk: id } }).promise())

    if (!res.Item) {
      throw new Error("Action does not exist");
    }

    return new Action(res.Item);
  }

  static async getByPk(pk) {
    const res = await dbClient.get({ TableName: TableNames.actions, Key: { pk: pk } }).promise();
    console.log("action.ts, res: ", res); //debug

    if (!res.Item) {
      throw new Error("Action does not exist");
    }

    return new Action(res.Item);
  }

  async getParentAction() {
    const res = (
      await dbClient
        .get({ TableName: TableNames.actions, Key: { pk: this.parentRuleId } })
        .promise()
    ).Item;

    if (!res.Item) {
      throw new Error("Rule does not exist");
    }

    return new Action(res.Item);
  }

  async getChildActions() {
    const res = await dbClient
      .query({
        TableName: TableNames.actions,
        IndexName: "parent-index",
        ExclusiveStartKey: { pk: this.parentActionId },
      })
      .promise();

    if (!res.Items) {
      throw new Error("Action does not exist");
    }

    return res.Items.map((item) => new Action(item));
  }
}
