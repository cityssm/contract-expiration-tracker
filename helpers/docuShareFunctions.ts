import path from "node:path";

import * as configFunctions from "./configFunctions.js";
import * as docuShare from "@cityssm/docushare";

import type * as docuShareTypes from "@cityssm/docushare/types";

import Debug from "debug";
const debug = Debug("contract-expiration-tracker:docuShareFunctions");

const getContractKeyword = (contractId: number) => {
    return "contractId:" + contractId;
};

/*
 * Initialize
 */

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

/*
 * Caching
 */

let cachedContractCollections: docuShareTypes.DocuShareObject[];
let cachedContractCollections_expiryMillis = 0;
const cachedContractCollections_cacheMillis = 5 * 60 * 1000;

const getAllContractCollections = async (): Promise<docuShareTypes.DocuShareObject[]> => {

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


export const getContractCollection = async (contractId: number): Promise<docuShareTypes.DocuShareObject> => {

    const contractCollections = await getAllContractCollections();

    const keyword = getContractKeyword(contractId);

    for (const contractCollection of contractCollections) {

        if (contractCollection.keywords === keyword) {
            return contractCollection;
        }
    }

    return undefined;
};


export const createContractCollection = async (contractId: number, contractTitle: string): Promise<docuShareTypes.DocuShareObject> => {
    
    initialize();

    let docuShareOutput = await docuShare.createCollection(configFunctions.getProperty("docuShare.collectionHandle"), contractTitle);

    if (!docuShareOutput.success) {
        return;
    }

    const newCollectionHandle = docuShareOutput.dsObjects[0].handle;

    docuShareOutput = await docuShare.setKeywords(newCollectionHandle, getContractKeyword(contractId));

    if (!docuShareOutput.success) {
        return;
    }

    cachedContractCollections.push(docuShareOutput.dsObjects[0]);

    return docuShareOutput.dsObjects[0];
};


export const updateCollectionTitle = async (collectionHandle: string, newCollectionTitle: string) => {
    initialize();

    await docuShare.setTitle(collectionHandle, newCollectionTitle);

    cachedContractCollections_expiryMillis = 0;
};