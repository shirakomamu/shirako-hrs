import { Response } from "express";
import SrkResponse from "src/classes/SrkResponse";
import { SrkCookie } from "./jwt.types";

export type SrkExpressResponse = Response & {
  locals: {
    authResult: SrkCookie;
  };
};

export type WithSrkExpressResponse<T = any> = SrkExpressResponse & {
  locals: {
    authResult: SrkCookie;
    controllerResult: SrkResponse<T>;
  };
};
