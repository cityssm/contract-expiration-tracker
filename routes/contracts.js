import { Router } from "express";
import handler_contracts from "../handlers/contracts.js";
import handler_doGetContracts from "../handlers/doGetContracts.js";
const handler_updateOnly = (request, response, next) => {
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
router.post("/doGetContracts", handler_doGetContracts);
export default router;
