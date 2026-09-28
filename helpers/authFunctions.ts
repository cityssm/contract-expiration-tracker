import { AdWebAuthConnector } from '@cityssm/ad-web-auth-connector'
import ActiveDirectory from 'activedirectory2'

import * as configFunctions from './configFunctions.js'

const userDomain = configFunctions.getProperty('application.userDomain')

const authenticationSource = configFunctions.getProperty(
  'authentication.source'
)
let authenticationFunction: (
  userName: string,
  password: string
) => Promise<boolean>

const adWebAuthConfig = configFunctions.getProperty(
  'authentication.adWebAuthConfig'
)
const activeDirectoryConfig = configFunctions.getProperty(
  'authentication.activeDirectoryConfig'
)

const adWebAuthConnector =
  adWebAuthConfig === undefined
    ? undefined
    : new AdWebAuthConnector(adWebAuthConfig)

const authenticateViaADWebAuth = async (
  userName: string,
  password: string
): Promise<boolean> =>
  // eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
  adWebAuthConnector === undefined
    ? false
    : await adWebAuthConnector.authenticate(
        `${userDomain}\\${userName}`,
        password
      )

const authenticateViaActiveDirectory = async (
  userName: string,
  password: string
): Promise<boolean> =>
  await new Promise((resolve) => {
    try {
      const ad = new ActiveDirectory(activeDirectoryConfig)

      ad.authenticate(
        `${userDomain}\\${userName}`,
        password,
        async (error, auth) => {
          if (error) {
            resolve(false)
          }

          resolve(auth)
        }
      )
    } catch {
      resolve(false)
    }
  })

/*
 * Setup
 */

switch (authenticationSource) {
  case 'Active Directory': {
    authenticationFunction = authenticateViaActiveDirectory
    break
  }

  case 'ad-web-auth': {
    authenticationFunction = authenticateViaADWebAuth
    break
  }
}

export const authenticate = async (
  userName: string,
  password: string
): Promise<boolean> =>
  // eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
  !userName || userName === '' || !password || password === ''
    ? false
    : await authenticationFunction(userName, password)
