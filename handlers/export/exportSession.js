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
