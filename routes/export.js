import express from "express";
import { guidHandler } from "../handlers/permissionHandlers.js";
import handler_exportCSV from "../handlers/export/csv.js";
import handler_exportICAL from "../handlers/export/ical.js";
export const router = express.Router();
router.get("/csv/:userName/:guidA/:guidB", guidHandler, handler_exportCSV);
router.get("/ical/:userName/:guidA/:guidB", guidHandler, handler_exportICAL);
export default router;
