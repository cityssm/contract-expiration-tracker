import sqlite from "better-sqlite3";
import { contractsDB as databasePath } from "../../data/databasePaths.js";
export const getUserNames = () => {
    const database = sqlite(databasePath, {
        readonly: true
    });
    const rows = database
        .prepare("select distinct userName" +
        " from ContractCategoryUsers" +
        " order by userName")
        .all();
    database.close();
    const userNames = [];
    for (const row of rows) {
        userNames.push(row.userName);
    }
    return userNames;
};
export default getUserNames;
