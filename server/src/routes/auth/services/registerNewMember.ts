import { DI } from "src/app";
import { hash } from "src/services/bcrypt";
import { SrkCookie } from "src/services/jwt";

export default async function userRegister(
  _authResult: SrkCookie,
  {
    username,
    password,
    email,
  }: { username: string; password: string; email?: string | null }
) {
  const member = DI.memberRepo.create({
    username,
    email,
    discriminator: Math.floor(Math.random() * 10000).toString(),
    pwHash: await hash(password),
  });

  await DI.memberRepo.persistAndFlush(member);

  return "Test";
}
