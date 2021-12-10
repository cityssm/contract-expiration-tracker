import sqlite from "better-sqlite3";
import { contractsDB as databasePath } from "../../data/databasePaths.js";
export const getContractCategoryUsers = (filters, orderBy = "userName") => {
    let sql = "select userName, contractCategory" +
        " from ContractCategoryUsers" +
        " where 1 = 1";
    const parameters = [];
    if (filters.userName && filters.userName !== "") {
        sql += " and userName = ?";
        parameters.push(filters.userName);
    }
    if (filters.contractCategory && filters.contractCategory !== "") {
        sql += " and contractCategory = ?";
        parameters.push(filters.contractCategory);
    }
    sql += (orderBy === "userName"
        ? " order by userName, contractCategory"
        : " order by contractCategory, userName");
    const database = sqlite(databasePath, {
        readonly: true
    });
    const rows = database.prepare(sql).all(parameters);
    database.close();
    return rows;
};
export default getContractCategoryUsers;
