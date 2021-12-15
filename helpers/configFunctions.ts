import type * as configTypes from "../types/configTypes";
import type { ADWebAuthConfig } from "@cityssm/ad-web-auth-connector/types";


/*
 * LOAD CONFIGURATION
 */

// eslint-disable-next-line node/no-unpublished-import
import { config } from "../data/config.js";

Object.freeze(config);


/*
 * SET UP FALLBACK VALUES
 */


const configOverrides: { [propertyName: string]: unknown } = {};

const configFallbackValues = new Map<string, unknown>();

configFallbackValues.set("application.httpPort", 55_557);

configFallbackValues.set("reverseProxy.disableCompression", false);
configFallbackValues.set("reverseProxy.disableEtag", false);
configFallbackValues.set("reverseProxy.blockViaXForwardedFor", false);
configFallbackValues.set("reverseProxy.urlPrefix", "");

configFallbackValues.set("session.cookieName", "contract-expiration-tracker-user-sid");
configFallbackValues.set("session.secret", "cityssm/contract-expiration-tracker");
configFallbackValues.set("session.maxAgeMillis", 60 * 60 * 1000);
configFallbackValues.set("session.doKeepAlive", false);


configFallbackValues.set("permissions.canUpdate", []);

configFallbackValues.set("customizations.applicationName", "Contract Expiration Tracker");

configFallbackValues.set("customizations.contract.alias", "Contract");
configFallbackValues.set("customizations.contract.aliasPlural", "Contracts");

configFallbackValues.set("customizations.contractCategory.alias", "Contract Category");
configFallbackValues.set("customizations.contractCategory.aliasPlural", "Contract Categories");

configFallbackValues.set("customizations.notificationDays", 90);


export function getProperty(propertyName: "application.httpPort"): number;
export function getProperty(propertyName: "application.userDomain"): string;

export function getProperty(propertyName: "reverseProxy.disableCompression"): boolean;
export function getProperty(propertyName: "reverseProxy.disableEtag"): boolean;
export function getProperty(propertyName: "reverseProxy.blockViaXForwardedFor"): boolean;
export function getProperty(propertyName: "reverseProxy.urlPrefix"): "";

export function getProperty(propertyName: "session.cookieName"): string;
export function getProperty(propertyName: "session.doKeepAlive"): boolean;
export function getProperty(propertyName: "session.maxAgeMillis"): number;
export function getProperty(propertyName: "session.secret"): string;

export function getProperty(propertyName: "authentication.source"): "ad-web-auth" | "Active Directory";
export function getProperty(propertyName: "authentication.adWebAuthConfig"): ADWebAuthConfig;
export function getProperty(propertyName: "authentication.activeDirectoryConfig"): configTypes.ActiveDirectoryConfig;

export function getProperty(propertyName: "permissions.canUpdate"): string[];

export function getProperty(propertyName: "customizations.applicationName"): string;
export function getProperty(propertyName: "customizations.contractCategory.alias"): string;
export function getProperty(propertyName: "customizations.contractCategory.aliasPlural"): string;
export function getProperty(propertyName: "customizations.notificationDays"): number;


export function getProperty(propertyName: string): unknown {

  if (Object.prototype.hasOwnProperty.call(configOverrides, propertyName)) {
    return configOverrides[propertyName];
  }

  const propertyNameSplit = propertyName.split(".");

  let currentObject = config;

  for (const element of propertyNameSplit) {

    currentObject = currentObject[element];

    if (!currentObject) {
      return configFallbackValues.get(propertyName);
    }

  }

  return currentObject;
}
