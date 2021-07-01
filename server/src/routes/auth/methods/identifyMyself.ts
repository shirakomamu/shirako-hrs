import { SrkCookie } from "src/services/jwt";
import { ISelfIdentifyPayload } from "@@/common/interfaces/api";

export default (authResult: SrkCookie): ISelfIdentifyPayload => {
  if (!authResult.actor) {
    return {};
  }

  return {
    actor: authResult.actor,
  };
};
