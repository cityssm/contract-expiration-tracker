import { updateContract } from "../helpers/contractDB/updateContract.js";
export const handler = async (request, response) => {
    const success = updateContract(request.body, request.session);
    response.json({
        success
    });
};
export default handler;
