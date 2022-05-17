import sqlite from "better-sqlite3";
import { contractsDB as databasePath } from "../../data/databasePaths.js";
import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";
export const getContract = (contractId, requestSession) => {
    let sql = "select contractId," +
        " contractTitle, contractCategory, contractParty, contractDescription," +
        (requestSession.user.canUpdate ? " privateContractDescription," : "") +
        " startDate, userFn_dateIntegerToString(startDate) as startDateString," +
        " endDate, userFn_dateIntegerToString(endDate) as endDateString," +
        " extensionDate, userFn_dateIntegerToString(extensionDate) as extensionDateString," +
        " hasBeenReplaced," +
        " managingUserName," +
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
    const contract = database.prepare(sql).get(parameters);
    database.close();
    return contract;
};
export default getContract;
