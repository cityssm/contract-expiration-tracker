import { Router } from "express";

import { updateOnly as handler_updateOnly } from "../handlers/permissionHandlers.js";

import handler_contracts from "../handlers/contracts.js";

import handler_doGetContracts from "../handlers/doGetContracts.js";
import handler_doGetContract from "../handlers/doGetContract.js";
import handler_doGetContractCategories from "../handlers/doGetContractCategories.js";

import handler_doAddContract from "../handlers/doAddContract.js";
import handler_doUpdateContract from "../handlers/doUpdateContract.js";
import handler_doRemoveContract from "../handlers/doRemoveContract.js";

import handler_doResetUserAccessGUIDs from "../handlers/doResetUserAccessGUIDs.js";


export const router = Router();


router.get("/", handler_contracts);

router.post("/doGetContracts", handler_doGetContracts);
router.post("/doGetContract", handler_doGetContract);
router.post("/doGetContractCategories", handler_doGetContractCategories);

router.post("/doAddContract", handler_updateOnly, handler_doAddContract);
router.post("/doUpdateContract", handler_updateOnly, handler_doUpdateContract);
router.post("/doRemoveContract", handler_updateOnly, handler_doRemoveContract);

router.post("/doResetUserAccessGUIDs", handler_updateOnly, handler_doResetUserAccessGUIDs);


export default router;
