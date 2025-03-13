import Counter from "./counter";
import Newest from "./newest";

class HandlerAssigner {
  static from(input) {
    if (input.rule === "COUNTER") return Counter;
    if (input.rule === "NEWEST") return Newest;
  }
}

export default HandlerAssigner;
