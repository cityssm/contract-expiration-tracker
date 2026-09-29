import * as dateTimeFunctions from '@cityssm/expressjs-server-js/dateTimeFns.js'
import sqlite from 'better-sqlite3'
import type * as expressSession from 'express-session'

import { contractsDB as databasePath } from '../../data/databasePaths.js'
import type { Contract } from '../../types/recordTypes.js'

export const getContract = (
  contractId: number | string,
  requestSession: expressSession.Session
): Contract => {
  let sql = /* sql */ `
    SELECT
      contractId,
      contractTitle,
      contractCategory,
      contractParty,
      contractDescription,
      ${requestSession.user.canUpdate
        ? ' privateContractDescription,'
        : ''} startDate,
      userFn_dateIntegerToString (startDate) AS startDateString,
      endDate,
      userFn_dateIntegerToString (endDate) AS endDateString,
      extensionDate,
      userFn_dateIntegerToString (extensionDate) AS extensionDateString,
      hasBeenReplaced,
      managingUserName,
      recordUpdate_userName,
      recordUpdate_timeMillis
    FROM
      Contracts
    WHERE
      recordDelete_timeMillis IS NULL
      AND contractId = ?
  `

  const parameters = [contractId]

  if (!requestSession.user.canUpdate) {
    sql +=
      ' and contractCategory in (select contractCategory from ContractCategoryUsers where userName = ?)'
    parameters.push(requestSession.user.userName)
  }

  const database = sqlite(databasePath, {
    readonly: true
  })

  database.function(
    'userFn_dateIntegerToString',
    dateTimeFunctions.dateIntegerToString
  )

  const contract: Contract = database.prepare(sql).get(parameters)

  database.close()

  return contract
}

export default getContract
