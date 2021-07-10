import { DestinationListMetadata } from "./lists";

export type IMemberPayload = {
  username: string;
  nickname: string;
  avatar: string;
  hasFriendRequest: boolean;
  isFriend: boolean;
  isAcceptingFriends: boolean;
  lists: DestinationListMetadata[];
};
