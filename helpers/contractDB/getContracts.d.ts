import type { Contract } from "../../types/recordTypes";
import type * as expressSession from "express-session";
interface GetContractsFilters {
    searchString: string;
    includeExpired: boolean;
}
export declare const getContracts: (filters: GetContractsFilters, requestSession: expressSession.Session) => Contract[];
export default getContracts;
