import type { RequestHandler } from "express";

import { getContract } from "../helpers/contractDB/getContract.js";


export const handler: RequestHandler = async (request, response) => {

  const contract = getContract(request.body.contractId, request.session);

  response.json(
    contract
  );
};


export default handler;
