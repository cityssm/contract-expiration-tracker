import type { Contract } from "../../types/recordTypes";
import type * as expressSession from "express-session";
export declare const getContract: (contractId: number | string, requestSession: expressSession.Session) => Contract;
export default getContract;
