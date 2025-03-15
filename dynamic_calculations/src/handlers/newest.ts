import { Action } from "../models/action";
import { ResponseData } from "../types";

class Newest {
  static handle(...sources: Action[]): ResponseData {
    return sources
      .reduce((latest, current) => {
        console.log("current: ", current);
        console.log("latest: ", latest);
        const latestTimestamp = latest.data?.timestamp;
        const currentTimestamp = current.data?.timestamp;
        console.log("currentTimestamp", currentTimestamp)
        console.log("latestTimestamp", latestTimestamp)

        if (latestTimestamp === undefined || currentTimestamp === undefined) {
          throw new Error("Timestamp is missing in one of the ResponseData objects.");
        }

        return latestTimestamp > currentTimestamp ? latest : current;
      });
  }
}

export default Newest;
