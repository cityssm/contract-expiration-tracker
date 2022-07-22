import path from "path";

import * as configFunctions from "./helpers/configFunctions.js";

import type { ServiceConfig } from "node-windows";


const __dirname = ".";

export const serviceConfig: ServiceConfig = {
  name: configFunctions.getProperty("customizations.applicationName"),
  description: "A tool to track expirations of procurement projects and/or contracts.",
  script: path.join(__dirname, "bin", "www.js")
};
