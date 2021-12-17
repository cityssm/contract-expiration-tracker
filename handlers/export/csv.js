import { getExportSession, getExportParameters } from "./exportHelpers.js";
import { getContracts } from "../../helpers/contractDB/getContracts.js";
import * as configFunctions from "../../helpers/configFunctions.js";
import camelCase from "camelcase";
import Papa from "papaparse";
export const handler = (request, response) => {
    const parameters = getExportParameters(request);
    const fakeSession = getExportSession(request);
    const contracts = getContracts(parameters, fakeSession, {
        includeTimeMillis: true
    });
    const csvContracts = [];
    const contractAliasCamel = camelCase(configFunctions.getProperty("customizations.contract.alias"));
    const fieldName_contractId = contractAliasCamel + "Id";
    const fieldName_contractTitle = contractAliasCamel + "Title";
    const fieldName_contractCategory = camelCase(configFunctions.getProperty("customizations.contractCategory.alias"));
    const fieldName_contractParty = camelCase(configFunctions.getProperty("customizations.contractParty.alias"));
    for (const contract of contracts) {
        const csvContract = {};
        csvContract[fieldName_contractId] = contract.contractId;
        csvContract[fieldName_contractTitle] = contract.contractTitle;
        csvContract[fieldName_contractCategory] = contract.contractCategory;
        csvContract[fieldName_contractParty] = contract.contractParty;
        csvContract.startDate = contract.startDate;
        csvContract.startDateString = contract.startDateString;
        csvContract.endDate = contract.endDate;
        csvContract.endDateString = contract.endDateString;
        csvContract.extensionDate = contract.extensionDate;
        csvContract.extensionDateString = contract.extensionDateString;
        csvContract.managingUserName = contract.managingUserName;
        csvContract.recordCreate_timeMillis = contract.recordCreate_timeMillis;
        csvContract.recordUpdate_timeMillis = contract.recordUpdate_timeMillis;
        csvContracts.push(csvContract);
    }
    const csv = Papa.unparse(csvContracts);
    response.setHeader("Content-Disposition", "inline; filename=contracts-" + Date.now().toString() + ".csv");
    response.setHeader("Content-Type", "text/csv");
    response.send(csv);
};
export default handler;
