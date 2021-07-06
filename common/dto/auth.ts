import { ListVisibility, FriendRequestPrivacy } from "@@/common/enums";
import { Role, RoleGroup } from "@@/common/enums/hrbac";

export type UpdateUserPrivacyDto = {
  friendRequestPrivacy?: FriendRequestPrivacy;
  defaultListVisibility?: ListVisibility;
};

export type Auth0UserMetadataDto = {
  privacySettings?: UpdateUserPrivacyDto;
};

export type ActorConstructorDto = {
  id: string;
  username: string;
  nickname: string;
  email: string;
  avatar: string | null;
  cohort: string | null;
  key: string | null;
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

// unused below

export type MemberRegistrationDto = {
  username: string;
  displayName: string;
  password: string;
  email: string;
};

export type NameCheckDto = {
  type: "un" | "dn";
  name: string;
};

export type OtpTokenCheckDto = {
  otpToken: string;
  otpCode?: string;
};

export type LoginDto = {
  user: string; // email or username
  password: string;
};
