import { OtpTokenCheckDto } from "@@/common/dto/auth";
import { IOtpTokenCheckPayload } from "@@/common/interfaces/api";
import { DI } from "src/app";
import SrkError from "src/classes/SrkError";
import { VerificationStatus } from "src/entities/Member";
import { SrkCookie } from "src/services/jwt";

export default async function (
  _authResult: SrkCookie,
  { otpToken, otpCode: _otpCode }: OtpTokenCheckDto
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
    throw new SrkError("resourceInvalid");
  }

  // const [status, key] = [member.verificationStatus, member.activeKey];

  // // console.log(member);

  // if (
  //   status === VerificationStatus.inactive ||
  //   status === VerificationStatus.verified
  // ) {
  //   throw new SrkError("tokenExpired");
  // }

  // let returnStatus: "verifying" | "verified" = "verifying";
  // if (otpCode) {
  //   if (key?.otpCode === otpCode) {
  //     // verify user here
  //     returnStatus = "verified";
  //   } else {
  //     throw new SrkError("invalidOtpCode");
  //   }
  // }

  // console.log("Return status", returnStatus);
  console.log(member);
  console.log(member.activeKey);
  console.log(VerificationStatus[member.verificationStatus]);
  console.log(member.verificationKeys[0].isFresh);

  return {
    status: VerificationStatus[member.verificationStatus] as
      | "verifying"
      | "verified",
  };
}
