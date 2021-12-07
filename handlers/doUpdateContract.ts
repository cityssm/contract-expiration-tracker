import type { RequestHandler } from "express";

import { updateContract } from "../helpers/contractDB/updateContract.js";


export const handler: RequestHandler = async (request, response) => {

  const success = updateContract(request.body, request.session);

  response.json({
    success
  });
};


export default handler;
