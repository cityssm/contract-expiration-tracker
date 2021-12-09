import sqlite from "better-sqlite3";
import { contractsDB as databasePath } from "../../data/databasePaths.js";

import type * as expressSession from "express-session";



export const getContractCategories = (requestSession: expressSession.Session): string[] => {

  let sql = "select distinct contractCategory" +
    " from Contracts" +
    " where recordDelete_timeMillis is null" +
    " and contractCategory != ''";

  const parameters = [];

  if (requestSession.user.canUpdate) {
    sql += " union select distinct contractCategory from ContractCategoryUsers";
  } else {
    sql += " and contractCategory in (select contractCategory from ContractCategoryUsers where userName = ?)";
    parameters.push(requestSession.user.userName);
  }

  sql += " order by contractCategory";

  const database = sqlite(databasePath, {
    readonly: true
  });

  const rows: Array<{ contractCategory: string; }> = database.prepare(sql).all(parameters);

  database.close();

  const contractCategories: string[] = [];

  for (const row of rows) {
    contractCategories.push(row.contractCategory);
  }

  return contractCategories;
};


export default getContractCategories;
