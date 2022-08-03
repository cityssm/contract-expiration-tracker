import path from "node:path";
import * as configFunctions from "./configFunctions.js";
import * as docuShare from "@cityssm/docushare";
import Debug from "debug";
const debug = Debug("contract-expiration-tracker:docuShareFunctions");
let isInitialized = false;
const initialize = () => {
    if (!isInitialized) {
        const javaPath = path.join("java", "dsapi.jar");
        debug("DocuShare dsapi.js path: " + javaPath);
        docuShare.setupJava({
            dsapiPath: [javaPath]
        });
        docuShare.setupServer(configFunctions.getProperty("docuShare.server"));
        docuShare.setupSession(configFunctions.getProperty("docuShare.session"));
        isInitialized = true;
    }
};
let cachedContractCollections;
let cachedContractCollections_expiryMillis = 0;
const cachedContractCollections_cacheMillis = 5 * 60 * 1000;
const getAllContractCollections = async () => {
    initialize();
    if (cachedContractCollections_expiryMillis < Date.now()) {
        const docuShareOutput = await docuShare.getChildren(configFunctions.getProperty("docuShare.collectionHandle"));
        if (!docuShareOutput.success) {
            debug(docuShareOutput.error);
        }
        cachedContractCollections = docuShareOutput.success ? docuShareOutput.dsObjects : [];
        cachedContractCollections_expiryMillis = Date.now() + cachedContractCollections_cacheMillis;
    }
    return cachedContractCollections;
};
export const getContractCollection = async (contractId) => {
    const contractCollections = await getAllContractCollections();
    for (const contractCollection of contractCollections) {
        if (contractCollection.keywords === "contractId:" + contractId) {
            return contractCollection;
        }
    }
    return undefined;
};
export const updateCollectionTitle = (collectionHandle, newCollectionTitle) => {
    initialize();
};
