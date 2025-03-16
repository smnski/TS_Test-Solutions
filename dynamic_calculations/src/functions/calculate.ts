import { Action } from "../models/action";
import { ActionData, ResponseBodyType } from "../types";
import { User } from "../models/user";
import { authorize } from "./authorize";

async function processRecursively(action: Action, user: User): Promise<ActionData> {
  // This would be here assuming user must be authorized to perform every child action of requested action as well.
  // Currently, this authorization check is commented out, so child actions are not being checked.  
  // const authorizeResult = await authorize(user.id, action.id);
  // if (!authorizeResult) {
  //   throw new AuthorizationError("Authorization failed. User not authorized.");
  // }
  
  const children = await action.getChildActions();

  if (children.length > 0) {
    const childDataArray = await Promise.all(children.map(child => processRecursively(child, user)));

    if (typeof action.handler === "function") {
      const result = action.handler(...childDataArray);
      action.result = result;
      return result;
    } else {
      throw new Error(`Handler is not defined for action: ${action.id}`);
    }
  } else {
    // If action doesn't have a handler, return its data.
    return action.data ? action.data : {};
  }
}

export async function calculate(action: Action, user: User): Promise<ResponseBodyType> {
  // Assuming we only check the user's authorization for the requested action, 
  // and not for any child actions (as stated in the README).
  const authorizeResult = await authorize(action, user);
  if (!authorizeResult) {
    throw new AuthorizationError("Authorization failed. User not authorized.");
  }
  const computedData = await processRecursively(action, user);
  action.result = computedData;
  return action.result;
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}
