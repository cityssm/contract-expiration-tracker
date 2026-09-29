import path from 'node:path';
import NodeCache from '@cacheable/node-cache';
import { DocuShareAPI } from '@cityssm/docushare';
import * as configFunctions from './configFunctions.js';
function getContractKeyword(contractId) {
    return `contractId:${contractId}`;
}
const javaPath = path.join('java', 'dsapi.jar');
const docuShare = new DocuShareAPI({
    java: {
        dsapiPath: [javaPath]
    },
    server: configFunctions.getProperty('docuShare.server'),
    session: configFunctions.getProperty('docuShare.session')
});
const cachedCollectionChildren = new NodeCache({
    stdTTL: 5 * 60
});
export async function getCollectionChildren(handle) {
    let collectionChildren = cachedCollectionChildren.get(handle);
    if (collectionChildren === undefined) {
        const result = await docuShare.getChildren(handle);
        if (result.success) {
            collectionChildren = result.dsObjects;
            cachedCollectionChildren.set(handle, collectionChildren);
        }
    }
    return collectionChildren;
}
async function getAllContractCollections() {
    return await getCollectionChildren(configFunctions.getProperty('docuShare.collectionHandle'));
}
export async function getContractCollection(contractId) {
    const contractCollections = await getAllContractCollections();
    const keyword = getContractKeyword(contractId);
    for (const contractCollection of contractCollections ?? []) {
        if (contractCollection.keywords === keyword) {
            return contractCollection;
        }
    }
    return undefined;
}
export async function createContractCollection(contractId, contractTitle) {
    let docuShareOutput = await docuShare.createCollection(configFunctions.getProperty('docuShare.collectionHandle'), contractTitle);
    if (!docuShareOutput.success) {
        return undefined;
    }
    const newCollectionHandle = docuShareOutput.dsObjects[0].handle;
    docuShareOutput = await docuShare.setKeywords(newCollectionHandle, getContractKeyword(contractId));
    if (!docuShareOutput.success) {
        return undefined;
    }
    cachedCollectionChildren.del(configFunctions.getProperty('docuShare.collectionHandle'));
    return docuShareOutput.dsObjects[0];
}
export async function updateCollectionTitle(collectionHandle, newCollectionTitle) {
    await docuShare.setTitle(collectionHandle, newCollectionTitle);
    cachedCollectionChildren.del(configFunctions.getProperty('docuShare.collectionHandle'));
}
