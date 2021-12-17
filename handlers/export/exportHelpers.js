import * as configFunctions from "../../helpers/configFunctions.js";
export const getExportSession = (request) => {
    return {
        user: {
            userName: request.params.userName,
            canUpdate: configFunctions.getProperty("permissions.canUpdate").includes(request.params.userName),
            guidA: request.params.guidA,
            guidB: request.params.guidB
        }
    };
};
export const getExportParameters = (request) => {
    return {
        contractCategory: request.query.contractCategory,
        searchString: request.query.searchString,
        includeExpired: request.query.includeExpired,
        managingUserName: request.query.managingUserName
    };
};
export const formatContractContent = (contract) => {
    return (contract.contractDescription && contract.contractDescription !== ""
        ? contract.contractDescription + "\n\n"
        : "") +
        "Start Date: " + contract.startDateString +
        (contract.endDate ? "\nEnd Date: " + contract.endDateString : "") +
        (contract.extensionDate ? "\nExtension Date: " + contract.extensionDateString : "");
};
