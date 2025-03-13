import Counter from "./counter";
import Newest from "./newest";

class HandlerAssigner {
  static from(input) {
    if (input === "COUNTER") return Counter;
    if (input === "NEWEST") return Newest;
  }
}

export default HandlerAssigner;
