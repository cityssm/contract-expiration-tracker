import createError from "http-errors";
import express from "express";
import { abuseCheck } from "@cityssm/express-abuse-points";
import compression from "compression";
import path from "path";
import cookieParser from "cookie-parser";
import csurf from "csurf";
import rateLimit from "express-rate-limit";
import session from "express-session";
import FileStore from "session-file-store";
import * as configFunctions from "./helpers/configFunctions.js";
import * as stringFns from "@cityssm/expressjs-server-js/stringFns.js";
import * as dateTimeFns from "@cityssm/expressjs-server-js/dateTimeFns.js";
import { version } from "./version.js";
import { updateOnly as handler_updateOnly } from "./handlers/permissionHandlers.js";
import routerLogin from "./routes/login.js";
import routerContracts from "./routes/contracts.js";
import routerAdmin from "./routes/admin.js";
import * as databaseInitializer from "./helpers/databaseInitializer.js";
import debug from "debug";
const debugApp = debug("contract-expiration-tracker:app");
const __dirname = ".";
databaseInitializer.initContractsDB();
export const app = express();
if (!configFunctions.getProperty("reverseProxy.disableEtag")) {
    app.set("etag", false);
}
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(abuseCheck({
    byXForwardedFor: configFunctions.getProperty("reverseProxy.blockViaXForwardedFor"),
    byIP: !configFunctions.getProperty("reverseProxy.blockViaXForwardedFor")
}));
if (!configFunctions.getProperty("reverseProxy.disableCompression")) {
    app.use(compression());
}
app.use((request, _response, next) => {
    debugApp(request.method + " " + request.url);
    next();
});
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(csurf({ cookie: true }));
const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 1000
});
app.use(limiter);
const urlPrefix = configFunctions.getProperty("reverseProxy.urlPrefix");
app.use(urlPrefix, express.static(path.join(__dirname, "public")));
app.use(urlPrefix + "/lib/bulma-js", express.static(path.join(__dirname, "node_modules", "@cityssm", "bulma-js", "dist")));
app.use(urlPrefix + "/lib/bulma-webapp-js", express.static(path.join(__dirname, "node_modules", "@cityssm", "bulma-webapp-js", "dist")));
app.use(urlPrefix + "/lib/date-diff", express.static(path.join(__dirname, "node_modules", "@cityssm", "date-diff", "es2015")));
app.use(urlPrefix + "/lib/fa5", express.static(path.join(__dirname, "node_modules", "@fortawesome", "fontawesome-free")));
const sessionCookieName = configFunctions.getProperty("session.cookieName");
const FileStoreSession = FileStore(session);
app.use(session({
    store: new FileStoreSession({
        path: "./data/sessions",
        logFn: debug("contract-expiration-tracker:session")
    }),
    name: sessionCookieName,
    secret: configFunctions.getProperty("session.secret"),
    resave: true,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: configFunctions.getProperty("session.maxAgeMillis"),
        sameSite: "strict"
    }
}));
app.use((request, response, next) => {
    if (request.cookies[sessionCookieName] && !request.session.user) {
        response.clearCookie(sessionCookieName);
    }
    next();
});
const sessionChecker = (request, response, next) => {
    if (request.session.user && request.cookies[sessionCookieName]) {
        return next();
    }
    return response.redirect(urlPrefix + "/login");
};
app.use(function (request, response, next) {
    response.locals.configFunctions = configFunctions;
    response.locals.dateTimeFns = dateTimeFns;
    response.locals.stringFns = stringFns;
    response.locals.user = request.session.user;
    response.locals.csrfToken = request.csrfToken();
    response.locals.buildNumber = version;
    response.locals.urlPrefix = configFunctions.getProperty("reverseProxy.urlPrefix");
    next();
});
app.get(urlPrefix + "/", sessionChecker, (_request, response) => {
    response.redirect(urlPrefix + "/contracts");
});
app.use(urlPrefix + "/contracts", sessionChecker, routerContracts);
app.use(urlPrefix + "/admin", sessionChecker, handler_updateOnly, routerAdmin);
app.use(urlPrefix + "/login", routerLogin);
app.get(urlPrefix + "/logout", (request, response) => {
    if (request.session.user && request.cookies[sessionCookieName]) {
        request.session.destroy(null);
        request.session = undefined;
        response.clearCookie(sessionCookieName);
    }
    response.redirect(urlPrefix + "/login");
});
app.use(function (_request, _response, next) {
    next(createError(404));
});
app.use(function (error, request, response) {
    response.locals.message = error.message;
    response.locals.error = request.app.get("env") === "development" ? error : {};
    response.status(error.status || 500);
    response.render("error");
});
export default app;
