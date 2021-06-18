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
