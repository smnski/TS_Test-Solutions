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

  await calculate(event);
  return;
};

export default handler;
