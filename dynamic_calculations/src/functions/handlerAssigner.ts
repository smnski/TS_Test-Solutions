import { Counter } from "../handlers/counter";
import { Newest } from "../handlers/newest";
import { Multiplier } from "../handlers/multiplier";

export class HandlerAssigner {
  static from(input: string) {
    if (input === "COUNTER") return Counter.handle;
    if (input === "NEWEST") return Newest.handle;
    if (input === "MULTIPLIER") return Multiplier.handle;
    return undefined;
  }
}
