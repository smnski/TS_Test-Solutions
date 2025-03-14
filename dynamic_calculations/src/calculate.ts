import { EventPayload } from "./types";
import { Action } from "./models/action";
import Counter from "./handlers/counter";

// TODO: Make the result of action saved into its data, then process that properly.

async function processRecursively(action: Action): Promise<any> {
  const children = await action.getChildActions();

  if (children.length > 0) {
    const childResults = await Promise.all(children.map(processRecursively));
    // Always delegate to the handler when children are found.
    return action.handler.handle(...childResults);
  } else {
    // For COUNTER actions, if there are no children, we want to return a count of 0.
    if (action.handler === Counter) {
      return action.handler.handle(...[]);
    }
    // For other handler types (e.g. NEWEST) simply return the action itself.
    return action;
  }
}

async function calculate(event: EventPayload) {
  const { actionid } = JSON.parse(event.body);
  const action = await Action.getByPk(actionid);
  const result = await processRecursively(action);
  console.log("result: ", result); //debug

  const output = result && result.data !== undefined ? result.data : result;
  return {
    statusCode: 200,
    body: output,
  };
}

export default calculate;
