/* eslint-disable unicorn/filename-case */

import type { RequestHandler } from "express";

import ical, { ICalEvent, ICalEventStatus, ICalEventTransparency, ICalAlarmType } from "ical-generator";

import { getExportSession, getExportParameters, formatContractContent } from "./exportHelpers.js";
import { getContracts } from "../../helpers/contractDB/getContracts.js";

import * as configFunctions from "../../helpers/configFunctions.js";
import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";

import type { Contract } from "../../types/recordTypes";


const addEventDetails = (icalEvent: ICalEvent, contract: Contract) => {

  icalEvent.allDay(true);

  if (contract.contractCategory) {
    icalEvent.createCategory({
      name: contract.contractCategory
    });
  }

  icalEvent.transparency(ICalEventTransparency.TRANSPARENT);

  icalEvent.description(formatContractContent(contract));

  if (contract.contractParty && contract.contractParty !== "") {
    icalEvent.location(contract.contractParty);
  }

  icalEvent.stamp(new Date(contract.recordCreate_timeMillis));
  icalEvent.created(new Date(contract.recordCreate_timeMillis));
  icalEvent.lastModified(new Date(contract.recordUpdate_timeMillis));

  icalEvent.createAlarm({
    type: ICalAlarmType.display,
    trigger: configFunctions.getProperty("customizations.notificationDays") * 86_400
  })

  return icalEvent;
};


export const handler: RequestHandler = (request, response) => {

  const parameters = getExportParameters(request);

  const fakeSession = getExportSession(request);

  const contracts = getContracts(parameters, fakeSession, {
    includeContractDescription: true,
    includeTimeMillis: true
  });

  const calendar = ical({
    name: configFunctions.getProperty("customizations.applicationName") + ": " + request.params.userName,
    description: JSON.stringify(parameters),
    prodId: {
      company: "The Corporation of the City of Sault Ste. Marie",
      product: "Contract Expiration Tracker",
      language: "EN"
    }
  });

  for (const contract of contracts) {

    const startEvent = calendar.createEvent({
      summary: contract.contractTitle + " (Start)",
      start: dateTimeFunctions.dateIntegerToDate(contract.startDate)
    });

    startEvent.uid(contract.contractId + "-start");

    startEvent.status(ICalEventStatus.CONFIRMED);

    startEvent.createCategory({
      name: "Contract Start Date"
    });


    addEventDetails(startEvent, contract);

    // Build end date

    if (contract.endDate) {

      const endEvent = calendar.createEvent({
        summary: contract.contractTitle + " (End)",
        start: dateTimeFunctions.dateIntegerToDate(contract.endDate)
      });

      endEvent.uid(contract.contractId + "-end");

      endEvent.status(contract.extensionDate
        ? ICalEventStatus.TENTATIVE
        : ICalEventStatus.CONFIRMED);

      endEvent.createCategory({
        name: "Contract End Date"
      });

      addEventDetails(endEvent, contract);
    }

    // Build extension date

    if (contract.extensionDate) {

      const extensionEvent = calendar.createEvent({
        summary: contract.contractTitle + " (Extension)",
        start: dateTimeFunctions.dateIntegerToDate(contract.extensionDate)
      });

      extensionEvent.uid(contract.contractId + "-extension");

      extensionEvent.status(ICalEventStatus.TENTATIVE);

      extensionEvent.createCategory({
        name: "Contract Extension Date"
      });

      addEventDetails(extensionEvent, contract);
    }
  }

  response.setHeader("Content-Disposition",
    "inline; filename=contracts-" + Date.now().toString() + ".ical");

  response.setHeader("Content-Type", "text/calendar");

  response.send(calendar.toString());
};


export default handler;
