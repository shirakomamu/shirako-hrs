import { Collection, EntitySchema } from "@mikro-orm/core";
import { ApiKey } from "./ApiKey";
import { BaseEntity } from "./BaseEntity";
import { DestinationList } from "./DestinationList";
import { Friend } from "./Friend";

export class Member extends BaseEntity {
  sub: string; // id from idp
  apiKey!: ApiKey;
  destinationLists = new Collection<DestinationList>(this);
  outgoingFriends = new Collection<Friend>(this);
  incomingFriends = new Collection<Friend>(this);

  constructor(sub: string) {
    super();
    this.sub = sub;
  }

  get confirmedFriends(): Member[] {
    const outFriends = this.outgoingFriends.getItems();
    const inFriends = this.incomingFriends.getItems();

    return outFriends
      .filter((e) => {
        return inFriends.includes(e);
      })
      .map((e) => e.friend);
  }

  get pendingOutgoingFriends(): Member[] {
    const outFriends = this.outgoingFriends.getItems();
    const inFriends = this.incomingFriends.getItems();

    return outFriends
      .filter((e) => {
        return !inFriends.includes(e);
      })
      .map((e) => e.friend);
  }

  get pendingIncomingFriends(): Member[] {
    const outFriends = this.outgoingFriends.getItems();
    const inFriends = this.incomingFriends.getItems();

    return inFriends
      .filter((e) => {
        return !outFriends.includes(e);
      })
      .map((e) => e.user);
  }
}

export default new EntitySchema<Member, BaseEntity>({
  class: Member,
  properties: {
    sub: { type: String, unique: true },
    apiKey: {
      entity: () => ApiKey,
      reference: "1:1",
      nullable: true,
      inversedBy: "owner",
      orphanRemoval: true,
    },
    destinationLists: {
      entity: () => DestinationList,
      reference: "1:m",
      mappedBy: "owner",
      orphanRemoval: true,
    },
    outgoingFriends: {
      entity: () => Friend,
      reference: "1:m",
      mappedBy: "user",
      orphanRemoval: true,
    },
    incomingFriends: {
      entity: () => Friend,
      reference: "1:m",
      mappedBy: "friend",
      orphanRemoval: true,
    },
    confirmedFriends: {
      type: "method",
      persist: false,
      getter: true,
      lazy: true,
    },
    pendingOutgoingFriends: {
      type: "method",
      persist: false,
      getter: true,
      lazy: true,
    },
    pendingIncomingFriends: {
      type: "method",
      persist: false,
      getter: true,
      lazy: true,
    },
  },
});
