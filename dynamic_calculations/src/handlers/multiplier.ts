class Multiplier {
  static handle(...sources) {
    const result = sources.flat().reduce((acc, source) => acc * source.result, 1);
    
    console.log("Computed value: ", result); 
    return { result: result };
  }
}

export default Multiplier;
