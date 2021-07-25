import SrkResponse from "server/classes/SrkResponse";
import { SrkExpressRequest, SrkExpressResponse } from "server/services/jwt";
import activateNeurons from "server/methods/neurons/activateNeurons";
import { ActivateNeuronsDto } from "common/dto/neurons";

export default class {
  public activateNeurons = async (
    req: SrkExpressRequest,
    _res: SrkExpressResponse
  ) => {
    const payload = await activateNeurons(
      req.locals.authResult,
      req.body as ActivateNeuronsDto
    );

    return new SrkResponse({ payload });
  };
}
