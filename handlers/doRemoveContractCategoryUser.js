import { removeContractCategoryUser } from "../helpers/contractDB/removeContractCategoryUser.js";
export const handler = async (request, response) => {
    const success = removeContractCategoryUser(request.body.userName, request.body.contractCategory);
    response.json({
        success
    });
};
export default handler;
