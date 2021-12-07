import type * as expressSession from "express-session";
interface UpdateContractForm {
    contractId: string;
    contractTitle: string;
    contractCategory: string;
    contractParty: string;
    contractDescription: string;
    startDateString: string;
    endDateString: string;
    extensionDateString: string;
}
export declare const updateContract: (contractForm: UpdateContractForm, requestSession: expressSession.Session) => boolean;
export {};
