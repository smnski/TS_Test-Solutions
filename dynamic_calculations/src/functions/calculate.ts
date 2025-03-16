import { Action } from "../models/action";
import { ActionData } from "../types";
import { User } from "../models/user";
import { authorize } from "./authorize";

async function processRecursively(action: Action): Promise<any> {
  const children = await action.getChildActions();

  if (children.length > 0) {
    // results returned by handler for each action
    const childDataArray = await Promise.all(children.map(processRecursively));

    if (typeof action.handler === "function") {
      const result = action.handler(...childDataArray);
      action.result = result;
      return result;
    } else {
      throw new Error(`Handler is not defined for action: ${action.id}`);
    }
  } else {
    // if action doesn't have a handler, return its data
    return action.data;
  }
}

export async function calculate(action: Action, user: User) {

  const authorizeResult = await authorize(user.id, action.id);
  if (!authorizeResult) {
    return {
      statusCode: 403,
      body: {
        message: "User is not authorized to perform this action",
      },
    }
  }

  const computedData = await processRecursively(action);
  action.result = computedData;

  return {
    statusCode: 200,
    body: { result: action.result },
  }
}
