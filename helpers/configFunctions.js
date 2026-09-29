import { config } from '../data/config.js';
Object.freeze(config);
const configOverrides = {};
const configFallbackValues = new Map([
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
]);
export function getProperty(propertyName) {
    if (Object.hasOwn(configOverrides, propertyName)) {
        return configOverrides[propertyName];
    }
    const propertyNameSplit = propertyName.split('.');
    let currentObject = config;
    for (const element of propertyNameSplit) {
        currentObject = currentObject[element];
        if (!currentObject) {
            return configFallbackValues.get(propertyName);
        }
    }
    return currentObject;
}
