import { MemberRegistrationDto } from "@@/common/dto/auth";
import { IMemberRegisterPayload } from "@@/common/interfaces/api";
import { DI } from "src/app";
import SrkError from "src/classes/SrkError";
import { hash } from "src/services/bcrypt";
import { SrkCookie } from "src/services/jwt";
import chooseRandomDiscriminator from "./utils/chooseRandomDiscriminator";
// import isDiscriminatorAvailable from "./utils/isDiscriminatorAvailable";

export default async function (
  _authResult: SrkCookie,
  { username, displayName, password, email }: MemberRegistrationDto
): Promise<IMemberRegisterPayload> {
  if (await DI.memberRepo.find({ username })) {
    throw new SrkError("usernameNotAvailable");
  }

  // if (typeof discriminator !== "undefined") {
  //   if (!(await isDiscriminatorAvailable({ displayName, discriminator }))) {
  //     throw new SrkError("discriminatorNotAvailable");
  //   }
  // } else {
  const discriminator = await chooseRandomDiscriminator({ displayName });
  // }

  const member = DI.memberRepo.create({
    username,
    displayName,
    email,
    discriminator,
    pwHash: await hash(password),
  });

  await DI.memberRepo.persistAndFlush(member);

  return {
    id: member.id,
  };
}
