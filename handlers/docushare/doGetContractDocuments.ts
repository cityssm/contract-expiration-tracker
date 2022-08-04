import type { RequestHandler } from "express";

import * as configFunctions from "../../helpers/configFunctions.js";

import { getContractTitle } from "../../helpers/contractDB/getContractTitle.js";

import * as docuShareFunctions from "../../helpers/docuShareFunctions.js";



export const handler: RequestHandler = async (request, response) => {

  const contractId = request.body.contractId as string;

  const contractTitle = getContractTitle(contractId);

  let contractCollection = await docuShareFunctions.getContractCollection(contractId);
  let documents = [];

  if (contractCollection) {

    if (contractCollection.title !== contractTitle) {
      await docuShareFunctions.updateCollectionTitle(contractCollection.handle, contractTitle);
    }

    documents = await docuShareFunctions.getCollectionChildren(contractCollection.handle);
  } else {
    contractCollection = await docuShareFunctions.createContractCollection(contractId, contractTitle);
  }

  response.json({
    rootURL: configFunctions.getProperty("docuShare.rootURL"),
    handle: contractCollection.handle,
    documents
  });
};


export default handler;
