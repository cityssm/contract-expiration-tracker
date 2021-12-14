/* eslint-disable unicorn/filename-case */

import type { RequestHandler } from "express";

import ical from "ical-generator";
import { ICalAlarmType } from "ical-generator/dist/alarm.js";

import { getExportSession } from "./exportSession.js";
import { getContracts } from "../../helpers/contractDB/getContracts.js";

import * as configFunctions from "../../helpers/configFunctions.js";
import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";

import type { Contract } from "../../types/recordTypes";

import type { ICalEvent } from "ical-generator";


const addEventDetails = (icalEvent: ICalEvent, contract: Contract) => {

  icalEvent.allDay(true);

  icalEvent.description(
    (contract.contractDescription && contract.contractDescription !== ""
      ? contract.contractDescription + "\n\n"
      : ""
    ) +
    "Start Date: " + contract.startDateString +
    (contract.endDate ? "\nEnd Date: " + contract.endDateString : "") +
    (contract.extensionDate ? "\nExtension Date: " + contract.extensionDateString : "")
  );

  if (contract.contractParty && contract.contractParty !== "") {
    icalEvent.location(contract.contractParty);
  }

  icalEvent.created(new Date(contract.recordCreate_timeMillis));
  icalEvent.lastModified(new Date(contract.recordUpdate_timeMillis));

  icalEvent.createAlarm({
    type: ICalAlarmType.display,
    trigger: configFunctions.getProperty("customizations.notificationDays") * 86_400
  })

  if (contract.contractCategory) {
    icalEvent.createCategory({
      name: contract.contractCategory
    });
  }

  return icalEvent;
};


export const handler: RequestHandler = (request, response) => {

  const parameters = {
    contractCategory: request.query.contractCategory as string,
    searchString: request.query.searchString as string,
    includeExpired: request.query.includeExpired as string
  };

  const fakeSession = getExportSession(request);

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

    // Build end date

    if (contract.endDate) {

      const endEvent = calendar.createEvent({
        summary: contract.contractTitle + " (End)",
        start: dateTimeFunctions.dateIntegerToDate(contract.endDate)
      });

      endEvent.uid(contract.contractId + "-end");

      addEventDetails(endEvent, contract);
    }

    // Build extension date

    if (contract.extensionDate) {

      const extensionEvent = calendar.createEvent({
        summary: contract.contractTitle + " (Extension)",
        start: dateTimeFunctions.dateIntegerToDate(contract.extensionDate)
      });

      extensionEvent.uid(contract.contractId + "-extension");

      addEventDetails(extensionEvent, contract);
    }
  }

  response.setHeader("Content-Disposition",
    "attachment; filename=contracts-" + Date.now().toString() + ".ical");

  response.setHeader("Content-Type", "text/calendar");

  response.send(calendar.toString());
};


export default handler;
