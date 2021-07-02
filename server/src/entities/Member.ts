import { Collection, EntitySchema } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { DestinationList } from "./DestinationList";
import { Friend } from "./Friend";

export class Member extends BaseEntity {
  sub: string; // id from idp
  destinationLists = new Collection<DestinationList>(this);
  outgoingFriends = new Collection<Friend>(this);
  incomingFriends = new Collection<Friend>(this);

  constructor(sub: string) {
    super();
    this.sub = sub;
  }

  get confirmedFriends(): Friend[] {
    const outFriends = this.outgoingFriends.getItems();
    const inFriends = this.incomingFriends.getItems();

    return outFriends.filter((e) => {
      return inFriends.includes(e);
    });
  }

  get pendingOutgoingFriends(): Friend[] {
    const outFriends = this.outgoingFriends.getItems();
    const inFriends = this.incomingFriends.getItems();

    return outFriends.filter((e) => {
      return !inFriends.includes(e);
    });
  }

  get pendingIncomingFriends(): Friend[] {
    const outFriends = this.outgoingFriends.getItems();
    const inFriends = this.incomingFriends.getItems();

    return inFriends.filter((e) => {
      return !outFriends.includes(e);
    });
  }
}

export default new EntitySchema<Member, BaseEntity>({
  class: Member,
  properties: {
    sub: { type: String, unique: true },
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
