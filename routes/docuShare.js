import express from "express";
import handler_doGetContractDocuments from "../handlers/docushare/doGetContractDocuments.js";
export const router = express.Router();
router.post("/doGetContractDocuments", handler_doGetContractDocuments);
export default router;
