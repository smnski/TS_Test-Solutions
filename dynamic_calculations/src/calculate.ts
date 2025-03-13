import { EventPayload } from "./types";
import { Action } from "./models/action";

async function calculate(event: EventPayload) {

  const headers = event.Headers;
  const body = event.body;

  console.log("body: ", body); //debug

  const userid = headers.userid;
  const { actionid } = JSON.parse(body);

  console.log("actionid: ", actionid); //debug

  const fullAction = await Action.getByPk(actionid);

  console.log("fullAction: ", fullAction); //debug

  return {};
}

export default calculate;
