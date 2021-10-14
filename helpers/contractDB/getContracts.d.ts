import type { Contract } from "../../types/recordTypes";
import type * as expressSession from "express-session";
export declare const getContracts: (searchString: string, requestSession: expressSession.Session) => Contract[];
export default getContracts;
