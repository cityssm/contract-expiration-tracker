import { Router } from "express";
import handler_doGetContractCategoryUsers from "../handlers/doGetContractCategoryUsers.js";
export const router = Router();
router.get("/doGetContactCategoryUsers", handler_doGetContractCategoryUsers);
export default router;
