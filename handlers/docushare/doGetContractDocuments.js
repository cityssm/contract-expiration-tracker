import { getContractTitle } from "../../helpers/contractDB/getContractTitle.js";
export const handler = async (request, response) => {
    const contractId = request.body.contractId;
    const contractTitle = getContractTitle(contractId);
    response.json({
        contract
    });
};
export default handler;
