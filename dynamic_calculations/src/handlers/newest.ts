class Newest {

  static handle(...sources) {
    return sources
    .flat()
    .map(source => source.data.timestamp)
    .reduce((latest, current) => (latest > current ? latest : current), new Date(0));
  }
}

export default Newest;