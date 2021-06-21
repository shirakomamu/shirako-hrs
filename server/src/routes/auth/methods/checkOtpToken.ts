import { OtpTokenCheckDto } from "@@/common/dto/auth";
import { IOtpTokenCheckPayload } from "@@/common/interfaces/api";
import { DI } from "src/app";
import SrkError from "src/classes/SrkError";
import { VerificationStatus } from "src/entities/Member";
import { SrkCookie } from "src/services/jwt";

export default async function (
  _authResult: SrkCookie,
  { otpToken, otpCode }: OtpTokenCheckDto
): Promise<IOtpTokenCheckPayload> {
  const member = await DI.memberRepo.findOne(
    {
      verificationKeys: {
        otpToken: {
          $eq: otpToken,
        },
      },
    },
    ["verificationKeys"]
  );

  if (!member) {
    throw new SrkError("tokenExpired");
  }

  if (
    member?.activeKey?.otpToken !== otpToken ||
    member.verificationStatus !== VerificationStatus.verifying
  ) {
    throw new SrkError("tokenExpired");
  }

  const censoredEmail = member.email.replace(
    /^(.)(.*)@(.)(.*)\.(.*)$/,
    (...a) =>
      a[1] +
      "*".repeat(a[2].length) +
      "@" +
      a[3] +
      "*".repeat(a[4].length) +
      "." +
      "*".repeat(a[5].length)
  );

  let otpCodeError: boolean = false;
  if (otpCode) {
    if (member.activeKey?.otpCode === otpCode) {
      member.activeKey.claimed = true;

      await DI.memberRepo.persistAndFlush(member);
    } else {
      otpCodeError = true;
    }
  }

  return {
    otpCodeError,
    status: member.verificationStatus,
    emailHint: censoredEmail,
  };
}
