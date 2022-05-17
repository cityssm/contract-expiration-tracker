import sqlite from "better-sqlite3";
import { contractsDB as databasePath } from "../../data/databasePaths.js";

import { dateStringToInteger } from "@cityssm/expressjs-server-js/dateTimeFns.js";

import type * as expressSession from "express-session";

interface UpdateContractForm {
  contractId: string;
  contractTitle: string;
  contractCategory: string;
  contractParty: string;
  managingUserName: string;
  contractDescription: string;
  privateContractDescription: string;
  startDateString: string;
  endDateString: string;
  extensionDateString: string;
  hasBeenReplaced?: string;
}

export const updateContract = (contractForm: UpdateContractForm, requestSession: expressSession.Session): boolean => {

  const rightNowMillis = Date.now();

  const database = sqlite(databasePath);

  database.prepare("update Contracts" +
    " set contractTitle = ?," +
    " contractCategory = ?," +
    " contractParty = ?," +
    " managingUserName = ?," +
    " contractDescription = ?," +
    " privateContractDescription = ?," +
    " startDate = ?," +
    " endDate = ?," +
    " extensionDate = ?," +
    " hasBeenReplaced = ?," +
    " recordUpdate_userName = ?," +
    " recordUpdate_timeMillis = ?" +
    " where contractId = ?")
    .run(contractForm.contractTitle,
      contractForm.contractCategory,
      contractForm.contractParty,
      contractForm.managingUserName,
      contractForm.contractDescription,
      contractForm.privateContractDescription,
      contractForm.startDateString === "" ? undefined : dateStringToInteger(contractForm.startDateString),
      contractForm.endDateString === "" ? undefined : dateStringToInteger(contractForm.endDateString),
      contractForm.extensionDateString === "" ? undefined : dateStringToInteger(contractForm.extensionDateString),
      (contractForm.hasBeenReplaced && contractForm.hasBeenReplaced !== "" ? 1 : 0),
      requestSession.user.userName,
      rightNowMillis,
      contractForm.contractId);

  database.close();

  return true;
};
