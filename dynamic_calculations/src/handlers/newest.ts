import { ActionData } from "../types";

export class Newest {
  static handle(...sources: ActionData[]): ActionData {
    return sources
      .reduce((latest, current) => {
        const latestTimestamp = latest.timestamp;
        const currentTimestamp = current.timestamp;

        if (latestTimestamp === undefined || currentTimestamp === undefined) {
          throw new Error("Timestamp is missing in one of the ActionData objects.");
        }

        return latestTimestamp > currentTimestamp ? latest : current;
      });
  }
}

