import Papa from "papaparse";
import { getContracts } from "../helpers/contractDB/getContracts.js";
export const handler = async (request, response) => {
    const parameters = {
        contractCategory: request.query.contractCategory,
        searchString: request.query.searchString,
        includeExpired: request.query.includeExpired
    };
    const contracts = getContracts(parameters, request.session);
    const csv = Papa.unparse(contracts);
    response.setHeader("Content-Disposition", "attachment; filename=contracts-" + Date.now().toString() + ".csv");
    response.setHeader("Content-Type", "text/csv");
    response.send(csv);
};
export default handler;
