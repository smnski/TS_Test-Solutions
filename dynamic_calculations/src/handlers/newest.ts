import { Action } from "../models/action";

class Newest {
  static handle(...sources: Action[]) {
    return sources
      .flat()
      .reduce((latest, current) => 
         latest.timestamp > current.timestamp ? latest : current,
         { timestamp: 0 }
      );
  }
}

export default Newest;
