import sqlite from "better-sqlite3";
import { contractsDB as databasePath } from "../../data/databasePaths.js";

import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";

import type { Contract, SessionWithUser } from "../../types/recordTypes";


export interface GetContractsFilters {
  contractCategory: string;
  searchString: string;
  includeExpired?: string;
  managingUserName?: string;
  hasBeenReplaced?: "" | "1" | "0";
}

interface GetContractsOptions {
  includeContractDescription?: boolean;
  includePrivateContractDescription?: boolean;
  includeTimeMillis?: boolean;
}


export const getContracts = (filters: GetContractsFilters, requestSession: SessionWithUser, options: GetContractsOptions = {}): Contract[] => {

  let sql = "select contractId," +
    " contractTitle, contractCategory, contractParty," +
    (options.includeContractDescription
      ? " contractDescription,"
      : "") +
    (requestSession.user.canUpdate && options.includePrivateContractDescription
      ? " privateContractDescription,"
      : "") +
    " startDate, userFn_dateIntegerToString(startDate) as startDateString," +
    " endDate, userFn_dateIntegerToString(endDate) as endDateString," +
    " extensionDate, userFn_dateIntegerToString(extensionDate) as extensionDateString," +
    " hasBeenReplaced," +
    " managingUserName" +
    (options.includeTimeMillis
      ? ", recordCreate_timeMillis, recordUpdate_timeMillis"
      : "") +
    " from Contracts" +
    " where recordDelete_timeMillis is null";

  const parameters = [];

  if (!requestSession.user.canUpdate) {
    sql += " and contractCategory in (select contractCategory from ContractCategoryUsers where userName = ?)";
    parameters.push(requestSession.user.userName);
  }

  if (filters.contractCategory && filters.contractCategory !== "") {
    sql += " and contractCategory = ?";
    parameters.push(filters.contractCategory);
  }

  if (filters.hasBeenReplaced && filters.hasBeenReplaced !== "") {
    sql += " and hasBeenReplaced = ?";
    parameters.push(filters.hasBeenReplaced);
  }

  if (filters.searchString && filters.searchString !== "") {

    const searchStringPieces = filters.searchString.trim().toLowerCase().split(" ");

    for (const searchStringPiece of searchStringPieces) {

      sql += " and (" +
        "instr(lower(contractTitle), ?)" +
        " or instr(lower(contractDescription), ?)" +
        " or instr(lower(contractParty), ?)" +
        ")";

      parameters.push(searchStringPiece, searchStringPiece, searchStringPiece);
    }
  }

  if (filters.managingUserName && filters.managingUserName !== "") {
    sql += " and managingUserName = ?";
    parameters.push(filters.managingUserName);
  }

  if (!filters.includeExpired) {
    sql += " and endDate is not null and endDate >= ?";
    parameters.push(dateTimeFunctions.dateToInteger(new Date()));
  }

  sql += " order by endDate desc, startDate desc"

  const database = sqlite(databasePath, {
    readonly: true
  });

  database.function("userFn_dateIntegerToString", dateTimeFunctions.dateIntegerToString);

  const rows: Contract[] = database.prepare(sql).all(parameters);

  database.close();

  return rows;
};


export default getContracts;
