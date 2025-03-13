class Newest {
  static handle(...sources) {
    return sources
      .flat()
      .reduce((latest, current) => (latest.data.timestamp > current.data.timestamp ? latest : current), { data: { timestamp: new Date(0) } });
  }
}

export default Newest;
