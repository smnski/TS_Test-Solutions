import { Action } from "../models/action";

export class Multiplier {
  static handle(...sources: Action[]): number {
    const result = sources.flat().reduce((acc, actionResult) => {
      if (typeof actionResult !== 'number') {
        throw new Error("Invalid result type, expected a number.");
      }
      return acc * actionResult;
    }, 1);
    
    return result;
  }
}

