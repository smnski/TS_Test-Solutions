import { EventPayload } from "./types";
import { Action } from "./models/action";
import { dbClient, TableNames } from "./common/db"; //debug

async function processRecursively(action: Action): Promise<any> {
  const children = await action.getChildActions();
  console.log("children: ", children) //debug

  if (children.length > 0) {
    const childDataArray = await Promise.all(children.map(processRecursively));
    const result = action.handler.handle(...childDataArray);

    //console.log(`Action ${action.pk} processed. Result:`, JSON.stringify(result, null, 2)); //debug

    return result;
  } else {
    // If no children, simply return the action's data (plain object)
    //console.log(`Action ${action.pk} has no children. Returning data:`, JSON.stringify(action.data, null, 2)); //debug
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
