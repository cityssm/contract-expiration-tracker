import type { Contract, SessionWithUser } from "../../types/recordTypes";
interface GetContractsFilters {
    contractCategory: string;
    searchString: string;
    includeExpired?: string;
}
interface GetContractsOptions {
    includeContractDescription?: boolean;
    includePrivateContractDescription?: boolean;
    includeTimeMillis?: boolean;
}
export declare const getContracts: (filters: GetContractsFilters, requestSession: SessionWithUser, options?: GetContractsOptions) => Contract[];
export default getContracts;
