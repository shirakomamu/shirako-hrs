import { Collection, EntitySchema } from "@mikro-orm/core";
import { IApiKey } from "./ApiKey";
import { IBaseEntity } from "./BaseEntity";

export class IMember extends IBaseEntity {
  username: string;
  displayName: string;
  discriminator: number;
  email: string | null;
  pwHash: string;
  apiKeys = new Collection<IApiKey>(this);

  constructor(
    username: string,
    displayName: string,
    discriminator: number,
    pwHash: string,
    email: string | null
  ) {
    super();
    this.username = username;
    this.displayName = displayName;
    this.discriminator = discriminator;
    this.pwHash = pwHash;
    this.email = email;
  }
}

export default new EntitySchema<IMember, IBaseEntity>({
  name: "Member",
  extends: "BaseEntity",
  properties: {
    username: { type: "string", unique: true },
    displayName: { type: "string", default: "" },
    discriminator: { type: "number" },
    email: { type: "string", nullable: true },
    pwHash: { type: "string" },
    apiKeys: {
      entity: "ApiKey",
      reference: "1:m",
      mappedBy: "member",
      orphanRemoval: true,
    },
  },
  uniques: [
    {
      properties: ["username", "discriminator"],
      name: "fullUsername",
    },
  ],
});
