import type { RequestHandler } from "express";

import { resetUserAccessGUIDs } from "../helpers/contractDB/resetUserAccessGUIDs.js";


export const handler: RequestHandler = async (request, response) => {

  const userAccessGUIDs = resetUserAccessGUIDs(request.session.user.userName);

  response.json({
    success: true,
    guidA: userAccessGUIDs.guidA,
    guidB: userAccessGUIDs.guidB
  });
};


export default handler;
