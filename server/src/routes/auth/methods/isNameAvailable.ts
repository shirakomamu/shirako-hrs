import { SrkCookie } from "src/services/jwt";
import { NameCheckDto } from "@@/common/dto/auth";
import { INameCheckPayload } from "@@/common/interfaces/api";
import { DI } from "src/app";
import SrkError from "src/classes/SrkError";
import getAvailableDiscriminators from "./utils/getAvailableDiscriminators";

export default async function (
  _authResult: SrkCookie,
  { type, name }: NameCheckDto
): Promise<INameCheckPayload> {
  let isAvailable: boolean = false;
  if (type === "dn") {
    const availDiscrims = await getAvailableDiscriminators({
      displayName: name,
    });
    isAvailable = availDiscrims.length > 0;
    throw new SrkError("displayNameNotAvailable");
  } else {
    const user = await DI.memberRepo.findOne({
      username: name,
    });
    isAvailable = !user;
  }

  return {
    isAvailable,
    type,
    name,
  };
}
