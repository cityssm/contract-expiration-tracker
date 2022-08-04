import path from "node:path";

import * as configFunctions from "./configFunctions.js";
import * as docuShare from "@cityssm/docushare";

import NodeCache from "node-cache";

import * as docuShareTypes from "@cityssm/docushare/types";

import Debug from "debug";
const debug = Debug("contract-expiration-tracker:docuShareFunctions");

const getContractKeyword = (contractId: number | string) => {
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

const cachedCollectionChildren = new NodeCache({
    stdTTL: 5 * 60
});


export const getCollectionChildren = async (handle: string): Promise<docuShareTypes.DocuShareObject[]> => {

    initialize();

    let collectionChildren = cachedCollectionChildren.get(handle) as docuShareTypes.DocuShareObject[];

    if (!collectionChildren) {
        const result = await docuShare.getChildren(handle);

        if (result.success) {
            collectionChildren = result.dsObjects;
            cachedCollectionChildren.set(handle, collectionChildren);
        }
    }

    return collectionChildren;
};


const getAllContractCollections = async (): Promise<docuShareTypes.DocuShareObject[]> => {
    return await getCollectionChildren(configFunctions.getProperty("docuShare.collectionHandle"));
};


export const getContractCollection = async (contractId: number | string): Promise<docuShareTypes.DocuShareObject> => {

    const contractCollections = await getAllContractCollections();

    const keyword = getContractKeyword(contractId);

    for (const contractCollection of contractCollections) {

        if (contractCollection.keywords === keyword) {
            return contractCollection;
        }
    }

    return undefined;
};


export const createContractCollection = async (contractId: number | string, contractTitle: string): Promise<docuShareTypes.DocuShareObject> => {
    
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

    cachedCollectionChildren.del(configFunctions.getProperty("docuShare.collectionHandle"));

    return docuShareOutput.dsObjects[0];
};


export const updateCollectionTitle = async (collectionHandle: string, newCollectionTitle: string) => {
    
    initialize();

    await docuShare.setTitle(collectionHandle, newCollectionTitle);

    cachedCollectionChildren.del(configFunctions.getProperty("docuShare.collectionHandle"));
};