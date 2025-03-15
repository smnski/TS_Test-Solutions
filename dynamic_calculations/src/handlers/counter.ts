import { Action } from "../models/action";

export class Counter {
  static handle(...sources: Action[]): number {
    const result = sources.reduce((acc, curr) => acc + 1, 0);

    return result;
  }
}
