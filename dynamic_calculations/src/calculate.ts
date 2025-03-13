import { EventPayload } from "./types";
import { Action } from "./models/action";
import { dbClient, TableNames } from  "./common/db";

async function calculate(event: EventPayload) {

  const headers = event.Headers;
  const body = event.body;

  const userid = headers.userid;
  const { actionid } = JSON.parse(body);

  const action = await Action.getByPk(actionid);

  const childrenActions = await action.getChildActions();
  console.log("childrenActions: ", childrenActions); //debug

  const motherHandleResult = await action.handler.handle(childrenActions);
  console.log("motherHandleResult: ", motherHandleResult); //debug

  return {};
}

export default calculate;
