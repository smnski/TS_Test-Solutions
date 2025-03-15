import { Role } from "./role";
import { ResponseData } from "../types";
import { dbClient, TableNames } from "../common/db";
import { HandlerAssigner } from "../functions/handlerAssigner";

export class Action {
  id: string;
  parentId?: string;
  role?: Role;
  handler?: (...sources: Action[]) => ResponseData;
  result?: number;
  data?: ResponseData;

  constructor(pk: string, parentPk: string | undefined, role: Role | undefined, handlerType: string, data?: ResponseData) {
    this.id = pk;
    this.parentId = parentPk;
    this.role = role;
    this.handler = HandlerAssigner.from(handlerType);
    this.data = data;
  }

  static async getById(pk: string): Promise<Action> {
    const res = await dbClient.get({ TableName: TableNames.actions, Key: { pk } }).promise();
    if (!res.Item) {
      throw new Error("Action does not exist");
    }

    const role = Role.from(res.Item.role);

    return new Action(res.Item.pk, res.Item.parentPk, role, res.Item.handler, res.Item.data);
  }

  async getChildActions(): Promise<Action[]> {
    const res = await dbClient.query({
      TableName: TableNames.actions,
      IndexName: "parent-index",
      KeyConditionExpression: "parentPk = :parentPk",
      ExpressionAttributeValues: { ":parentPk": this.id },
    }).promise();

    if (!res.Items || res.Items.length === 0) {
      return [];
    }

    return res.Items.map((item) => {
      const childRole = Role.from(item.role);
      return new Action(item.pk, item.parentPk, childRole, item.handler, item.data);
    });
  }

  async getParentAction(): Promise<Action | null> {
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
