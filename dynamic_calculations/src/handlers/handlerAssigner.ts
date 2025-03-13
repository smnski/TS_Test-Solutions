import Counter from "./counter";
import Newest from "./newest";

class Handler {
  static from(input) {
    if (input.rule === "COUNTER") return Counter;
    if (input.rule === "NEWEST") return Newest;
  }
}

export default Handler;
