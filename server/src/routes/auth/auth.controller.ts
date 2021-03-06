import SrkResponse from "server/classes/SrkResponse";
import { SrkExpressRequest, SrkExpressResponse } from "server/services/jwt";
import { Auth0UserMetadataDto, UpdateUserDto } from "common/dto/auth";
import identifyMyself from "server/methods/auth/identifyMyself";
import resendVerificationEmail from "server/methods/auth/resendVerificationEmail";
import sendPasswordResetEmail from "server/methods/auth/sendPasswordResetEmail";
import updateUser from "server/methods/auth/updateUser";
import updateUserPreferences from "server/methods/auth/updateUserPreferences";
import deleteUser from "server/methods/auth/deleteUser";
import createApiKey from "server/methods/auth/createApiKey";
import deleteApiKey from "server/methods/auth/deleteApiKey";
import checkApiKey from "server/methods/auth/checkApiKey";

export default class {
  public identifyMyself = async (
    req: SrkExpressRequest,
    _res: SrkExpressResponse
  ) => {
    const payload = await identifyMyself(req.locals.authResult);

    return new SrkResponse({ payload });
  };

  public resendVerificationEmail = async (
    req: SrkExpressRequest,
    _res: SrkExpressResponse
  ) => {
    const payload = await resendVerificationEmail(req.locals.authResult);

    return new SrkResponse({ payload });
  };

  public sendPasswordResetEmail = async (
    req: SrkExpressRequest,
    _res: SrkExpressResponse
  ) => {
    const payload = await sendPasswordResetEmail(req.locals.authResult);

    return new SrkResponse({ payload });
  };

  public updateUser = async (
    req: SrkExpressRequest,
    _res: SrkExpressResponse
  ) => {
    const payload = await updateUser(
      req.locals.authResult,
      req.body as UpdateUserDto
    );

    return new SrkResponse({ payload });
  };

  public updateUserPreferences = async (
    req: SrkExpressRequest,
    _res: SrkExpressResponse
  ) => {
    const payload = await updateUserPreferences(
      req.locals.authResult,
      req.body as Auth0UserMetadataDto
    );

    return new SrkResponse({ payload });
  };

  public deleteUser = async (
    req: SrkExpressRequest,
    _res: SrkExpressResponse
  ) => {
    const payload = await deleteUser(req.locals.authResult);

    return new SrkResponse({ payload });
  };

  public checkApiKey = async (
    req: SrkExpressRequest,
    _res: SrkExpressResponse
  ) => {
    const payload = await checkApiKey(req.locals.authResult);

    return new SrkResponse({ payload });
  };

  public createApiKey = async (
    req: SrkExpressRequest,
    _res: SrkExpressResponse
  ) => {
    const payload = await createApiKey(req.locals.authResult);

    return new SrkResponse({ payload });
  };

  public deleteApiKey = async (
    req: SrkExpressRequest,
    _res: SrkExpressResponse
  ) => {
    const payload = await deleteApiKey(req.locals.authResult);

    return new SrkResponse({ payload });
  };
}
