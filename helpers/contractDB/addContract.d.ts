import type * as expressSession from "express-session";
interface AddContractForm {
    contractTitle: string;
    contractCategoryIsNew: "0" | "1";
    "contractCategory-existing": string;
    "contractCategory-new": string;
    contractParty: string;
    contractDescription: string;
    startDateString: string;
    endDateString: string;
    extensionDateString: string;
}
export declare const addContract: (contractForm: AddContractForm, requestSession: expressSession.Session) => number;
export {};
