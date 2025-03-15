import { ResponseData } from "../types";

class Newest {
  static handle(...sources: ResponseData[]) {
    return sources
      .flat()
      .reduce((latest, current) => {
        if (latest.timestamp === undefined || current.timestamp === undefined) {
          throw new Error("Timestamp is missing in one of the ResponseData objects.");
        }

        return latest.timestamp > current.timestamp ? latest : current;
      }, { timestamp: "" } as ResponseData);
  }
}

export default Newest;
