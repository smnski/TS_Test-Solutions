import Counter from "./counter";
import Newest from "./newest";

class HandlerAssigner {
  static from(input) {
    if (input.role === "COUNTER") return Counter;
    if (input.role === "NEWEST") return Newest;
  }
}

export default HandlerAssigner;
