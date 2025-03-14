class Multiplier {
  static handle(...sources) {
    return { value: sources.flat().reduce((acc, num) => acc * num, 1) };
  }
}

export default Multiplier;
