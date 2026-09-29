import type { ADWebAuthConfig } from '@cityssm/ad-web-auth-connector/types'
import type * as docuShareConfig from '@cityssm/docushare/types'

import { config } from '../data/config.js'
import type * as configTypes from '../types/configTypes.js'

/*
 * LOAD CONFIGURATION
 */

Object.freeze(config)

/*
 * SET UP FALLBACK VALUES
 */

const configOverrides: Record<string, unknown> = {}

const configFallbackValues = new Map<string, unknown>([
  ['application.httpPort', 55_557],
  ['application.rootUrl', 'http://localhost:55557/'],

  ['customizations.applicationName', 'Contract Expiration Tracker'],
  ['customizations.contract.alias', 'Contract'],
  ['customizations.contract.aliasPlural', 'Contracts'],
  ['customizations.contractCategory.alias', 'Contract Category'],
  ['customizations.contractCategory.aliasPlural', 'Contract Categories'],
  ['customizations.contractParty.alias', 'Contract Party'],

  ['customizations.contractParty.aliasPlural', 'Contract Parties'],
  ['customizations.notificationDays', 90],

  ['docuShare.isEnabled', false],

  ['permissions.canUpdate', []],

  ['reverseProxy.blockViaXForwardedFor', false],
  ['reverseProxy.disableCompression', false],
  ['reverseProxy.disableEtag', false],
  ['reverseProxy.urlPrefix', ''],

  ['session.cookieName', 'contract-expiration-tracker-user-sid'],
  ['session.doKeepAlive', false],
  ['session.maxAgeMillis', 60 * 60 * 1000],
  ['session.secret', 'cityssm/contract-expiration-tracker']
])

export function getProperty(propertyName: 'application.userDomain'): string
export function getProperty(propertyName: 'application.httpPort'): number
export function getProperty(propertyName: 'application.rootUrl'): string

export function getProperty(
  propertyName: 'reverseProxy.disableCompression'
): boolean
export function getProperty(propertyName: 'reverseProxy.disableEtag'): boolean
export function getProperty(
  propertyName: 'reverseProxy.blockViaXForwardedFor'
): boolean
export function getProperty(propertyName: 'reverseProxy.urlPrefix'): string

export function getProperty(propertyName: 'session.cookieName'): string
export function getProperty(propertyName: 'session.doKeepAlive'): boolean
export function getProperty(propertyName: 'session.maxAgeMillis'): number
export function getProperty(propertyName: 'session.secret'): string

export function getProperty(
  propertyName: 'authentication.source'
): 'Active Directory' | 'ad-web-auth'
export function getProperty(
  propertyName: 'authentication.adWebAuthConfig'
): ADWebAuthConfig
export function getProperty(
  propertyName: 'authentication.activeDirectoryConfig'
): configTypes.ActiveDirectoryConfig

export function getProperty(propertyName: 'permissions.canUpdate'): string[]

export function getProperty(
  propertyName: 'customizations.applicationName'
): string

export function getProperty(
  propertyName: 'customizations.contract.alias'
): string
export function getProperty(
  propertyName: 'customizations.contract.aliasPlural'
): string

export function getProperty(
  propertyName: 'customizations.contractCategory.alias'
): string
export function getProperty(
  propertyName: 'customizations.contractCategory.aliasPlural'
): string

export function getProperty(
  propertyName: 'customizations.contractParty.alias'
): string
export function getProperty(
  propertyName: 'customizations.contractParty.aliasPlural'
): string

export function getProperty(
  propertyName: 'customizations.notificationDays'
): number

export function getProperty(propertyName: 'docuShare.isEnabled'): boolean
export function getProperty(propertyName: 'docuShare.rootURL'): string
export function getProperty(propertyName: 'docuShare.collectionHandle'): string
export function getProperty(
  propertyName: 'docuShare.server'
): docuShareConfig.ServerConfig
export function getProperty(
  propertyName: 'docuShare.session'
): docuShareConfig.SessionConfig

export function getProperty(propertyName: string): unknown {
  if (Object.hasOwn(configOverrides, propertyName)) {
    return configOverrides[propertyName]
  }

  const propertyNameSplit = propertyName.split('.')

  let currentObject = config

  for (const element of propertyNameSplit) {
    currentObject = currentObject[element]

    if (!currentObject) {
      return configFallbackValues.get(propertyName)
    }
  }

  return currentObject
}
