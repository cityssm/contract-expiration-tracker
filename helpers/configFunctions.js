import { config } from "../data/config.js";
Object.freeze(config);
const configOverrides = {};
const configFallbackValues = new Map();
configFallbackValues.set("application.httpPort", 55557);
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
configFallbackValues.set("customizations.contractParty.alias", "Contract Party");
configFallbackValues.set("customizations.contractParty.aliasPlural", "Contract Parties");
configFallbackValues.set("customizations.notificationDays", 90);
export function getProperty(propertyName) {
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
