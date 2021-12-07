import sqlite from "better-sqlite3";
import { contractsDB as databasePath } from "../../data/databasePaths.js";
export const removeContract = (contractId, requestSession) => {
    const rightNowMillis = Date.now();
    const database = sqlite(databasePath);
    database.prepare("update Contracts" +
        " set recordDelete_userName = ?," +
        " recordDelete_timeMillis = ?" +
        " where contractId = ?")
        .run(requestSession.user.userName, rightNowMillis, contractId);
    database.close();
    return true;
};
