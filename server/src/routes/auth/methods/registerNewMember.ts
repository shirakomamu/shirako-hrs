import { DI } from "src/app";
import SrkError from "src/classes/SrkError";
import { hash } from "src/services/bcrypt";
import { SrkCookie } from "src/services/jwt";
import chooseRandomDiscriminator from "./utils/chooseRandomDiscriminator";
import isDiscriminatorAvailable from "./utils/isDiscriminatorAvailable";

export default async function userRegister(
  _authResult: SrkCookie,
  {
    username,
    discriminator,
    password,
    email,
  }: {
    username: string;
    discriminator?: number;
    password: string;
    email?: string | null;
  }
) {
  if (typeof discriminator !== "undefined") {
    if (!(await isDiscriminatorAvailable({ username, discriminator }))) {
      throw new SrkError("discriminatorNotAvailable");
    }
  } else {
    discriminator = await chooseRandomDiscriminator({ username });
  }

  const member = DI.memberRepo.create({
    username,
    email,
    discriminator,
    pwHash: await hash(password),
  });

  await DI.memberRepo.persistAndFlush(member);

  return member;
}
