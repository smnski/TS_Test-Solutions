import { Action } from "../models/action";

class Counter {
  static handle(...sources: Action[]): number {
    const result = sources.reduce((acc, curr) => acc + 1, 0);

    return result;
  }
}

export default Counter;
