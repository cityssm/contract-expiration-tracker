import { Router } from "express";

import handler_doGetContractCategoryUsers from "../handlers/doGetContractCategoryUsers.js";
import handler_doAddContractCategoryUser from "../handlers/doAddContractCategoryUser.js";
import handler_doRemoveContractCategoryUser from "../handlers/doRemoveContractCategoryUser.js";

import handler_doGetUserNames from "../handlers/doGetUserNames.js";


export const router = Router();


router.post("/doGetContractCategoryUsers", handler_doGetContractCategoryUsers);
router.post("/doAddContractCategoryUser", handler_doAddContractCategoryUser);
router.post("/doRemoveContractCategoryUser", handler_doRemoveContractCategoryUser);

router.post("/doGetUserNames", handler_doGetUserNames);


export default router;
