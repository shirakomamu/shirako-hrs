import { Collection, EntitySchema } from "@mikro-orm/core";
import { FriendStatus } from "common/enums";
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

  get friendData(): { member: Member; status: FriendStatus }[] {
    const outFriends = this.outgoingFriends.getItems();
    const inFriends = this.incomingFriends.getItems();

    const outFriendsIds = outFriends.map((e) => e.friend);
    const inFriendsIds = inFriends.map((e) => e.user);

    const outResult: { member: Member; status: FriendStatus }[] = [];
    for (const outFriend of outFriends) {
      if (inFriendsIds.includes(outFriend.friend)) {
        outResult.push({
          member: outFriend.friend,
          status: FriendStatus.confirmed,
        });
      } else {
        outResult.push({
          member: outFriend.friend,
          status: FriendStatus.pendingOutgoing,
        });
      }
    }
    for (const inFriend of inFriends) {
      if (!outFriendsIds.includes(inFriend.user)) {
        outResult.push({
          member: inFriend.user,
          status: FriendStatus.pendingIncoming,
        });
      }
    }

    return outResult;
  }

  get confirmedFriends(): Member[] {
    return this.friendData
      .filter((e) => e.status === FriendStatus.confirmed)
      .map((e) => e.member);
  }

  // get pendingOutgoingFriends(): Member[] {
  //   const outFriends = this.outgoingFriends.getItems();
  //   const inFriends = this.incomingFriends.getItems();

  //   return outFriends
  //     .filter((e) => {
  //       return !inFriends.includes(e);
  //     })
  //     .map((e) => e.friend);
  // }

  // get pendingIncomingFriends(): Member[] {
  //   const outFriends = this.outgoingFriends.getItems();
  //   const inFriends = this.incomingFriends.getItems();

  //   return inFriends
  //     .filter((e) => {
  //       return !outFriends.includes(e);
  //     })
  //     .map((e) => e.user);
  // }
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
    friendData: {
      type: "method",
      persist: false,
      getter: true,
      lazy: true,
    },
    confirmedFriends: {
      type: "method",
      persist: false,
      getter: true,
      lazy: true,
    },
    // pendingOutgoingFriends: {
    //   type: "method",
    //   persist: false,
    //   getter: true,
    //   lazy: true,
    // },
    // pendingIncomingFriends: {
    //   type: "method",
    //   persist: false,
    //   getter: true,
    //   lazy: true,
    // },
  },
});
