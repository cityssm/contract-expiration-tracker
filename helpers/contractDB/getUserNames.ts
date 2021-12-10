import sqlite from "better-sqlite3";
import { contractsDB as databasePath } from "../../data/databasePaths.js";


export const getUserNames = (): string[] => {

  const database = sqlite(databasePath, {
    readonly: true
  });

  const rows: Array<{ userName: string; }> = database
    .prepare("select distinct userName" +
      " from ContractCategoryUsers" +
      " order by userName")
    .all();

  database.close();

  const userNames: string[] = [];

  for (const row of rows) {
    userNames.push(row.userName);
  }

  return userNames;
};


export default getUserNames;
