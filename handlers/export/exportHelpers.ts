import * as configFunctions from "../../helpers/configFunctions.js";

import type { Request } from "express";
import type { Contract, SessionWithUser } from "../../types/recordTypes";

import type { GetContractsFilters } from "../../helpers/contractDB/getContracts";


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


export const getExportParameters = (request: Request): GetContractsFilters => {

  return {
    contractCategory: request.query.contractCategory as string,
    searchString: request.query.searchString as string,
    includeExpired: request.query.includeExpired as string,
    managingUserName: request.query.managingUserName as string,
    hasBeenReplaced: request.query.hasBeenReplaced as "" | "0" | "1"
  };
};


export const formatContractContent = (contract: Contract): string => {

  return (contract.contractDescription && contract.contractDescription !== ""
    ? contract.contractDescription + "\n\n"
    : ""
  ) +
    "Start Date: " + contract.startDateString +
    (contract.endDate ? "\nEnd Date: " + contract.endDateString : "") +
    (contract.extensionDate ? "\nExtension Date: " + contract.extensionDateString : "");
};
