import type * as docuShareTypes from "@cityssm/docushare/types";
export declare const getContractCollection: (contractId: number) => Promise<docuShareTypes.DocuShareObject>;
export declare const updateCollectionTitle: (collectionHandle: string, newCollectionTitle: string) => void;
