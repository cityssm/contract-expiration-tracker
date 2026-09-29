import sqlite from 'better-sqlite3'
import debug from 'debug'

import { contractsDB as databasePath } from '../data/databasePaths.js'
const debugSQL = debug('contract-expiration-tracker:databaseInitializer')

export const initContractsDB = (): boolean => {
  const contractsDB = sqlite(databasePath)

  const row = contractsDB
    .prepare(
      "select name from sqlite_master where type = 'table' and name = 'Contracts'"
    )
    .get()

  if (!row) {
    debugSQL('Creating contracts.db')

    /*
     * Contracts
     */

    contractsDB
      .prepare(/* sql */ `
        CREATE TABLE IF NOT EXISTS Contracts (
          contractId INTEGER PRIMARY KEY AUTOINCREMENT,
          contractCategory VARCHAR(100),
          contractTitle VARCHAR(200) NOT NULL,
          contractParty VARCHAR(200),
          contractDescription TEXT,
          privateContractDescription TEXT,
          startDate INTEGER NOT NULL,
          endDate INTEGER,
          extensionDate INTEGER,
          managingUserName VARCHAR(30),
          hasBeenReplaced bit NOT NULL DEFAULT 0,
          recordCreate_userName VARCHAR(30) NOT NULL,
          recordCreate_timeMillis INTEGER NOT NULL,
          recordUpdate_userName VARCHAR(30) NOT NULL,
          recordUpdate_timeMillis INTEGER NOT NULL,
          recordDelete_userName VARCHAR(30),
          recordDelete_timeMillis INTEGER
        )
      `)
      .run()

    contractsDB
      .prepare(
        'create table if not exists ContractTags (' +
          'contractId integer not null,' +
          ' tag varchar(100) not null,' +
          ' primary key (contractId, tag),' +
          ' foreign key (contractId) references Contracts (contractId)' +
          ') without rowid'
      )
      .run()

    contractsDB
      .prepare(
        'create table if not exists ContractCategoryUsers (' +
          'userName varchar(30),' +
          ' contractCategory varchar(100) not null,' +
          ' primary key (userName, contractCategory)' +
          ') without rowid'
      )
      .run()

    /*
     * User Access GUIDs
     */

    contractsDB
      .prepare(
        'create table UserAccessGUIDs (' +
          'userName varchar(30) primary key not null,' +
          ' guidA char(36) not null,' +
          ' guidB char(36) not null,' +
          ' recordCreate_timeMillis integer not null' +
          ') without rowid'
      )
      .run()

    return true
  }

  contractsDB.close()

  return false
}
