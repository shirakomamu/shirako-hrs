import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { SrkCookie, AuthType } from "src/services/jwt";
import SrkError from "src/classes/SrkError";

function assert(_jwt: any): asserts _jwt is SrkCookie {}

export default function (req: Request, res: Response, next: NextFunction) {
  // if no jwt is provided in signed cookie
  if (!req.signedCookies?.jwt) {
    res.locals.authResult = {
      authType: AuthType.none,
    } as SrkCookie;
    return next();
  }

  let jwtData;
  try {
    jwtData = jwt.verify(
      req.signedCookies?.jwt,
      process.env.JWT_SECRET || "default-jwt-secret",
      undefined
    );
  } catch (e: TokenExpiredError | JsonWebTokenError | unknown) {
    if (e instanceof TokenExpiredError) throw new SrkError("jwtExpired");
    if (e instanceof JsonWebTokenError) throw new SrkError("jwtInvalid");
    throw new SrkError("internalError");
  }

  assert(jwtData);
  res.locals.authResult = {
    authType: jwtData.authType,
    actor: jwtData.actor,
  } as SrkCookie;
  return next();
}
