import { EventPayload } from "./types";
import { Action } from "./models/action";
import Counter from "./handlers/counter";

async function processRecursively(action: Action): Promise<any> {
  const children = await action.getChildActions();

  if (children.length > 0) {
    const childDataArray = await Promise.all(children.map(processRecursively));
    return action.handler.handle(...childDataArray);
  } else {
    // If no children, simply return the action's data (plain object)
    return action.data;
  }
}

async function calculate(event: EventPayload) {
  const { actionid } = JSON.parse(event.body);
  const action = await Action.getByPk(actionid);
  const computedData = await processRecursively(action);
  console.log("computed data: ", computedData);
  return {
    statusCode: 200,
    body: computedData,
  };
}

export default calculate;
