import type * as expressSession from "express-session";
interface UpdateContractForm {
    contractId: string;
    contractTitle: string;
    contractCategory: string;
    contractParty: string;
    managingUserName: string;
    contractDescription: string;
    privateContractDescription: string;
    startDateString: string;
    endDateString: string;
    extensionDateString: string;
    hasBeenReplaced?: string;
}
export declare const updateContract: (contractForm: UpdateContractForm, requestSession: expressSession.Session) => boolean;
export {};
