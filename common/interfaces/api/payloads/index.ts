import { ActorDto } from "@@/common/dto/auth";
import { VerificationStatus } from "src/entities/Member";

export interface ISelfIdentifyPayload {
  actor?: ActorDto;
}

export interface IVerifyEmailPayload {}

export interface IResetPasswordPayload {}

export interface IUpdateUserPayload {
  username?: string;
  nickname?: string;
  email?: string;
}

// unused below

export interface IMemberRegisterPayload {
  verificationRequired: boolean;
  otpToken: string;
}

export interface IOtpTokenCheckPayload {
  otpCodeError: boolean;
  status: VerificationStatus;
  emailHint: string;
}

export interface IMemberRegisterVerifiedPayload {
  id: string;
}

export interface INameCheckPayload {
  isAvailable: boolean;
  type: "un" | "dn";
  name: string;
}
