import { Response } from "express";
import SrkError from "src/classes/SrkError";
import SrkResponse from "src/classes/SrkResponse";
import ISrkResponse from "@@/common/types/api";
import {
  AUTH_JWT_COOKIE_NAME,
  AUTH_JWT_COOKIE_PARAMETERS,
} from "src/config/cookie";
import { SrkExpressResponse, WithSrkExpressResponse } from "../jwt.interfaces";

async function sendResponse(
  res: Response | SrkExpressResponse | WithSrkExpressResponse,
  srk: SrkResponse
) {
  res.status(srk.status);

  for (const header in srk.headers) {
    res.header(header, srk.headers[header]);
  }

  if (srk.error?.status === 401) {
    res.clearCookie(AUTH_JWT_COOKIE_NAME, AUTH_JWT_COOKIE_PARAMETERS);
  }

  const srkResponse = {
    ok: srk.ok,
    error:
      srk.error instanceof SrkError
        ? {
            name: srk.error.name,
            message: srk.error.message,
            data: srk.error.data,
          }
        : undefined,
    payload: srk.payload,
  } as ISrkResponse<typeof srk.payload>;

  if (res.locals.controllerResult.payload) {
    await res.locals.controllerResult.payload;
  }

  return res.json(srkResponse);
}

export default (res: WithSrkExpressResponse) => {
  return sendResponse(res, res.locals.controllerResult);
};
