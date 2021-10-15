import sqlite from "better-sqlite3";
import { contractsDB as databasePath } from "../../data/databasePaths.js";
import { dateStringToInteger } from "@cityssm/expressjs-server-js/dateTimeFns.js";
export const addContract = (contractForm, requestSession) => {
    const rightNowMillis = Date.now();
    const database = sqlite(databasePath);
    const info = database.prepare("insert into Contracts (" +
        "contractTitle, contractCategory, contractParty, contractDescription," +
        " startDate, endDate, extensionDate," +
        " recordCreate_userName, recordCreate_timeMillis, recordUpdate_userName, recordUpdate_timeMillis" +
        ")" +
        " values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
        .run(contractForm.contractTitle, contractForm.contractCategoryIsNew ? contractForm["contractCategory-new"] : contractForm["contractCategory-existing"], contractForm.contractParty, contractForm.contractDescription, contractForm.startDateString === "" ? undefined : dateStringToInteger(contractForm.startDateString), contractForm.endDateString === "" ? undefined : dateStringToInteger(contractForm.endDateString), contractForm.extensionDateString === "" ? undefined : dateStringToInteger(contractForm.extensionDateString), requestSession.user.userName, rightNowMillis, requestSession.user.userName, rightNowMillis);
    const contractId = info.lastInsertRowid;
    database.close();
    return contractId;
};
