import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { enums as JwtEnums, types as JwtTypes } from "src/services/jwt";
import SrkError from "src/classes/SrkError";

function assert(_jwt: any): asserts _jwt is JwtTypes.SrkCookie {}

export default function (req: Request, res: Response, next: NextFunction) {
  // if no jwt is provided in signed cookie
  if (!req.signedCookies?.jwt) {
    res.locals.authResult = {
      authType: JwtEnums.AuthType.none,
    } as JwtTypes.SrkCookie;
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
  } as JwtTypes.SrkCookie;
  return next();
}
