import type { RequestHandler } from "express";

import { getContractCategoryUsers } from "../helpers/contractDB/getContractCategoryUsers.js";


export const handler: RequestHandler = async (request, response) => {

  const contractCategoryUsers = getContractCategoryUsers(request.body, "userName");

  response.json({
    contractCategoryUsers
  });
};


export default handler;
