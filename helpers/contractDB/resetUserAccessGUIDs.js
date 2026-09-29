import uuid from 'node:crypto';
import sqlite from 'better-sqlite3';
import { contractsDB as databasePath } from '../../data/databasePaths.js';
export const resetUserAccessGUIDs = (userName) => {
    const database = sqlite(databasePath);
    const guidA = uuid.randomUUID().toLowerCase();
    const guidB = uuid.randomUUID().toLowerCase();
    database
        .prepare(`
      DELETE FROM UserAccessGUIDs
      WHERE
        userName = ?
    `)
        .run(userName);
    database
        .prepare(`
      INSERT INTO
        UserAccessGUIDs (userName, guidA, guidB, recordCreate_timeMillis)
      VALUES
        (?, ?, ?, ?)
    `)
        .run(userName, guidA, guidB, Date.now());
    database.close();
    return {
        guidA,
        guidB
    };
};
export default resetUserAccessGUIDs;
