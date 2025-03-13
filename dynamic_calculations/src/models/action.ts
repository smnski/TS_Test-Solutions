import Role from "./role";

import { dbClient, TableNames } from "../common/db";
import HandlerAssigner from "../handlers/handlerAssigner";

export class Action {
  pk;
  parentPk;
  role;
  handler;
  data;

  constructor(input) {
    this.pk = input.pk;
    this.parentPk = input.parentPk;
    this.role = Role.from(input.role);
    this.handler = HandlerAssigner.from(input.handler);
  }

}