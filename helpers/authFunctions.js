import { AdWebAuthConnector } from '@cityssm/ad-web-auth-connector';
import ActiveDirectory from 'activedirectory2';
import * as configFunctions from './configFunctions.js';
const userDomain = configFunctions.getProperty('application.userDomain');
const authenticationSource = configFunctions.getProperty('authentication.source');
let authenticationFunction;
const adWebAuthConfig = configFunctions.getProperty('authentication.adWebAuthConfig');
const activeDirectoryConfig = configFunctions.getProperty('authentication.activeDirectoryConfig');
const adWebAuthConnector = adWebAuthConfig === undefined
    ? undefined
    : new AdWebAuthConnector(adWebAuthConfig);
const authenticateViaADWebAuth = async (userName, password) => adWebAuthConnector === undefined
    ? false
    : await adWebAuthConnector.authenticate(`${userDomain}\\${userName}`, password);
const authenticateViaActiveDirectory = async (userName, password) => await new Promise((resolve) => {
    try {
        const ad = new ActiveDirectory(activeDirectoryConfig);
        ad.authenticate(`${userDomain}\\${userName}`, password, async (error, auth) => {
            if (error) {
                resolve(false);
            }
            resolve(auth);
        });
    }
    catch {
        resolve(false);
    }
});
switch (authenticationSource) {
    case 'Active Directory': {
        authenticationFunction = authenticateViaActiveDirectory;
        break;
    }
    case 'ad-web-auth': {
        authenticationFunction = authenticateViaADWebAuth;
        break;
    }
}
export const authenticate = async (userName, password) => !userName || userName === '' || !password || password === ''
    ? false
    : await authenticationFunction(userName, password);
