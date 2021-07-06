import { ActorDto } from "@@/common/dto/auth";
import { UpdateUserResponse } from "src/services/auth0-mgmt/updateUser";

export type ISelfIdentifyPayload = {
  actor?: ActorDto;
};

export type IVerifyEmailPayload = {};

export type IResetPasswordPayload = {};

export type IUpdateUserPayload = UpdateUserResponse & {};

export type IUpdateUserPrivacyPayload = UpdateUserResponse & {};
