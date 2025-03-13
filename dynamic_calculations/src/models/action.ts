import Role from "./role";

import { dbClient, TableNames } from "../common/db";
import Handler from "../handlers/index";

export class Action {
  id;
  parentActionId;
  parentRule;
  parentRuleId;
  role;
  handler;

  constructor(input) {
    this.id = input.id;
    this.parentRule = input.parentRule;
    this.parentRuleId = input.parentRuleId;
    this.role = Role.from(input.role);
    this.handler = Handler.from(input.handler);
  }

  static async getById(id) {
    const res = (await dbClient.get({ TableName: TableNames.authRules, Key: { pk: id } }).promise())
      .Item;

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
