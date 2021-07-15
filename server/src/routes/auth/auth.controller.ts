import SrkResponse from "server/classes/SrkResponse";
import { SrkExpressRequest, SrkExpressResponse } from "server/services/jwt";
import {
  identifyMyself,
  resendVerificationEmail,
  sendPasswordResetEmail,
  updateUser,
  updateUserPreferences,
  deleteUser,
} from "server/methods/auth";
import { Auth0UserMetadataDto, UpdateUserDto } from "common/dto/auth";

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

  // public registerNewMember = async (req: SrkExpressRequest, res: SrkExpressResponse) => {
  //   const payload = await registerNewMember(req.locals.authResult, req.body);

  //   return new SrkResponse({ payload });
  // };

  // public isNameAvailable = async (req: SrkExpressRequest, res: SrkExpressResponse) => {
  //   const payload = await isNameAvailable(req.locals.authResult, req.body);

  //   return new SrkResponse({ payload });
  // };

  // public checkOtpToken = async (req: SrkExpressRequest, res: SrkExpressResponse) => {
  //   const payload = await checkOtpToken(req.locals.authResult, req.body);

  //   return new SrkResponse({ payload });
  // };
}
