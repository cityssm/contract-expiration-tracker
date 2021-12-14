/* eslint-disable unicorn/filename-case */

import type { RequestHandler } from "express";

import { getExportSession } from "./exportSession.js";
import { getContracts } from "../../helpers/contractDB/getContracts.js";

import Papa from "papaparse";


export const handler: RequestHandler = async (request, response) => {

  const parameters = {
    contractCategory: request.query.contractCategory as string,
    searchString: request.query.searchString as string,
    includeExpired: request.query.includeExpired as string
  };

  const fakeSession = getExportSession(request);

  const contracts = getContracts(parameters, fakeSession, {
    includeTimeMillis: true
  });

  const csv = Papa.unparse(contracts);

  response.setHeader("Content-Disposition",
    "attachment; filename=contracts-" + Date.now().toString() + ".csv");

  response.setHeader("Content-Type", "text/csv");

  response.send(csv);
};


export default handler;
