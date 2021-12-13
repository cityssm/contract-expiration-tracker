import * as configFunctions from "./configFunctions.js";
import ActiveDirectory from "activedirectory2";
import * as adWebAuth from "@cityssm/ad-web-auth-connector";
const userDomain = configFunctions.getProperty("application.userDomain");
const authenticationSource = configFunctions.getProperty("authentication.source");
let authenticationFunction;
const adWebAuthConfig = configFunctions.getProperty("authentication.adWebAuthConfig");
const activeDirectoryConfig = configFunctions.getProperty("authentication.activeDirectoryConfig");
adWebAuth.setConfig(adWebAuthConfig);
const authenticateViaADWebAuth = async (userName, password) => {
    return await adWebAuth.authenticate(userDomain + "\\" + userName, password);
};
const authenticateViaActiveDirectory = async (userName, password) => {
    return new Promise((resolve) => {
        try {
            const ad = new ActiveDirectory(activeDirectoryConfig);
            ad.authenticate(userDomain + "\\" + userName, password, async (error, auth) => {
                if (error) {
                    resolve(false);
                }
                resolve(auth);
            });
        }
        catch (_a) {
            resolve(false);
        }
    });
};
switch (authenticationSource) {
    case "ad-web-auth":
        adWebAuth.setConfig(adWebAuthConfig);
        authenticationFunction = authenticateViaADWebAuth;
        break;
    case "Active Directory":
        authenticationFunction = authenticateViaActiveDirectory;
        break;
}
export const authenticate = async (userName, password) => {
    if (!userName || userName === "" || !password || password === "") {
        return false;
    }
    return await authenticationFunction(userName, password);
};
