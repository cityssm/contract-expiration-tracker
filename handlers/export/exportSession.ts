import * as configFunctions from "../../helpers/configFunctions.js";

import type { Request } from "express";
import type { SessionWithUser } from "../../types/recordTypes";


export const getExportSession = (request: Request): SessionWithUser => {

  return {
    user: {
      userName: request.params.userName,
      canUpdate: configFunctions.getProperty("permissions.canUpdate").includes(request.params.userName),
      guidA: request.params.guidA,
      guidB: request.params.guidB
    }
  };
};
