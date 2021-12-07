import { Router } from "express";
import handler_contracts from "../handlers/contracts.js";
import handler_doGetContracts from "../handlers/doGetContracts.js";
import handler_doGetContract from "../handlers/doGetContract.js";
import handler_doGetContractCategories from "../handlers/doGetContractCategories.js";
import handler_doAddContract from "../handlers/doAddContract.js";
import handler_doUpdateContract from "../handlers/doUpdateContract.js";
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
router.post("/doGetContract", handler_doGetContract);
router.post("/doGetContractCategories", handler_doGetContractCategories);
router.post("/doAddContract", handler_updateOnly, handler_doAddContract);
router.post("/doUpdateContract", handler_updateOnly, handler_doUpdateContract);
export default router;
