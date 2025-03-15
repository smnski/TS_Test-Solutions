import { EventPayload, ResponseType } from "../types";
import { Action } from "../models/action";
import { User } from "../models/user";
import { authorize } from "./authorize";

async function processRecursively(action: Action): Promise<any> {
  const children = await action.getChildActions();
  console.log("children: ", children) //debug

  if (children.length > 0) {
    const childDataArray = await Promise.all(children.map(processRecursively));
    const result = action.handler.handle(...childDataArray);

    //console.log(`Action ${action.pk} processed. Result:`, JSON.stringify(result, null, 2)); //debug

    return result;
  } else {
    // If no children, simply return the action's data (plain object)
    //console.log(`Action ${action.pk} has no children. Returning data:`, JSON.stringify(action.data, null, 2)); //debug
    return action.data;
  }
}

export async function calculate(action: Action, user: User) {
  const headers = event.Headers;
  const userid = headers.userid;
  const { actionid } = JSON.parse(event.body);
  const action = await Action.getByPk(actionid);
  console.log("actionid: ", actionid);

  const authorizeResult = await authorize(userid, actionid);
  if (!authorizeResult) {
    return {
      statusCode: 403,
      body: {
        error: "Forbidden",
        details: "User is not authorized to perform this action",
        timestamp: new Date(),
      },
    } as ResponseType;
  }

  const computedData = await processRecursively(action);
  console.log("computed data: ", computedData);

  return {
    statusCode: 200,
    body: { result: computedData },
  } as ResponseType;
}
