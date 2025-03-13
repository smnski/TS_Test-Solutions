import Role from "./role";
import { dbClient, TableNames } from "../common/db";
import HandlerAssigner from "../handlers/handlerAssigner";

export class Action {
  pk;
  parentPk;
  role;
  handler;
  data;
  result;

  constructor(input) {
    this.pk = input.pk;
    this.parentPk = input.parentPk;
    this.role = Role.from(input.role);
    this.handler = HandlerAssigner.from(input.handler);
    this.data = input.data;
    this.result = null;
  }

  static async getByPk(pk) {
    const res = await dbClient.get({ TableName: TableNames.actions, Key: { pk } }).promise();
    if (!res.Item) {
      throw new Error("Action does not exist");
    }
    return new Action(res.Item);
  }

  async getChildActions() {
    const res = await dbClient.query({
      TableName: TableNames.actions,
      IndexName: "parent-index",
      KeyConditionExpression: 'parentPk = :parentPk',
      ExpressionAttributeValues: { ':parentPk': this.pk }
    }).promise();
    if (!res.Items || res.Items.length === 0) {
      return [];
    }
    return res.Items.map(item => new Action(item));
  }
}
