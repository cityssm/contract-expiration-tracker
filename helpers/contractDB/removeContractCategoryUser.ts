import sqlite from "better-sqlite3";
import { contractsDB as databasePath } from "../../data/databasePaths.js";


export const removeContractCategoryUser = (userName: string, contractCategory: string): boolean => {

  const database = sqlite(databasePath);

  database.prepare("delete from ContractCategoryUsers" +
    " where userName = ?" +
    " and contractCategory = ?")
    .run(userName,
      contractCategory);

  database.close();

  return true;
};


export default removeContractCategoryUser;
