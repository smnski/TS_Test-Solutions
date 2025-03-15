import { Action } from "../models/action";
import { ResponseData } from "../types";

class Counter {
  static handle(...sources: Action[]): ResponseData {
    const result = sources.reduce((acc, curr) => {
      return { result: acc.result + 1 };
    }, { result: 0 });

    return result;
  }
}

export default Counter;
