import pageConfig from "src/services/pages";
import hrbac from "src/services/hrbac";
import { SrkCookie } from "src/services/jwt";
import { IPageGuardPayload } from "@@/common/interfaces/api";

export default function (
  authResult: SrkCookie,
  paths: string[]
): IPageGuardPayload {
  const results = paths.map((e) => {
    const guard = pageConfig[e];

    let result: boolean = false;

    if (guard) {
      result = hrbac.can(guard, authResult.actor);
    }

    return {
      path: e,
      result,
    };
  });

  return results;
}
