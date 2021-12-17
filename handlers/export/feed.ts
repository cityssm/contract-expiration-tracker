/* eslint-disable unicorn/filename-case */

import type { RequestHandler } from "express";

import * as exportHelpers from "./exportHelpers.js";
import { getContracts } from "../../helpers/contractDB/getContracts.js";

import { Feed } from "feed";

import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";
import * as configFunctions from "../../helpers/configFunctions.js";

import type { Contract } from "../../types/recordTypes";


const addItem = (feed: Feed, contract: Contract, itemOptions: {
  itemDate: Date;
  itemDateType: "Start" | "End" | "Extension";
  isAdvancedNotification: boolean;
}): boolean => {

  if (itemOptions.itemDate.getTime() > Date.now()) {
    return false;
  }

  feed.addItem({
    title: contract.contractTitle +
      " (" +
      (itemOptions.isAdvancedNotification
        ? "Advanced Notification - "
        : "") +
      itemOptions.itemDateType + ")",
    link: configFunctions.getProperty("application.rootUrl") +
      "#" + contract.contractId.toString() + "/" + itemOptions.itemDateType.toLowerCase() +
      (itemOptions.isAdvancedNotification ? "-notification" : ""),
    date: itemOptions.itemDate,
    description: contract.contractDescription,
    content: exportHelpers.formatContractContent(contract),
    author: [{
      name: contract.contractParty
    }]
  });

  return true;
};




export const handler: RequestHandler = (request, response) => {

  const parameters = exportHelpers.getExportParameters(request);

  const fakeSession = exportHelpers.getExportSession(request);

  const contracts = getContracts(parameters, fakeSession, {
    includeTimeMillis: true
  });

  const rootUrl = configFunctions.getProperty("application.rootUrl");

  const feedUrlSuffix = fakeSession.user.userName + "/" +
    fakeSession.user.guidA + "/" +
    fakeSession.user.guidB +
    "?includeExpired=on";

  const feed = new Feed({
    title: configFunctions.getProperty("customizations.applicationName") + ": " + fakeSession.user.userName,
    id: rootUrl,
    link: rootUrl,
    description: JSON.stringify(parameters),
    favicon: rootUrl + "/favicon.ico",
    copyright: "",
    generator: "https://github.com/cityssm/contract-expiration-tracker",
    feedLinks: {
      atom: rootUrl + "/export/feed/atom/" + feedUrlSuffix,
      json: rootUrl + "/export/feed/json/" + feedUrlSuffix,
      rss2: rootUrl + "/export/feed/rss2/" + feedUrlSuffix
    }
  });

  const notificationDays = configFunctions.getProperty("customizations.notificationDays");

  for (const contract of contracts) {

    // Start Date Notification

    const startNotificationDate = dateTimeFunctions.dateIntegerToDate(contract.startDate);
    startNotificationDate.setDate(startNotificationDate.getDate() - notificationDays);

    if (startNotificationDate.getTime() <= Date.now()) {
      addItem(feed, contract, {
        itemDate: startNotificationDate,
        itemDateType: "Start",
        isAdvancedNotification: true
      });
    }

    // Start Date

    const startDate = dateTimeFunctions.dateIntegerToDate(contract.startDate);

    if (startDate.getTime() <= Date.now()) {
      addItem(feed, contract, {
        itemDate: startDate,
        itemDateType: "Start",
        isAdvancedNotification: false
      });
    }

    if (contract.endDate) {

      // End Date Notification

      const endNotificationDate = dateTimeFunctions.dateIntegerToDate(contract.endDate);
      endNotificationDate.setDate(endNotificationDate.getDate() - notificationDays);

      if (endNotificationDate.getTime() <= Date.now()) {
        addItem(feed, contract, {
          itemDate: endNotificationDate,
          itemDateType: "End",
          isAdvancedNotification: true
        });
      }

      const endDate = dateTimeFunctions.dateIntegerToDate(contract.endDate);

      if (endDate.getTime() <= Date.now()) {
        addItem(feed, contract, {
          itemDate: endDate,
          itemDateType: "End",
          isAdvancedNotification: false
        });
      }
    }

    if (contract.extensionDate) {

      // Extension Date Notification

      const extensionNotificationDate = dateTimeFunctions.dateIntegerToDate(contract.extensionDate);
      extensionNotificationDate.setDate(extensionNotificationDate.getDate() - notificationDays);

      if (extensionNotificationDate.getTime() <= Date.now()) {
        addItem(feed, contract, {
          itemDate: extensionNotificationDate,
          itemDateType: "Extension",
          isAdvancedNotification: true
        });
      }

      const extensionDate = dateTimeFunctions.dateIntegerToDate(contract.extensionDate);

      if (extensionDate.getTime() <= Date.now()) {
        addItem(feed, contract, {
          itemDate: extensionDate,
          itemDateType: "Extension",
          isAdvancedNotification: false
        });
      }
    }
  }

  let contentDisposition = "";
  let contentType = "";
  let content = "";

  switch (request.params.format) {

    case "atom":
      contentDisposition = "inline; filename=contacts-" + Date.now().toString() + ".atom.xml";
      contentType = "application/atom+xml";
      content = feed.atom1();
      break;

    case "json":
      contentDisposition = "inline; filename=contacts-" + Date.now().toString() + ".json";
      contentType = "application/feed+json";
      content = feed.json1();
      break;

    case "rss2":
      contentDisposition = "inline; filename=contacts-" + Date.now().toString() + ".rss.xml";
      contentType = "application/rss+xml";
      content = feed.rss2();
      break;
  }

  response.setHeader("Content-Disposition", contentDisposition);
  response.setHeader("Content-Type", contentType);
  response.send(content);
};


export default handler;
