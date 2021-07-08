/* eslint-disable camelcase */
import { ActorDto } from "common/dto/auth";
import { ListVisibility } from "common/enums";
import { UpdateUserResponse } from "server/services/auth0-mgmt/updateUser";

export type ISelfIdentifyPayload = {
  actor?: ActorDto;
};

export type IVerifyEmailPayload = {};

export type IResetPasswordPayload = {};

export type IUpdateUserPayload = UpdateUserResponse & {};

export type IUpdateUserPrivacyPayload = UpdateUserResponse & {};

// from yelp API
export type DestinationItem = {
  id: string;
  name: string;
  image: string;
  url: string;
  display_address: string[];
  display_phone: string;
  price: string; // $$$$
  hours: {
    is_open_now: boolean;
    open: {
      is_overnight: boolean;
      start: string; // 0000
      end: string; // 0000
      day: number; // 0-6 (Mon - Sun)
    }[];
  }[];
  special_hours: {
    date: string; // yyyy-MM-dd
    is_closed: boolean;
    is_overnight: boolean;
    start: string; // 0000
    end: string; // 0000
  }[];
};

export type IDestinationListPayload = {
  title: string;
  owner: string;
  description: string | null;
  visibility: ListVisibility;
  items: DestinationItem[];
};
