import { EventPayload, ResponseType } from "./src/types";
import { Action } from "./src/models/action";
import { User } from "./src/models/user";
import { authorize } from "./src/authorize";
import { calculate } from "./src/calculate";

export async function firstActionHandler(event: EventPayload): Promise<ResponseType> {

  const userId = event.Headers.userId;
  const { actionId } = JSON.parse(event.body);

  const authorizeResult = await authorize(userId, actionId);
  if (!authorizeResult) {
    return {
      statusCode: 403,
      body: {
        message: "User is not authorized to perform this action",
        timestamp: new Date().toISOString(),
      },
    }
  }

  try {
    const [userRes, actionRes] = await Promise.all([
      User.getByPk(userId),
      Action.getByPk(actionId),
    ]);
    return await calculate(actionRes, userRes);
    
  } catch (error) {
    console.error("Error interacting with the database: ", error);
    return {
      statusCode: 500,
      body: {
        message: "Failed to fetch user or action data",
        timestamp: new Date().toISOString(),
      },
    };
  }
};

