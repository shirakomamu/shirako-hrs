export interface IMemberRegisterPayload {
  verificationRequired: boolean;
  otpToken: string;
}

export interface IOtpTokenCheckPayload {
  status: "verifying" | "verified";
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
