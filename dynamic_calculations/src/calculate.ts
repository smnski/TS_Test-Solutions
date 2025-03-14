import { EventPayload } from "./types";
import { Action } from "./models/action";

async function processRecursively(actions: Action[], parentAction: Action): Promise<Action[]> {
  if (actions.length === 1) {
    if(actions[0].getParentAction === null) {
      return actions;
    }
  }

  for (const action of actions) {
    const children = await action.getChildActions();
    console.log("children: ", children);
    parentAction.result = "aaa";
    return processRecursively(children, action);
  }
}


async function calculate(event: EventPayload) {
  const { Headers, body } = event;
  const { actionid } = JSON.parse(body);
  const action = await Action.getByPk(actionid);
  const res = await processRecursively([action], action);
  console.log("res: ", res[0]); //debug
  
  return {};
}

export default calculate;
