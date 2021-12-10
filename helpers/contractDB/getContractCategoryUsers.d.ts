import type { ContractCategoryUser } from "../../types/recordTypes";
interface GetContractCategoryUsersFilters {
    userName?: string;
    contractCategory?: string;
}
export declare const getContractCategoryUsers: (filters: GetContractCategoryUsersFilters, orderBy?: "userName" | "contractCategory") => ContractCategoryUser[];
export default getContractCategoryUsers;
