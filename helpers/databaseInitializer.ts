import { contractsDB as databasePath } from "../data/databasePaths.js";

import sqlite from "better-sqlite3";

import debug from "debug";
const debugSQL = debug("contract-expiration-tracker:databaseInitializer");


export const initContractsDB = (): boolean => {

  const contractsDB = sqlite(databasePath);

  const row = contractsDB
    .prepare("select name from sqlite_master where type = 'table' and name = 'Contracts'")
    .get();

  if (!row) {

    debugSQL("Creating contracts.db");

    /*
     * Contracts
     */

    contractsDB.prepare("create table if not exists Contracts (" +

      "contractId integer primary key autoincrement," +
      " contractCategory varchar(100)," +
      " contractTitle varchar(200) not null," +
      " contractParty varchar(200)," +
      " contractDescription text," +
      " startDate integer not null," +
      " endDate integer," +
      " extensionDate integer," +

      " recordCreate_userName varchar(30) not null," +
      " recordCreate_timeMillis integer not null," +
      " recordUpdate_userName varchar(30) not null," +
      " recordUpdate_timeMillis integer not null," +
      " recordDelete_userName varchar(30)," +
      " recordDelete_timeMillis integer" +

      ")").run();

    contractsDB.prepare("create table if not exists ContractTags (" +

      "contractId integer not null," +
      " tag varchar(100) not null," +
      " primary key (contractId, tag)," +
      " foreign key (contractId) references Contracts (contractId)" +

      ") without rowid").run();

    contractsDB.prepare("create table if not exists ContractCategoryUsers (" +
      "userName varchar(30)," +
      " contractCategory varchar(100) not null," +
      " primary key (userName, contractCategory)" +
      ") without rowid").run();

    /*
     * User Access GUIDs
     */

    contractsDB.prepare("create table UserAccessGUIDs (" +
      "userName varchar(30) primary key not null," +
      " guidA char(36) not null," +
      " guidB char(36) not null," +
      " recordCreate_timeMillis integer not null" +
      ") without rowid").run();

    return true;
  }

  contractsDB.close();

  return false;
};
