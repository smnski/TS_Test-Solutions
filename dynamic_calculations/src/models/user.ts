const { dbClient, TableNames } = require("../common/db");
import { Role } from "./role";

export class User {
  id: string;
  role: Role;

  constructor(id: string, role: Role) {
    this.id = id;
    this.role = role;
  }

  static async getById(id: string): Promise<User> {
    const res = await dbClient.get({ TableName: TableNames.users, Key: { pk: id } }).promise()

    if (!res.Item) {
      throw new Error("User does not exist");
    }

    const role = Role.from(res.Item.role);
    if (!role) {
      throw new Error("Invalid role value");
    }

    return new User(res.Item.id, role);
  }
}
