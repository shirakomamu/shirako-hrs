import { EntitySchema } from "@mikro-orm/core";
import {
  NUM_TOKEN_DIGITS,
  VERIFICATION_EXPIRY_MINUTES,
} from "src/config/memberVerification";
import { v4 } from "uuid";
import { BaseEntity } from "./BaseEntity";
import { Member } from "./Member";

export class MemberVerification extends BaseEntity {
  otpCode!: string;
  otpToken!: string;
  claimed!: boolean;
  member: Member;

  get isFresh(): boolean {
    return (
      this.createdAt.getTime() + VERIFICATION_EXPIRY_MINUTES * 60 * 1000 >=
      Date.now()
    );
  }

  constructor(member: Member) {
    super();
    this.member = member;
  }
}

export default new EntitySchema<MemberVerification, BaseEntity>({
  class: MemberVerification,
  properties: {
    otpCode: {
      type: "string",
      onCreate: () =>
        Math.floor(Math.random() * 10 ** NUM_TOKEN_DIGITS)
          .toString()
          .padStart(NUM_TOKEN_DIGITS, "0"),
    },
    otpToken: {
      type: "string",
      onCreate: () => v4(),
      unique: true,
    },
    claimed: {
      type: "boolean",
      onCreate: () => false,
    },
    member: {
      entity: () => Member,
      reference: "m:1",
    },
    isFresh: {
      type: "method",
      persist: false,
      getter: true,
    },
  },
});
