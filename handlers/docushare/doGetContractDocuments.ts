import type { RequestHandler } from "express";

import { getContractTitle } from "../../helpers/contractDB/getContractTitle.js";

import * as docuShareFunctions from "../../helpers/docuShareFunctions.js";



export const handler: RequestHandler = async (request, response) => {

  const contractId = request.body.contractId;

  const contractTitle = getContractTitle(contractId);

  

  response.json({
    contract
  });
};


export default handler;
