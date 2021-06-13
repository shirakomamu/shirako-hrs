import { Response } from "express";
import ISrkResponse from "@@/common/interfaces/api";
import {
  AUTH_JWT_COOKIE_NAME,
  AUTH_JWT_COOKIE_PARAMETERS,
} from "src/config/cookie";
import { SrkExpressResponse } from "src/services/jwt";
import SrkError from "./SrkError";

export default class SrkResponse {
  public ok: boolean;
  public error?: SrkError | null;
  public payload?: any;
  public status: number;
  public headers?: {
    [key: string]: string;
  };

  constructor(
    res: Response | SrkExpressResponse,
    {
      status,
      headers,
      error,
      payload,
    }: {
      status?: number;
      headers?: { [key: string]: string };
      error?: SrkError | null;
      payload?: any;
    } = {}
  ) {
    this.ok = !error;
    this.error = error;
    this.payload = payload;
    this.status = status || (!error ? 200 : error.status);
    this.headers = headers;

    res.status(this.status);

    for (const header in this.headers) {
      res.header(header, this.headers[header]);
    }

    if (this.error?.status === 401) {
      res.clearCookie(AUTH_JWT_COOKIE_NAME, AUTH_JWT_COOKIE_PARAMETERS);
    }

    const srkResponse = {
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
    } as ISrkResponse<typeof payload>;

    res.json(srkResponse);
  }
}
