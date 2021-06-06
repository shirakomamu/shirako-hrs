/* eslint-disable no-console */
import { NextFunction, Request, Response } from "express";
import SrkError from "server/src/classes/SrkError";
import SrkResponse from "../classes/SrkResponse";

export default function (
  error: Error | SrkError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (error instanceof SrkError) {
    // if it's a managed error, then return it to user
    console.error("Managed error:", error);
    return new SrkResponse({ error }).send(res);
  } else {
    // if it's an unknown error, throw a generic internal
    console.error("Unmanaged error:", error);
    const srkError = new SrkError("internalError");
    return new SrkResponse({ error: srkError }).send(res);
  }
}
