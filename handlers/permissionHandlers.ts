import { RequestHandler } from "express";


export const updateOnly: RequestHandler = (request, response, next) => {

  if (request.session.user.canUpdate) {
    return next();
  }

  response.status(403);

  return response.json({
    success: false
  });
};
