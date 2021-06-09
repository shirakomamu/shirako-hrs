import { Collection, EntitySchema } from "@mikro-orm/core";
import { IApiKey } from "./ApiKey";
import { IBaseEntity } from "./BaseEntity";

export interface IMember extends IBaseEntity {
  username: string;
  discriminator: number;
  email: string | null;
  pwHash: string;
  apiKeys: Collection<IApiKey>;
}

export default new EntitySchema<IMember, IBaseEntity>({
  name: "Member",
  extends: "BaseEntity",
  properties: {
    username: { type: "string" },
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
});
