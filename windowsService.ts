import * as path from "path";
import type { ServiceConfig } from "node-windows";


const __dirname = ".";

export const serviceConfig: ServiceConfig = {
  name: "Contract Expiration Tracker",
  description: "A tool to track expirations of procurement projects and/or contracts.",
  script: path.join(__dirname, "bin", "www.js")
};
