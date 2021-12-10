import { addContractCategoryUser } from "../helpers/contractDB/addContractCategoryUser.js";
export const handler = async (request, response) => {
    const success = addContractCategoryUser(request.body.userName, request.body.contractCategory);
    response.json({
        success
    });
};
export default handler;
