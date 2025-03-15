import { ResponseData } from "../types";

export class Newest {
  static handle(...sources: ResponseData[]): ResponseData {
    return sources
      .reduce((latest, current) => {
        const latestTimestamp = latest.timestamp;
        const currentTimestamp = current.timestamp;

        if (latestTimestamp === undefined || currentTimestamp === undefined) {
          throw new Error("Timestamp is missing in one of the ResponseData objects.");
        }

        return latestTimestamp > currentTimestamp ? latest : current;
      });
  }
}

