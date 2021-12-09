import sqlite from "better-sqlite3";
import { contractsDB as databasePath } from "../../data/databasePaths.js";
import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";
export const getContracts = (filters, requestSession) => {
    let sql = "select contractId," +
        " contractTitle, contractCategory, contractParty," +
        " startDate, userFn_dateIntegerToString(startDate) as startDateString," +
        " endDate, userFn_dateIntegerToString(endDate) as endDateString," +
        " extensionDate, userFn_dateIntegerToString(extensionDate) as extensionDateString" +
        " from Contracts" +
        " where recordDelete_timeMillis is null";
    const parameters = [];
    if (!requestSession.user.canUpdate) {
        sql += " and contractCategory in (select contractCategory from ContractCategoryUsers where userName = ?)";
        parameters.push(requestSession.user.userName);
    }
    if (filters.contractCategory !== "") {
        sql += " and contractCategory = ?";
        parameters.push(filters.contractCategory);
    }
    if (filters.searchString !== "") {
        const searchStringPieces = filters.searchString.trim().toLowerCase().split(" ");
        for (const searchStringPiece of searchStringPieces) {
            sql += " and (" +
                "instr(lower(contractTitle), ?)" +
                " or instr(lower(contractDescription), ?)" +
                ")";
            parameters.push(searchStringPiece, searchStringPiece);
        }
    }
    const database = sqlite(databasePath, {
        readonly: true
    });
    database.function("userFn_dateIntegerToString", dateTimeFunctions.dateIntegerToString);
    const rows = database.prepare(sql).all(parameters);
    database.close();
    return rows;
};
export default getContracts;
