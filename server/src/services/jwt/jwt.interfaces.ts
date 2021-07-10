import { Request, Response } from "express";
import SrkResponse from "server/classes/SrkResponse";
import { SrkCookie } from "./jwt.types";

export type SrkExpressRequest = Request & {
  locals: {
    authResult: SrkCookie;
  };
};

export type SrkExpressResponse = Response & {
  locals: {};
};

export type WithSrkExpressResponse<T = any> = SrkExpressResponse & {
  locals: {
    controllerResult: SrkResponse<T>;
  };
};
