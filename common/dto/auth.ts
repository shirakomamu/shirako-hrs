import { ListVisibility, FriendRequestPrivacy } from "common/enums";
import { Role, RoleGroup } from "common/enums/hrbac";

export type UpdateUserPrivacyDto = {
  friendRequestPrivacy?: FriendRequestPrivacy;
  defaultListVisibility?: ListVisibility;
};

export type UpdateUserLocationDto = {
  defaultLocation?: string | null;
};

export type Auth0UserMetadataDto = {
  privacySettings?: UpdateUserPrivacyDto;
  locationSettings?: UpdateUserLocationDto;
};

export type Auth0AppMetadataDto = {
  hrs: {
    rgs: RoleGroup[];
  };
};

export type ActorConstructorDto = {
  id: string;
  username: string;
  nickname: string;
  email: string;
  avatar: string | null;
  cohort: string | null;
  key: boolean;
  rgs: RoleGroup[];
  meta: Auth0UserMetadataDto;
};

export type ActorDto = ActorConstructorDto & {
  roles: Role[];
};

export type UpdateUserDto = {
  username?: string;
  nickname?: string;
  email?: string;
};
