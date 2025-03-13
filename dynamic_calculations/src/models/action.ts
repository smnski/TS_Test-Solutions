import Role from "./role";

import { dbClient, TableNames } from "../common/db";
import HandlerAssigner from "../handlers/handlerAssigner";

export class Action {
  id;
  pk;
  parentActionId;
  parentRole;
  parentRoleId;
  role;
  handler;

  constructor(input) {
    this.id = input.id;
    this.pk = input.pk;
    this.parentActionId = input.parentActionId;
    this.parentRole = input.parentRole;
    this.parentRoleId = input.parentRoleId;
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
        .get({ TableName: TableNames.actions, Key: { pk: this.parentActionId } })
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
        IndexName: "parent-index", // Ensure this index has the correct partition key and sort key
        KeyConditionExpression: "parentActionId = :parentActionId", // Query where parentActionId matches the current action's pk
        ExpressionAttributeValues: {
          ":parentActionId": this.pk, // Use the current action's pk as the parentActionId value
        },
      })
      .promise();
  
    console.log("getChildActions res: ", res); // debug
  
    if (!res.Items || res.Items.length === 0) {
      throw new Error("Child actions do not exist");
    }
  
    return res.Items.map((item) => new Action(item)); // Map results to Action instances
  }
  
  
  
}
