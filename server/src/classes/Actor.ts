import {
  ActorConstructorDto,
  ActorDto,
  Auth0UserMetadataDto,
} from "common/dto/auth";
import { Role, RoleGroup } from "common/enums/hrbac";
import hrbacRules from "server/services/hrbac-rules";

export default class Actor implements ActorDto {
  public id: string;
  public username: string; // user ID (must be unique)
  public nickname: string;
  public email: string;
  public avatar: string | null; // profile pic
  public cohort: string | null; // sub-managed member
  public key: string | null; // api key, non-null if used
  public rgs: RoleGroup[];
  public roles: Role[];
  public meta: Auth0UserMetadataDto;

  constructor({
    id,
    username,
    nickname,
    email,
    avatar,
    cohort,
    key,
    rgs,
    meta,
  }: ActorConstructorDto) {
    this.id = id;
    this.username = username;
    this.nickname = nickname;
    this.email = email;
    this.avatar = avatar;
    this.cohort = cohort;
    this.key = key;
    this.rgs = rgs;
    this.meta = meta;

    this.roles = rgs
      .flatMap((e) => hrbacRules[e])
      .filter((e, i, a) => !!e && a.indexOf(e) === i);
  }
}
