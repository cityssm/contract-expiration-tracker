import * as path from "path";
const __dirname = ".";
export const serviceConfig = {
    name: "Contract Expiration Tracker",
    description: "A tool to track expirations of procurement projects and/or contracts.",
    script: path.join(__dirname, "bin", "www.js")
};
