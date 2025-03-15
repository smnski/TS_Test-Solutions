import { dbClient, TableNames } from "./src/common/db";
import { EventPayload, ResponseType } from "./src/types";
import authorize from "./src/authorize";
import calculate from "./src/calculate";

// The event argument passed here:
// {Headers: {userid: string}, body: string} - parsed body contains {actionid: string}
const handler = async function (event): Promise<any> {
  const headers = event.Headers;
  const body = event.body;

  const userid = headers.userid;
  const { actionid } = JSON.parse(body);

  const authorizeResult = await authorize(userid, actionid);
  if (!authorizeResult) {
    return { statusCode: 403 };
  }

  try {
    return await calculate(event);
  } catch (error) {
    console.error("Handler Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};

export default handler;
