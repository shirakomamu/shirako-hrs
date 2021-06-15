import { RoleGroup } from "src/services/hrbac";

export default class Actor {
  public id: string;
  public username: string; // user ID (must be unique)
  public email: string | null;
  public cohort: string | null; // sub-managed member
  public key: string | null; // api key, non-null if used
  public rgs: RoleGroup[];

  constructor({
    id,
    username,
    email,
    cohort,
    key,
    rgs,
  }: {
    id: string;
    username: string;
    email: string;
    cohort: string | null;
    key: string | null;
    rgs: RoleGroup[];
  }) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.cohort = cohort;
    this.key = key;
    this.rgs = rgs;
  }
}
