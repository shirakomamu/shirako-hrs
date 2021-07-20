import { Request, Response } from "express";
import SrkResponse from "server/classes/SrkResponse";
import { SrkCookie } from "./jwt.types";

export interface SrkExpressRequest extends Request {
  locals: {
    authResult: SrkCookie;
  };
}

export interface SrkExpressResponse<T = any> extends Response {
  locals: {
    controllerResult: SrkResponse<T>;
  };
}
