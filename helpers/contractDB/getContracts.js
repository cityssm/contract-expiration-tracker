import * as dateTimeFunctions from '@cityssm/expressjs-server-js/dateTimeFns.js';
import sqlite from 'better-sqlite3';
import { contractsDB as databasePath } from '../../data/databasePaths.js';
export const getContracts = (filters, requestSession, options = {}) => {
    let sql = `
    SELECT
      contractId,
      contractTitle,
      contractCategory,
      contractParty,
      ${options.includeContractDescription
        ? ' contractDescription,'
        : ''} ${requestSession.user.canUpdate &&
        options.includePrivateContractDescription
        ? ' privateContractDescription,'
        : ''} startDate,
      userFn_dateIntegerToString (startDate) AS startDateString,
      endDate,
      userFn_dateIntegerToString (endDate) AS endDateString,
      extensionDate,
      userFn_dateIntegerToString (extensionDate) AS extensionDateString,
      hasBeenReplaced,
      managingUserName ${options.includeTimeMillis
        ? ', recordCreate_timeMillis, recordUpdate_timeMillis'
        : ''}
    FROM
      Contracts
    WHERE
      recordDelete_timeMillis IS NULL
  `;
    const parameters = [];
    if (!requestSession.user.canUpdate) {
        sql +=
            ' and contractCategory in (select contractCategory from ContractCategoryUsers where userName = ?)';
        parameters.push(requestSession.user.userName);
    }
    if (filters.contractCategory && filters.contractCategory !== '') {
        sql += ' and contractCategory = ?';
        parameters.push(filters.contractCategory);
    }
    if (filters.hasBeenReplaced !== undefined && filters.hasBeenReplaced !== '') {
        sql += ' and hasBeenReplaced = ?';
        parameters.push(filters.hasBeenReplaced);
    }
    if (filters.searchString && filters.searchString !== '') {
        const searchStringPieces = filters.searchString
            .trim()
            .toLowerCase()
            .split(' ');
        for (const searchStringPiece of searchStringPieces) {
            sql += `
        AND (
          INSTR(LOWER(contractTitle), ?)
          OR INSTR(LOWER(contractDescription), ?)
          OR INSTR(LOWER(contractParty), ?)
        )
      `;
            parameters.push(searchStringPiece, searchStringPiece, searchStringPiece);
        }
    }
    if (filters.managingUserName && filters.managingUserName !== '') {
        sql += ' and managingUserName = ?';
        parameters.push(filters.managingUserName);
    }
    if (!filters.includeExpired) {
        sql += ' and (endDate is null or endDate >= ?)';
        parameters.push(dateTimeFunctions.dateToInteger(new Date()));
    }
    sql += ' order by endDate desc, startDate desc';
    const database = sqlite(databasePath, {
        readonly: true
    });
    database.function('userFn_dateIntegerToString', dateTimeFunctions.dateIntegerToString);
    const rows = database.prepare(sql).all(parameters);
    database.close();
    return rows;
};
export default getContracts;
