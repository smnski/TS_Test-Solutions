import { EventPayload } from "./types";
import { Action } from "./models/action";

async function processRecursively(actions: Action[]): Promise<void> {
  for (const action of actions) {
    const children = await action.getChildActions();
    if (children.length > 0) {
      await processRecursively(children);
      let concatenated = "";
      for (const child of children) {
        concatenated += child.result;
      }
      action.result = concatenated;
    } else {
      action.result = "a";
    }
  }
}

async function calculate(event: EventPayload) {
  const { actionid } = JSON.parse(event.body);
  const action = await Action.getByPk(actionid);
  await processRecursively([action]);
  console.log("result: ", action.result);
  return {};
}

export default calculate;
