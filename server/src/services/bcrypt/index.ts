import bcrypt from "bcrypt";
import { BCRYPT_SALT_ROUNDS } from "src/config/bcrypt";

export async function hash(plaintextPassword: string) {
  const hash = await bcrypt.hash(plaintextPassword, BCRYPT_SALT_ROUNDS);

  return hash;
}

export async function compare(plaintextPassword: string, hash: string) {
  const result = await bcrypt.compare(plaintextPassword, hash);

  return result;
}
