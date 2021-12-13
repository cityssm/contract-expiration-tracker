import { Router } from "express";
import * as authFunctions from "../helpers/authFunctions.js";
import * as configFunctions from "../helpers/configFunctions.js";
import { getUserAccessGUIDs } from "../helpers/contractDB/getUserAccessGUIDs.js";
import { resetUserAccessGUIDs } from "../helpers/contractDB/resetUserAccessGUIDs.js";
import debug from "debug";
const debugLogin = debug("contract-expiration-tracker:routes:login");
const redirectURL = configFunctions.getProperty("reverseProxy.urlPrefix") + "/contracts";
export const router = Router();
router.route("/")
    .get((request, response) => {
    const sessionCookieName = configFunctions.getProperty("session.cookieName");
    if (request.session.user && request.cookies[sessionCookieName]) {
        response.redirect(redirectURL);
    }
    else {
        response.render("login", {
            userName: "",
            message: ""
        });
    }
})
    .post(async (request, response) => {
    const userName = request.body.userName.toLowerCase();
    const passwordPlain = request.body.password;
    try {
        const isAuthenticated = await authFunctions.authenticate(userName, passwordPlain);
        if (isAuthenticated) {
            let userAccessGUIDs = getUserAccessGUIDs(userName);
            if (!userAccessGUIDs) {
                userAccessGUIDs = resetUserAccessGUIDs(userName);
            }
            request.session.user = {
                userName: userName,
                canUpdate: configFunctions.getProperty("permissions.canUpdate").includes(userName),
                guidA: userAccessGUIDs.guidA,
                guidB: userAccessGUIDs.guidB
            };
            return response.redirect(redirectURL);
        }
        return response.render("login", {
            userName,
            message: "Login Failed"
        });
    }
    catch (error) {
        debugLogin(error);
        return response.render("login", {
            userName,
            message: "Login Failed"
        });
    }
});
export default router;
