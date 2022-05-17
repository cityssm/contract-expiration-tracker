import type { Contract, SessionWithUser } from "../../types/recordTypes";
export interface GetContractsFilters {
    contractCategory: string;
    searchString: string;
    includeExpired?: string;
    managingUserName?: string;
    hasBeenReplaced?: "" | "1" | "0";
}
interface GetContractsOptions {
    includeContractDescription?: boolean;
    includePrivateContractDescription?: boolean;
    includeTimeMillis?: boolean;
}
export declare const getContracts: (filters: GetContractsFilters, requestSession: SessionWithUser, options?: GetContractsOptions) => Contract[];
export default getContracts;
