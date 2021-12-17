import express from "express";

import { guidHandler } from "../handlers/permissionHandlers.js";

import handler_exportCSV from "../handlers/export/csv.js";
import handler_exportICAL from "../handlers/export/ical.js";
import handler_exportFeed from "../handlers/export/feed.js";


export const router = express.Router();


router.get("/csv/:userName/:guidA/:guidB", guidHandler, handler_exportCSV);

router.get("/ical/:userName/:guidA/:guidB", guidHandler, handler_exportICAL);

router.get("/feed/:format/:userName/:guidA/:guidB", guidHandler, handler_exportFeed);


export default router;
