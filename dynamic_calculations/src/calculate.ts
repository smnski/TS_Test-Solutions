import { EventPayload } from "./types";
import { Action } from "./models/action";

async function processRecursively(action: Action): Promise<Action | null> {
  const children = await action.getChildActions();
  
  if (children.length > 0) {
    const childResults = await Promise.all(children.map(processRecursively));
    const validChildren = childResults.length > 0 ? childResults : [action]; 
    return action.handler.handle(validChildren);
  } else {
    return action;
  }
}

async function calculate(event: EventPayload) {
  const { actionid } = JSON.parse(event.body);
  const action = await Action.getByPk(actionid);
  const result = await processRecursively(action);
  console.log("result: ", result);
  return { data: result.data };
}

export default calculate;
