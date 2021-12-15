import sqlite from "better-sqlite3";
import { contractsDB as databasePath } from "../../data/databasePaths.js";
import { dateStringToInteger } from "@cityssm/expressjs-server-js/dateTimeFns.js";
export const updateContract = (contractForm, requestSession) => {
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
        " recordUpdate_userName = ?," +
        " recordUpdate_timeMillis = ?" +
        " where contractId = ?")
        .run(contractForm.contractTitle, contractForm.contractCategory, contractForm.contractParty, contractForm.managingUserName, contractForm.contractDescription, contractForm.privateContractDescription, contractForm.startDateString === "" ? undefined : dateStringToInteger(contractForm.startDateString), contractForm.endDateString === "" ? undefined : dateStringToInteger(contractForm.endDateString), contractForm.extensionDateString === "" ? undefined : dateStringToInteger(contractForm.extensionDateString), requestSession.user.userName, rightNowMillis, contractForm.contractId);
    database.close();
    return true;
};
