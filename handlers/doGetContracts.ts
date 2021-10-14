import type { RequestHandler } from "express";

import { getContracts } from "../helpers/contractDB/getContracts.js";


export const handler: RequestHandler = async (request, response) => {

  const contracts = getContracts(request.body.searchString, request.session);

  response.json({
    contracts
  });
};


export default handler;
