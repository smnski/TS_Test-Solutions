class Newest {
  static handle(...sources) {
    return sources
      .flat()
      .reduce((latest, current) => 
         latest.timestamp > current.timestamp ? latest : current,
         { timestamp: 0 }
      );
  }
}

export default Newest;
