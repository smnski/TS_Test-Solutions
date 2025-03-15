import { EventPayload, ResponseType } from "../types";
import { Action } from "../models/action";
import { User } from "../models/user";
import { authorize } from "./authorize";

async function processRecursively(action: Action): Promise<any> {
  const children = await action.getChildActions();

  if (children.length > 0) {
    const childDataArray = await Promise.all(children.map(processRecursively));

    if (typeof action.handler === "function") {
      return action.handler(...childDataArray);
    } else {
      throw new Error(`Handler is not defined for action: ${action.id}`);
    }
  } else {
    return action.data;
  }
}

export async function calculate(action: Action, user: User) {

  const authorizeResult = await authorize(user.id, action.id);
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
