import type { RequestHandler } from "express";

import { addContract } from "../helpers/contractDB/addContract.js";


export const handler: RequestHandler = async (request, response) => {

  const contractId = addContract(request.body, request.session);

  response.json({
    success: true,
    contractId
  });
};


export default handler;
