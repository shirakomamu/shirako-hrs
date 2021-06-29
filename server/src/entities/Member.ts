import { Collection, EntitySchema, QueryOrder } from "@mikro-orm/core";
import { ApiKey } from "./ApiKey";
import { BaseEntity } from "./BaseEntity";
import { MemberVerification } from "./MemberVerification";

export enum VerificationStatus {
  inactive = "inactive", // user has never verified
  verified = "verified", // user is active
  verifying = "verifying", // user is actively verifying (initial or re-verifying, check hasVerified)
}

export class Member extends BaseEntity {
  username: string;
  displayName: string;
  discriminator: number;
  email: string;
  pwHash: string;
  apiKeys = new Collection<ApiKey>(this);
  verificationKeys = new Collection<MemberVerification>(this);

  constructor(
    username: string,
    displayName: string,
    discriminator: number,
    pwHash: string,
    email: string
  ) {
    super();
    this.username = username;
    this.displayName = displayName;
    this.discriminator = discriminator;
    this.pwHash = pwHash;
    this.email = email;
  }

  get hasVerified(): boolean {
    const keyArray = this.verificationKeys.getItems();

    return keyArray.some((e) => e.claimed);
  }

  get activeKey(): MemberVerification | null {
    const keyArray = this.verificationKeys.getItems();

    return keyArray[0] || null;
  }

  get verificationStatus(): VerificationStatus {
    const key = this.activeKey;

    if (key?.claimed) {
      return VerificationStatus.verified;
    }

    if (key?.isFresh) {
      return VerificationStatus.verifying;
    }

    return VerificationStatus.inactive;
  }
}

export default new EntitySchema<Member, BaseEntity>({
  class: Member,
  properties: {
    username: { type: String, unique: true },
    displayName: { type: String },
    discriminator: { type: Number },
    email: { type: String },
    pwHash: { type: String, lazy: true },
    apiKeys: {
      entity: () => ApiKey,
      reference: "1:m",
      mappedBy: "member",
      orphanRemoval: true,
    },
    verificationKeys: {
      entity: () => MemberVerification,
      reference: "1:m",
      mappedBy: "member",
      orphanRemoval: true,
      orderBy: {
        createdAt: QueryOrder.DESC,
      },
    },
    hasVerified: {
      entity: "method",
      persist: false,
      getter: true,
    },
    activeKey: {
      entity: "method",
      persist: false,
      getter: true,
    },
    verificationStatus: {
      type: "method",
      persist: false,
      getter: true,
    },
  },
  uniques: [
    {
      properties: ["displayName", "discriminator"],
      name: "fullDisplayName",
    },
  ],
});