import { ActionData } from "../types";

export class Multiplier {
  static handle(...sources: ActionData[]): ActionData {
    const result = sources.flat().reduce((acc, actionResult) => {
      
      const value = actionResult.result;
      if (typeof value !== 'number') {
        throw new Error("Invalid result type, expected a number.");
      }
      
      return acc * value;
    }, 1);

    return { result: result };
  }
}