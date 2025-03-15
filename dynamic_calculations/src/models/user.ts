const { dbClient, TableNames } = require("../common/db");
const Role = require("./role");

class User {
  pk;
  role;

  constructor(input) {
    this.pk = input.pk;
    this.role = input.role;
  }

  static async getByPk(pk) {
    const res = (await dbClient.get({ TableName: TableNames.users, Key: { pk: pk } }).promise())
      .Item;

    if (!res.Item) {
      throw new Error("User does not exist");
    }

    return new User(res.Item);
  }
}

module.exports = User;
