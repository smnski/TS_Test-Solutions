class Counter {
  static handle(...sources) {
    return sources.reduce(
      (acc, curr) => ({
        result: acc.result + 1,
      }),
      { result: 0 }
    );
  }
}

export default Counter;