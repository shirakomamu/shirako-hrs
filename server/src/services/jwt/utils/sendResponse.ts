import { Response } from "express";
import SrkError from "server/classes/SrkError";
import SrkResponse from "server/classes/SrkResponse";
import { ISrkResponse } from "common/types/api";
// import {
//   AUTH_JWT_COOKIE_NAME,
//   AUTH_JWT_COOKIE_PARAMETERS,
// } from "server/config/cookie";
import assert from "common/utils/assert";
import { SrkExpressResponse } from "../jwt.interfaces";

async function sendResponse(
  res: Response | SrkExpressResponse,
  srk: SrkResponse
) {
  res.status(srk.status);

  for (const header in srk.headers) {
    res.header(header, srk.headers[header]);
  }

  // if (srk.error?.status === 401) {
  //   res.clearCookie(AUTH_JWT_COOKIE_NAME, AUTH_JWT_COOKIE_PARAMETERS);
  // }

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
    assert<SrkExpressResponse>(res);
    await res.locals.controllerResult.payload;
  }

  return res.json(srkResponse);
}

export default (res: SrkExpressResponse) => {
  return sendResponse(res, res.locals.controllerResult);
};
