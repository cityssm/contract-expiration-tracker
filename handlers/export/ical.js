import ical from "ical-generator";
import { getContracts } from "../../helpers/contractDB/getContracts.js";
import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";
const addEventDetails = (icalEvent, contract) => {
    icalEvent.allDay(true);
    icalEvent.description((contract.contractDescription && contract.contractDescription !== ""
        ? contract.contractDescription + "\n\n"
        : "") +
        "Start Date: " + contract.startDateString +
        (contract.endDate ? "\nEnd Date: " + contract.endDateString : "") +
        (contract.extensionDate ? "\nExtension Date: " + contract.extensionDateString : ""));
    if (contract.contractParty && contract.contractParty !== "") {
        icalEvent.location(contract.contractParty);
    }
    icalEvent.created(new Date(contract.recordCreate_timeMillis));
    icalEvent.lastModified(new Date(contract.recordUpdate_timeMillis));
    icalEvent.createAlarm({
        type: "display",
        trigger: 2 * 30 * 86400
    });
    if (contract.contractCategory) {
        icalEvent.createCategory({
            name: contract.contractCategory
        });
    }
    return icalEvent;
};
export const handler = (request, response) => {
    const parameters = {
        contractCategory: request.query.contractCategory,
        searchString: request.query.searchString,
        includeExpired: request.query.includeExpired
    };
    const fakeSession = {
        user: {
            userName: request.params.userName,
            canUpdate: false,
            guidA: request.params.guidA,
            guidB: request.params.guibB
        }
    };
    const contracts = getContracts(parameters, fakeSession);
    const calendar = ical({
        name: "Contract Expiration Tracker: " + request.params.userName
    });
    for (const contract of contracts) {
        const startEvent = calendar.createEvent({
            summary: contract.contractTitle + " (Start)",
            start: dateTimeFunctions.dateIntegerToDate(contract.startDate)
        });
        startEvent.uid(contract.contractId + "-start");
        addEventDetails(startEvent, contract);
        if (contract.endDate) {
            const endEvent = calendar.createEvent({
                summary: contract.contractTitle + " (End)",
                start: dateTimeFunctions.dateIntegerToDate(contract.endDate)
            });
            endEvent.uid(contract.contractId + "-end");
            addEventDetails(endEvent, contract);
        }
    }
    response.setHeader("Content-Disposition", "attachment; filename=contracts-" + Date.now().toString() + ".ical");
    response.setHeader("Content-Type", "text/calendar");
    response.send(calendar.toString());
};
export default handler;
