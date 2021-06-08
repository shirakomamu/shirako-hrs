import { Response } from "express";
import { SrkCookie } from "./jwt.types";

export interface SrkExpressResponse extends Response {
  locals: {
    authResult: SrkCookie;
  };
}
