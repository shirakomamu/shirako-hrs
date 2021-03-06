import { ActorDto } from "common/dto/auth";
import { UpdateUserResponse } from "server/services/auth0-mgmt/updateUser";

export interface ISelfIdentifyPayload {
  actor?: ActorDto;
}

export interface IVerifyEmailPayload {}

export interface IResetPasswordPayload {}

export interface IUpdateUserPayload extends UpdateUserResponse {}

export interface ICreateApiKeyPayload {
  key: string;
  createdAt: number;
}

export interface ICheckApiKeyPayload {
  createdAt: number | null;
}
