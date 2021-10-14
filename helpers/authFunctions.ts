import * as configFunctions from "./configFunctions.js";
import * as adWebAuth from "@cityssm/ad-web-auth-connector";


const adWebAuthConfig = configFunctions.getProperty("adWebAuthConfig");
const userDomain = configFunctions.getProperty("application.userDomain");


adWebAuth.setConfig(adWebAuthConfig);


export const authenticate = async (userName: string, password: string): Promise<boolean> => {
  return await adWebAuth.authenticate(userDomain + "\\" + userName, password);
};
