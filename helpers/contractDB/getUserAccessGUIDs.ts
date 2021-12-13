import sqlite from "better-sqlite3";
import { contractsDB as databasePath } from "../../data/databasePaths.js";


export interface UserAccessGUIDs {
  guidA: string;
  guidB: string;
}


export const getUserAccessGUIDs = (userName: string): UserAccessGUIDs => {

  const database = sqlite(databasePath, {
    readonly: true
  });

  const userAccessGUIDs: UserAccessGUIDs = database.prepare(
    "select guidA, guidB" +
    " from UserAccessGUIDs" +
    " where userName = ?")
    .get(userName);

  database.close();

  return userAccessGUIDs;
};


export default getUserAccessGUIDs;
