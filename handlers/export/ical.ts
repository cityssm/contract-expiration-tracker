/* eslint-disable unicorn/filename-case */

import type { RequestHandler } from "express";

import ical from "ical-generator";

import { getContracts } from "../../helpers/contractDB/getContracts.js";

import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";

import type { ICalEvent } from "ical-generator";
import type { Contract } from "../../types/recordTypes";


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
    type: "display",
    trigger: 2 * 30 * 86_400
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

  const fakeSession = {
    user: {
      userName: request.params.userName,
      canUpdate: false,
      guidA: request.params.guidA,
      guidB: request.params.guibB
    }
  }

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
  }

  response.setHeader("Content-Disposition",
    "attachment; filename=contracts-" + Date.now().toString() + ".ical");

  response.setHeader("Content-Type", "text/calendar");

  response.send(calendar.toString());
};


export default handler;
