import { EntitySchema } from "@mikro-orm/core";
import { NUM_TOKEN_DIGITS } from "src/config/memberVerification";
import { v4 } from "uuid";
import { IBaseEntity } from "./BaseEntity";
import { IMember } from "./Member";

export class IMemberVerification extends IBaseEntity {
  otpCode!: string;
  otpToken!: string;
  claimed: boolean;
  member: IMember;

  constructor(member: IMember) {
    super();
    this.member = member;
    this.claimed = false;
  }
}

export default new EntitySchema<IMemberVerification, IBaseEntity>({
  name: "MemberVerification",
  extends: "BaseEntity",
  properties: {
    otpCode: {
      type: "string",
      onCreate: () =>
        Math.floor(Math.random() * 10 ** NUM_TOKEN_DIGITS).toString(),
    },
    otpToken: {
      type: "string",
      onCreate: () => v4(),
      unique: true,
    },
    claimed: {
      type: "boolean",
    },
    member: {
      entity: "Member",
      reference: "m:1",
    },
  },
});
