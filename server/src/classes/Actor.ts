import { ActorDto } from "@@/common/dto/auth";
import { Role, RoleGroup } from "src/services/hrbac";

export default class Actor {
  public id: string;
  public username: string; // user ID (must be unique)
  public email: string;
  public avatar: string | null; // profile pic
  public cohort: string | null; // sub-managed member
  public key: string | null; // api key, non-null if used
  public rgs: RoleGroup[];
  public roles: Role[];

  constructor({ id, username, email, avatar, cohort, key, rgs }: ActorDto) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.avatar = avatar;
    this.cohort = cohort;
    this.key = key;
    this.rgs = rgs;
    this.roles = [];
  }
}
