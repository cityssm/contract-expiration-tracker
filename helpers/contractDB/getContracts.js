import sqlite from "better-sqlite3";
import { contractsDB as databasePath } from "../../data/databasePaths.js";
export const getContracts = (searchString, requestSession) => {
    let sql = "select * from Contracts" +
        " where recordDelete_timeMillis is null";
    const parameters = [];
    if (!requestSession.user.canUpdate) {
        sql += " and contractCategory in (select contractCategory from ContractCategoryUsers where userName = ?)";
        parameters.push(requestSession.user.userName);
    }
    if (searchString !== "") {
        const searchStringPieces = searchString.trim().toLowerCase().split(" ");
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
    const rows = database.prepare(sql).all(parameters);
    database.close();
    return rows;
};
export default getContracts;
