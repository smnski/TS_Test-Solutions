import { Action } from "../models/action";
import { ResponseData } from "../types";

class Multiplier {
  static handle(...sources: Action[]): ResponseData {
    const result = sources.flat().reduce((acc, source) => {
      const value = source.data?.result;
      if (typeof value !== 'number') {
        throw new Error("Invalid result type, expected a number.");
      }
      return acc * value;
    }, 1);
    
    return { result };
  }
}

export default Multiplier;
