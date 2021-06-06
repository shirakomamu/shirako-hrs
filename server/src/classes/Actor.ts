import { enums as HrbacEnums } from "server/src/services/hrbac";

export default class Actor {
  public id: string;
  public identifier: string; // user-visible ID (must be unique)
  public email: string;
  public cohort: string | null; // sub-managed member
  public key: string | null; // api key, non-null if used
  public rgs: HrbacEnums.RoleGroup[];

  constructor({
    id,
    identifier,
    email,
    cohort,
    key,
    rgs,
  }: {
    id: string;
    identifier: string;
    email: string;
    cohort: string | null;
    key: string | null;
    rgs: HrbacEnums.RoleGroup[];
  }) {
    this.id = id;
    this.identifier = identifier;
    this.email = email;
    this.cohort = cohort;
    this.key = key;
    this.rgs = rgs;
  }
}
