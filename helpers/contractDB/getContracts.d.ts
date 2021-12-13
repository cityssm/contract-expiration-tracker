import type { Contract, SessionWithUser } from "../../types/recordTypes";
interface GetContractsFilters {
    contractCategory: string;
    searchString: string;
    includeExpired?: string;
}
export declare const getContracts: (filters: GetContractsFilters, requestSession: SessionWithUser) => Contract[];
export default getContracts;
