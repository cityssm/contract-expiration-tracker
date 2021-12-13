import { RequestHandler } from "express";

import { getUserAccessGUIDs } from "../helpers/contractDB/getUserAccessGUIDs.js";


export const updateOnly: RequestHandler = (request, response, next) => {

  if (request.session.user.canUpdate) {
    return next();
  }

  response.status(403);

  return response.json({
    success: false
  });
};


export const guidHandler: RequestHandler =  (request, response, next) => {

  const userName = request.params.userName;
  const guidA = request.params.guidA;
  const guidB = request.params.guidB;

  const userAccessGUIDs = getUserAccessGUIDs(userName);

  if (userAccessGUIDs && userAccessGUIDs.guidA === guidA && userAccessGUIDs.guidB === guidB) {
    return next();
  }

  response.status(403);

  return response.send("Error: Link Not Valid");
};
