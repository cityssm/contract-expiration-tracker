import type * as expressSession from "express-session";
interface AddContractForm {
    contractTitle: string;
    contractCategoryIsNew: "0" | "1";
    "contractCategory-existing": string;
    "contractCategory-new": string;
    contractParty: string;
    managingUserName: string;
    contractDescription: string;
    privateContractDescription: string;
    startDateString: string;
    endDateString: string;
    extensionDateString: string;
    hasBeenReplaced?: string;
}
export declare const addContract: (contractForm: AddContractForm, requestSession: expressSession.Session) => number;
export {};
