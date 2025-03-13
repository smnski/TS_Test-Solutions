import Counter from "./counter";

class Handler {
  static from(input) {
    if (input.rule === "COUNTER") return Counter;
  }
}

export default Handler;
