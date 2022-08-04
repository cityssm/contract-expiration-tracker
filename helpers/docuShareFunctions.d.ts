import * as docuShareTypes from "@cityssm/docushare/types";
export declare const getCollectionChildren: (handle: string) => Promise<docuShareTypes.DocuShareObject[]>;
export declare const getContractCollection: (contractId: number | string) => Promise<docuShareTypes.DocuShareObject>;
export declare const createContractCollection: (contractId: number | string, contractTitle: string) => Promise<docuShareTypes.DocuShareObject>;
export declare const updateCollectionTitle: (collectionHandle: string, newCollectionTitle: string) => Promise<void>;
