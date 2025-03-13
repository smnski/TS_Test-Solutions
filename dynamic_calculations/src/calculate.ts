import { EventPayload } from "./types";
import { Action } from "./models/action";

async function calculate(event: EventPayload) {
  const { Headers, body } = event;
  const { actionid } = JSON.parse(body);
  const action = await Action.getByPk(actionid);
  const children = await action.getChildActions();
  console.log("children: ", children); //debug
  
  return {};
}

export default calculate;
