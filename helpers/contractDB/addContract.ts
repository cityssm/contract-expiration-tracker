import { dateStringToInteger } from '@cityssm/expressjs-server-js/dateTimeFns.js'
import sqlite from 'better-sqlite3'
import type * as expressSession from 'express-session'

import { contractsDB as databasePath } from '../../data/databasePaths.js'

interface AddContractForm {
  contractTitle: string
  contractCategoryIsNew: '0' | '1'
  'contractCategory-existing': string
  'contractCategory-new': string
  contractParty: string
  managingUserName: string
  contractDescription: string
  privateContractDescription: string
  startDateString: string
  endDateString: string
  extensionDateString: string
  hasBeenReplaced?: string
}

export const addContract = (
  contractForm: AddContractForm,
  requestSession: expressSession.Session
): number => {
  const rightNowMillis = Date.now()

  const database = sqlite(databasePath)

  const info = database
    .prepare(/* sql */ `
      INSERT INTO
        Contracts (
          contractTitle,
          contractCategory,
          contractParty,
          managingUserName,
          contractDescription,
          privateContractDescription,
          startDate,
          endDate,
          extensionDate,
          hasBeenReplaced,
          recordCreate_userName,
          recordCreate_timeMillis,
          recordUpdate_userName,
          recordUpdate_timeMillis
        )
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .run(
      contractForm.contractTitle,
      contractForm.contractCategoryIsNew === '1'
        ? contractForm['contractCategory-new']
        : contractForm['contractCategory-existing'],
      contractForm.contractParty,
      contractForm.managingUserName,
      contractForm.contractDescription,
      contractForm.privateContractDescription,
      contractForm.startDateString === ''
        ? undefined
        : dateStringToInteger(contractForm.startDateString),
      contractForm.endDateString === ''
        ? undefined
        : dateStringToInteger(contractForm.endDateString),
      contractForm.extensionDateString === ''
        ? undefined
        : dateStringToInteger(contractForm.extensionDateString),
      contractForm.hasBeenReplaced && contractForm.hasBeenReplaced !== ''
        ? 1
        : 0,
      requestSession.user.userName,
      rightNowMillis,
      requestSession.user.userName,
      rightNowMillis
    )

  const contractId = info.lastInsertRowid as number

  database.close()

  return contractId
}
