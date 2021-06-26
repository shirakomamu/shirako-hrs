import { Role, RoleGroup } from "src/services/hrbac";

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

export type Auth0UserMetadataDto = {
  privacySettings?: {
    friendRequestPrivacy?: string;
    defaultListVisibility?: string;
  };
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
