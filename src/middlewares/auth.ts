import { Response, NextFunction } from "express";
import { Decoded } from "./auth.interface";
import jwt, { VerifyErrors } from "jsonwebtoken";

import CONFIG from "../config/index";

export default function authMiddlware(req: any, res: Response, next: NextFunction) {
  const authorizationHeader = req.headers["authorization"];
  if (authorizationHeader) {
    const token = authorizationHeader.split(" ")[1];

    return jwt.verify(token, CONFIG.APP.SECRET, async (err: VerifyErrors | null, decoded: Decoded | any) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).send({
            status: 401,
            type: "TokenExpiredError",
            message: {
              en: "Your token is expired",
            },
          });
        } else if (err.name === "JsonWebTokenError") {
          return res.status(401).send({
            status: 401,
            type: "JsonWebTokenError",
            message: {
              en: "Invalid access token",
            },
          });
        } else if (err.name === "NotBeforeError") {
          return res.status(401).send({
            status: 401,
            type: "JsonWebTokenError",
            message: {
              en: err.message,
            },
          });
        }
        return res.status(401).send({
          status: 401,
          type: "AuthenticationError",
          message: {
            en: "You are unauthorized, try refreshing the page.",
          },
        });
      }
      req.user = decoded;
      return next();
    });
  }
  return res.status(401).send({
    status: 401,
    type: "AuthenticationError",
    message: {
      en: "You are unauthorized, try refreshing the page.",
    },
  });
}
