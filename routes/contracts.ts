import { Router, RequestHandler } from "express";


import handler_contracts from "../handlers/contracts.js";
import handler_exportCSV from "../handlers/exportCSV.js";

import handler_doGetContracts from "../handlers/doGetContracts.js";
import handler_doGetContract from "../handlers/doGetContract.js";
import handler_doGetContractCategories from "../handlers/doGetContractCategories.js";

import handler_doAddContract from "../handlers/doAddContract.js";
import handler_doUpdateContract from "../handlers/doUpdateContract.js";
import handler_doRemoveContract from "../handlers/doRemoveContract.js";


const handler_updateOnly: RequestHandler = (request, response, next) => {

  if (request.session.user.canUpdate) {
    return next();
  }

  response.status(403);

  return response.json({
    success: false
  });
};


export const router = Router();


router.get("/", handler_contracts);
router.get("/exportCSV", handler_exportCSV);

router.post("/doGetContracts", handler_doGetContracts);
router.post("/doGetContract", handler_doGetContract);
router.post("/doGetContractCategories", handler_doGetContractCategories);

router.post("/doAddContract", handler_updateOnly, handler_doAddContract);
router.post("/doUpdateContract", handler_updateOnly, handler_doUpdateContract);
router.post("/doRemoveContract", handler_updateOnly, handler_doRemoveContract);


export default router;
