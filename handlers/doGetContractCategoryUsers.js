import { getContractCategoryUsers } from "../helpers/contractDB/getContractCategoryUsers.js";
export const handler = async (request, response) => {
    const contractCategoryUsers = getContractCategoryUsers(request.body, "userName");
    response.json({
        contractCategoryUsers
    });
};
export default handler;
