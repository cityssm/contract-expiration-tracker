import { addContract } from "../helpers/contractDB/addContract.js";
export const handler = async (request, response) => {
    const contractId = addContract(request.body, request.session);
    response.json({
        success: true,
        contractId
    });
};
export default handler;
