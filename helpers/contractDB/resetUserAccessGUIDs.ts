import sqlite from "better-sqlite3";
import { contractsDB as databasePath } from "../../data/databasePaths.js";

import { v4 as uuidv4 } from "uuid";

import type { UserAccessGUIDs } from "./getUserAccessGUIDs"


export const resetUserAccessGUIDs = (userName: string): UserAccessGUIDs => {

  const database = sqlite(databasePath);

  const guidA = uuidv4().toLowerCase();
  const guidB = uuidv4().toLowerCase();

  database.prepare(
    "delete from UserAccessGUIDs" +
    " where userName = ?")
    .run(userName);

  database.prepare(
    "insert into UserAccessGUIDs" +
    " (userName, guidA, guidB, recordCreate_timeMillis)" +
    " values (?, ?, ?, ?)")
    .run(userName, guidA, guidB, Date.now());

  database.close();

  return {
    guidA,
    guidB
  };
};


export default resetUserAccessGUIDs;
