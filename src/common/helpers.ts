import { NextFunction, Request, Response } from "express";

export const errorMessageHandler = (status: number, message: string | null) => {
  switch (status) {
    case 400:
      return {
        status,
        type: "ValidationError",
        message: {
          en: `Invalid Parameters: ${message}`,
        },
      };
    case 403:
      return {
        status,
        type: "PermissionDeniedError",
        message: {
          en: `Message: ${message}`,
        },
      };
    case 500:
      return {
        status,
        type: "ServerError",
        message: { en: "Internal server error" },
        error: message,
      };
    case 404:
      return {
        status,
        type: "NotFound",
        message: { en: "Not Found" },
        error: message,
      };
    default:
      return {
        status,
        type: "ServerError",
        message: { en: "Internal server error" },
        error: message,
      };
  }
};

export const catchReject = (func: any) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await func(req, res, next);
    if (res.headersSent) {
      return null;
    }
    return next();
  } catch (error: any) {
    console.log(error);
    if (error.code === "23505") {
      return next({ status: 400, message: "Such data already exists!" });
    }
    return next({ status: 500, message: String(error) });
  }
};
