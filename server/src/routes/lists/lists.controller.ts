import { Request } from "express";
import SrkResponse from "server/classes/SrkResponse";
import { SrkExpressResponse } from "server/services/jwt";
import { createDestinationList } from "./methods";

export default class {
  public createDestinationList = async (
    req: Request,
    res: SrkExpressResponse
  ) => {
    const payload = await createDestinationList(
      res.locals.authResult,
      req.body
    );

    return new SrkResponse({ payload });
  };
}
