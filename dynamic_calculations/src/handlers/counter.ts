import { ActionData } from "../types";

export class Counter {
  static handle(...sources: (ActionData | number)[]): number {
    return sources.length;
  }
}
