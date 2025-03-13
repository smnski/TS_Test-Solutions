import { EventPayload } from "./types";
import { Action } from "./models/action";
import { dbClient, TableNames } from  "./common/db";

async function calculate(event: EventPayload) {

  const headers = event.Headers;
  const body = event.body;

  console.log("body: ", body); //debug

  const userid = headers.userid;
  const { actionid } = JSON.parse(body);

  console.log("actionid: ", actionid); //debug

  const action = await Action.getByPk(actionid);
  console.log("action: ", action); //debug

  const childrenActions = await action.getChildActions();
  console.log("childrenActions: ", childrenActions); //debug

  const allActions = await dbClient.scan({ TableName: TableNames.actions }).promise();
  console.log("All actions in DB:", JSON.stringify(allActions, null, 2));

  return {};
}

export default calculate;
