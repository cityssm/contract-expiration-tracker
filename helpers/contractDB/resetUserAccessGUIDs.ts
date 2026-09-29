import uuid from 'node:crypto'

import sqlite from 'better-sqlite3'

import { contractsDB as databasePath } from '../../data/databasePaths.js'

import type { UserAccessGUIDs } from './getUserAccessGUIDs.js'

export const resetUserAccessGUIDs = (userName: string): UserAccessGUIDs => {
  const database = sqlite(databasePath)

  const guidA = uuid.randomUUID().toLowerCase()
  const guidB = uuid.randomUUID().toLowerCase()

  database
    .prepare(/* sql */ `
      DELETE FROM UserAccessGUIDs
      WHERE
        userName = ?
    `)
    .run(userName)

  database
    .prepare(/* sql */ `
      INSERT INTO
        UserAccessGUIDs (userName, guidA, guidB, recordCreate_timeMillis)
      VALUES
        (?, ?, ?, ?)
    `)
    .run(userName, guidA, guidB, Date.now())

  database.close()

  return {
    guidA,
    guidB
  }
}

export default resetUserAccessGUIDs
