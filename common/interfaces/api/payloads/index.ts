import { VerificationStatus } from "src/entities/Member";

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

interface IPageGuardSingleton {
  path: string;
  result: boolean;
}

export interface IPageGuardPayload extends Array<IPageGuardSingleton> {}

export interface ILoginPayload {}
