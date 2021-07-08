import { SrkCookie } from "server/services/jwt";
import { ISelfIdentifyPayload } from "common/types/api";

export default (authResult: SrkCookie): ISelfIdentifyPayload => {
  if (!authResult.actor) {
    return {};
  }

  return {
    actor: authResult.actor,
  };
};
