import Counter from "./counter";
import Newest from "./newest";
import Multiplier from "./multiplier";

class HandlerAssigner {
  static from(input) {
    if (input === "COUNTER") return Counter;
    if (input === "NEWEST") return Newest;
    if (input === "MULTIPLIER") return Multiplier;
  }
}

export default HandlerAssigner;
