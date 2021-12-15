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
import routerExport from "./routes/export.js";
import routerContracts from "./routes/contracts.js";
import routerAdmin from "./routes/admin.js";

import * as databaseInitializer from "./helpers/databaseInitializer.js";

import debug from "debug";
const debugApp = debug("contract-expiration-tracker:app");

const __dirname = ".";


/*
 * INITALIZE THE DATABASES
 */


databaseInitializer.initContractsDB();


/*
 * INITIALIZE APP
 */


export const app = express();

if (!configFunctions.getProperty("reverseProxy.disableEtag")) {
  app.set("etag", false);
}

// View engine setup
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


/*
 * Rate Limiter
 */

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 1000
});

app.use(limiter);


/*
 * STATIC ROUTES
 */


const urlPrefix = configFunctions.getProperty("reverseProxy.urlPrefix");

if (urlPrefix !== "") {
  debugApp("urlPrefix = " + urlPrefix);
}


app.use(urlPrefix, express.static(path.join(__dirname, "public")));

app.use(urlPrefix + "/lib/bulma-js",
  express.static(path.join(__dirname, "node_modules", "@cityssm", "bulma-js", "dist")));

app.use(urlPrefix + "/lib/bulma-webapp-js",
  express.static(path.join(__dirname, "node_modules", "@cityssm", "bulma-webapp-js", "dist")));

app.use(urlPrefix + "/lib/date-diff",
  express.static(path.join(__dirname, "node_modules", "@cityssm", "date-diff", "es2015")));

app.use(urlPrefix + "/lib/fa5",
  express.static(path.join(__dirname, "node_modules", "@fortawesome", "fontawesome-free")));


/*
 * SESSION MANAGEMENT
 */


const sessionCookieName = configFunctions.getProperty("session.cookieName");

const FileStoreSession = FileStore(session);


// Initialize session
app.use(session({
  store: new FileStoreSession({
    path: "./data/sessions",
    logFn: debug("contract-expiration-tracker:session"),
    retries: 10
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

// Clear cookie if no corresponding session
app.use((request, response, next) => {

  if (request.cookies[sessionCookieName] && !request.session.user) {
    response.clearCookie(sessionCookieName);
  }

  next();
});

// Redirect logged in users
const sessionChecker = (request: express.Request, response: express.Response, next: express.NextFunction) => {

  if (request.session.user && request.cookies[sessionCookieName]) {
    return next();
  }

  return response.redirect(urlPrefix + "/login");
};


/*
 * ROUTES
 */


// Make config objects available to the templates
app.use(function(request, response, next) {
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

app.use(urlPrefix + "/export", routerExport);

app.use(urlPrefix + "/contracts", sessionChecker, routerContracts);

app.use(urlPrefix + "/admin", sessionChecker, handler_updateOnly, routerAdmin);

app.use(urlPrefix + "/login", routerLogin);

app.get(urlPrefix + "/logout", (request, response) => {

  if (request.session.user && request.cookies[sessionCookieName]) {

    // eslint-disable-next-line unicorn/no-null
    request.session.destroy(null);
    request.session = undefined;
    response.clearCookie(sessionCookieName);
  }

  response.redirect(urlPrefix + "/login");
});


// Catch 404 and forward to error handler
app.use(function(_request, _response, next) {
  next(createError(404));
});


// Error handler
app.use(function(error: Error, request: express.Request, response: express.Response) {

  // Set locals, only providing error in development
  response.locals.message = error.message;
  response.locals.error = request.app.get("env") === "development" ? error : {};

  // Render the error page
  response.status(error.status || 500);
  response.render("error");
});


export default app;
