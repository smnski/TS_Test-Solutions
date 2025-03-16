import { EventPayload, ResponseType } from "./src/types";
import { Action } from "./src/models/action";
import { User } from "./src/models/user";
import { calculate, AuthorizationError } from "./src/functions/calculate";

export async function firstActionHandler(event: EventPayload): Promise<ResponseType> {
  const userId = event.Headers.userId;
  const actionId = event.body.actionId;

  try {
    const [userRes, actionRes] = await Promise.all([
      User.getById(userId),
      Action.getById(actionId),
    ]);

    const responseBody = await calculate(actionRes, userRes);
    return {
      statusCode: 200,
      body: responseBody,
    };
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return {
        statusCode: 403,
        body: { message: "Authorization failed. User not authorized." },
      };
    } else {
      console.error("Error interacting with the database: ", error);
      return {
        statusCode: 500,
        body: { message: "Failed to fetch user or action data." },
      };
    }
  }
}
