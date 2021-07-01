import { Response } from "express";
import SrkResponse from "src/classes/SrkResponse";
import { SrkExpressResponse, WithSrkExpressResponse } from "../jwt.interfaces";

export default function (
  res: Response | SrkExpressResponse,
  srkResponse: SrkResponse
): asserts res is WithSrkExpressResponse {
  (res as WithSrkExpressResponse).locals.controllerResult = srkResponse;
}
