import sqlite from 'better-sqlite3'

import { contractsDB as databasePath } from '../../data/databasePaths.js'

import { getContractCategoryUsers } from './getContractCategoryUsers.js'

export const addContractCategoryUser = (
  userName: string,
  contractCategory: string
): boolean => {
  const duplicateContractCategoryUser = getContractCategoryUsers({
    userName,
    contractCategory
  })

  if (
    duplicateContractCategoryUser &&
    duplicateContractCategoryUser.length > 0
  ) {
    return true
  }

  const database = sqlite(databasePath)

  database
    .prepare(/* sql */ `
      INSERT INTO
        ContractCategoryUsers (userName, contractCategory)
      VALUES
        (?, ?)
    `)
    .run(userName, contractCategory)

  database.close()

  return true
}

export default addContractCategoryUser
