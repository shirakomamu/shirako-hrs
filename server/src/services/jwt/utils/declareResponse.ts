import { Response } from "express";
import SrkResponse from "server/classes/SrkResponse";
import { SrkExpressResponse } from "../jwt.interfaces";

export default function (
  res: Response | SrkExpressResponse,
  srkResponse: SrkResponse
): asserts res is SrkExpressResponse {
  (res as SrkExpressResponse).locals.controllerResult = srkResponse;
}
