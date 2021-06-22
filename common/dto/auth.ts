import { Role, RoleGroup } from "src/services/hrbac";

export interface MemberRegistrationDto {
  username: string;
  displayName: string;
  password: string;
  email: string;
}

export interface NameCheckDto {
  type: "un" | "dn";
  name: string;
}

export interface OtpTokenCheckDto {
  otpToken: string;
  otpCode?: string;
}

export interface LoginDto {
  user: string; // email or username
  password: string;
}

export interface ActorDto {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
  cohort: string | null;
  key: string | null;
  rgs: RoleGroup[];
  roles: Role[];
}
