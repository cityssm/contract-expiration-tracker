import sqlite from "better-sqlite3";
import { contractsDB as databasePath } from "../../data/databasePaths.js";
export const getUserAccessGUIDs = (userName) => {
    const database = sqlite(databasePath, {
        readonly: true
    });
    const userAccessGUIDs = database.prepare("select guidA, guidB" +
        " from UserAccessGUIDs" +
        " where userName = ?")
        .get(userName);
    database.close();
    return userAccessGUIDs;
};
export default getUserAccessGUIDs;
