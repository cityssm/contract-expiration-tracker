import sqlite from "better-sqlite3";
import { contractsDB as databasePath } from "../../data/databasePaths.js";

import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";

import type { Contract } from "../../types/recordTypes";
import type * as expressSession from "express-session";



export const getContract = (contractId: number | string, requestSession: expressSession.Session): Contract => {

  let sql = "select contractId," +
    " contractTitle, contractCategory, contractParty, contractDescription," +
    " startDate, userFn_dateIntegerToString(startDate) as startDateString," +
    " endDate, userFn_dateIntegerToString(endDate) as endDateString," +
    " extensionDate, userFn_dateIntegerToString(extensionDate) as extensionDateString," +
    " recordUpdate_userName, recordUpdate_timeMillis" +
    " from Contracts" +
    " where recordDelete_timeMillis is null" +
    " and contractId = ?";

  const parameters = [contractId];

  if (!requestSession.user.canUpdate) {
    sql += " and contractCategory in (select contractCategory from ContractCategoryUsers where userName = ?)";
    parameters.push(requestSession.user.userName);
  }

  const database = sqlite(databasePath, {
    readonly: true
  });

  database.function("userFn_dateIntegerToString", dateTimeFunctions.dateIntegerToString);

  const contract: Contract = database.prepare(sql).get(parameters);

  database.close();

  return contract;
};


export default getContract;
