import { getContractCategories } from "../helpers/contractDB/getContractCategories.js";
export const handler = async (request, response) => {
    const contractCategories = getContractCategories(request.session);
    response.json({
        contractCategories
    });
};
export default handler;
