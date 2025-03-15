import { EventPayload, ResponseType } from "./src/types";
import { Action } from "./src/models/action";
import { User } from "./src/models/user";
import { authorize } from "./src/functions/authorize";
import { calculate } from "./src/functions/calculate";

export async function firstActionHandler(event: EventPayload): Promise<ResponseType> {

  const userId = event.Headers.userId;
  const actionId = event.body.actionId;

  const authorizeResult = await authorize(userId, actionId);
  if (!authorizeResult) {
    return {
      statusCode: 403,
      body: {
        message: "User is not authorized to perform this action",
      },
    }
  }

  try {
    const [userRes, actionRes] = await Promise.all([
      User.getById(userId),
      Action.getById(actionId),
    ]);
    return await calculate(actionRes, userRes);

  } catch (error) {
    console.error("Error interacting with the database: ", error);
    return {
      statusCode: 500,
      body: {
        message: "Failed to fetch user or action data",
      },
    };
  }
};

