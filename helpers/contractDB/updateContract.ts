import sqlite from "better-sqlite3";
import { contractsDB as databasePath } from "../../data/databasePaths.js";

import { dateStringToInteger } from "@cityssm/expressjs-server-js/dateTimeFns.js";

import type * as expressSession from "express-session";

interface UpdateContractForm {
  contractId: string;
  contractTitle: string;
  contractCategory: string;
  contractParty: string;
  contractDescription: string;
  startDateString: string;
  endDateString: string;
  extensionDateString: string;
}

export const updateContract = (contractForm: UpdateContractForm, requestSession: expressSession.Session): boolean => {

  const rightNowMillis = Date.now();

  const database = sqlite(databasePath);

  database.prepare("update Contracts" +
    " set contractTitle = ?," +
    " contractCategory = ?," +
    " contractParty = ?," +
    " contractDescription = ?," +
    " startDate = ?," +
    " endDate = ?," +
    " extensionDate = ?," +
    " recordUpdate_userName = ?," +
    " recordUpdate_timeMillis = ?" +
    " where contractId = ?")
    .run(contractForm.contractTitle,
      contractForm.contractCategory,
      contractForm.contractParty,
      contractForm.contractDescription,
      contractForm.startDateString === "" ? undefined : dateStringToInteger(contractForm.startDateString),
      contractForm.endDateString === "" ? undefined : dateStringToInteger(contractForm.endDateString),
      contractForm.extensionDateString === "" ? undefined : dateStringToInteger(contractForm.extensionDateString),
      requestSession.user.userName,
      rightNowMillis,
      contractForm.contractId);

  database.close();

  return true;
};
