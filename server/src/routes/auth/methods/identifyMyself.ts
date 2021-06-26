import { SrkCookie } from "src/services/jwt";
import { ISelfIdentifyPayload } from "@@/common/interfaces/api";
import { ActorDto } from "@@/common/dto/auth";

export default (authResult: SrkCookie): ISelfIdentifyPayload => {
  return {
    actor: {
      ...authResult.actor,
      rgs: [],
    } as ActorDto,
  };
};
