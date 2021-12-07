import type { RequestHandler } from "express";

import { removeContract } from "../helpers/contractDB/removeContract.js";


export const handler: RequestHandler = async (request, response) => {

  const success = removeContract(request.body.contractId, request.session);

  response.json({
    success
  });
};


export default handler;
