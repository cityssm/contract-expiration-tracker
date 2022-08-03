import sqlite from "better-sqlite3";
import {
    contractsDB as databasePath
} from "../../data/databasePaths.js";


export const getContractTitle = (contractId: number | string): string => {

    const database = sqlite(databasePath, {
        readonly: true
    });

    const contractTitle: string = database.prepare("select contractTitle" +
            " from Contracts" +
            " where recordDelete_timeMillis is null" +
            " and contractId = ?")
        .get(contractId)
        .contractTitle;

    database.close();

    return contractTitle;
};


export default getContractTitle;