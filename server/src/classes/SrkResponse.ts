import { Response } from "express";
import {
  AUTH_JWT_COOKIE_NAME,
  AUTH_JWT_COOKIE_PARAMETERS,
} from "../config/cookie";
import SrkError from "./SrkError";

export default class SrkResponse {
  public status: number;
  public ok: boolean;
  public error?: SrkError | null;
  public payload?: any;

  constructor({
    status,
    error,
    payload,
  }: {
    status?: number;
    error?: SrkError | null;
    payload?: any;
  } = {}) {
    this.status = status || (!error ? 200 : error.status);
    this.ok = !error;
    this.error = error;
    this.payload = payload;
  }

  public send(res: Response) {
    res.status(this.status);

    if (this.error?.status === 401) {
      res.clearCookie(AUTH_JWT_COOKIE_NAME, AUTH_JWT_COOKIE_PARAMETERS);
    }

    return res.json({
      ok: this.ok,
      error:
        this.error instanceof SrkError
          ? {
              name: this.error.name,
              message: this.error.message,
              data: this.error.data,
            }
          : undefined,
      payload: this.payload,
    });
  }
}
