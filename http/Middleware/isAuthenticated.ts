import logger from "@Infrastructure/Utils/logger";
import { AuthorizationToken, RequestWithUser } from "@interfaces/index";
import UserModel from "@Infrastructure/Persistance/models/users";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import SessionService from "@Services/SessionService";

const isAuthenticated: RequestHandler = async (req: RequestWithUser, res, next) => {
  try {
    const authorizationToken = req.signedCookies["Authorization"];
    if (!authorizationToken) throw new Error("Token missing");

    const { uid } = await new SessionService().fetch(authorizationToken);

    const user = await UserModel.findById(uid);
    req.user = user;

    next();
  } catch (error) {
    logger.info(error.message);

    let redirectUrl = `http://localhost:${process.env.PORT}/login?redirectUrl=${req.protocol}://${req.headers.host}${req.originalUrl}`;

    res.redirect(redirectUrl);
  }
};

export default isAuthenticated;
