import { FriendStatus } from "common/enums";
import { DestinationListMetadata } from "./lists";

export interface IMemberPayload {
  username: string;
  nickname: string;
  avatar: string;
  isAcceptingFriends: boolean;
  lists: DestinationListMetadata[];
}

export interface UserIdentity {
  id: string;
  username: string;
  nickname: string;
  avatar: string;
  cohort: string | null;
  isAcceptingFriends: boolean;
}

export interface IFriendStatusPayload {
  users: {
    user: Omit<UserIdentity, "id">;
    status: FriendStatus;
  }[];
}

export interface ISearchUsersPayload {
  users: Omit<UserIdentity, "id">[];
}
