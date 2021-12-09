import type { RequestHandler } from "express";

import { getContractCategories } from "../helpers/contractDB/getContractCategories.js";


export const handler: RequestHandler = async (request, response) => {

  const contractCategories = getContractCategories(request.session);

  response.render("contracts", {
    contractCategories
  });
};


export default handler;
