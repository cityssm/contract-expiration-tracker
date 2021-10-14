import { getContracts } from "../helpers/contractDB/getContracts.js";
export const handler = async (request, response) => {
    const contracts = getContracts(request.body.searchString, request.session);
    response.json({
        contracts
    });
};
export default handler;
