import { Action } from "../models/action";

class Multiplier {
  static handle(...sources: Action[]): number {
    const result = sources.flat().reduce((acc, source) => {
      const value = source.result;
      if (typeof value !== 'number') {
        throw new Error("Invalid result type, expected a number.");
      }
      return acc * value;
    }, 1);
    
    return result;
  }
}

export default Multiplier;
