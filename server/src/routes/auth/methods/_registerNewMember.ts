import { MemberRegistrationDto } from "@@/common/dto/auth";
import { IMemberRegisterPayload } from "@@/common/interfaces/api";
import { DI } from "src/app";
import SrkError from "src/classes/SrkError";
import { hash } from "src/services/bcrypt";
import { SrkCookie } from "src/services/jwt";
import chooseRandomDiscriminator from "./utils/chooseRandomDiscriminator";

export default async function (
  _authResult: SrkCookie,
  { username, displayName, password, email }: MemberRegistrationDto
): Promise<IMemberRegisterPayload> {
  if (await DI.memberRepo.findOne({ username })) {
    throw new SrkError("usernameNotAvailable");
  }

  const discriminator = await chooseRandomDiscriminator({ displayName });

  const member = DI.memberRepo.create({
    username,
    displayName,
    email,
    discriminator,
    pwHash: await hash(password),
  });

  const verification = DI.memberVerificationRepo.create({
    member,
  });

  member.verificationKeys.add(verification);
  await DI.memberRepo.persistAndFlush(member);

  return {
    verificationRequired: true,
    otpToken: verification.otpToken,
  };
}
