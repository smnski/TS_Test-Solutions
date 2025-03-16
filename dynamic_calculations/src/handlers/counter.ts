import { ActionData } from "../types";

export class Counter {
  static handle(...sources: (ActionData)[]): ActionData {
    return { result: sources.length };
  }
}
