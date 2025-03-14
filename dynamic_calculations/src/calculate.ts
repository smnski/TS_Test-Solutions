import { EventPayload } from "./types";
import { Action } from "./models/action";

async function processRecursively(action: Action): Promise<string> {
  const children = await action.getChildActions();
  if (children.length > 0) {
    let concatenated = "";
    for (const child of children) {
      concatenated += await processRecursively(child);
    }
    return concatenated;
  } else {
    return "a";
  }
}

async function calculate(event: EventPayload) {
  const { actionid } = JSON.parse(event.body);
  const action = await Action.getByPk(actionid);
  const result = await processRecursively(action);
  console.log("result: ", result);
  return {};
}

export default calculate;
