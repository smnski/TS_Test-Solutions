import { Role } from "./role";
import { ResponseData } from "../types";
import { dbClient, TableNames } from "../common/db";
import { HandlerAssigner } from "../functions/handlerAssigner";

export class Action {
  id: string;
  parentId: string;
  role: Role;
  handler: (...sources: any[]) => { result: any };
  data?: ResponseData;

  constructor(id: string, parentId: string, role: Role, handlerType: string, data: ResponseData) {
    this.id = id;
    this.parentId = parentId;
    this.role = role;
    this.handler = HandlerAssigner.from(handlerType);
    this.data = data;
  }

  static async getById(id: string) {
    const res = await dbClient.get({ TableName: TableNames.actions, Key: { id } }).promise(); // should pk: id be here ?
    if (!res.Item) {
      throw new Error("Action does not exist");
    }

    const role = Role.from(res.Item.role);
    if (!role) {
      throw new Error("Invalid role value");
    }

    return new Action(res.Item.id, res.Item.parentId, role, res.Item.handler, res.Item.data);
  }

  async getChildActions() {
    const res = await dbClient.query({
      TableName: TableNames.actions,
      IndexName: "parent-index",
      KeyConditionExpression: 'parentPk = :parentPk',
      ExpressionAttributeValues: { ':parentPk': this.id }
    }).promise();
    if (!res.Items || res.Items.length === 0) {
      return [];
    }
    return res.Items.map(item => new Action(item.id, item.parentId, Role.from(item.role), item.handler, item.data));
  }

  async getParentAction() {
    if (!this.parentId) {
      return null;
    }
    try {
      return await Action.getById(this.parentId);
    } catch (error: unknown) {
      if (error instanceof Error && error.message === "Action does not exist") {
        return null;
      }
      throw error;
    }
  }
}
