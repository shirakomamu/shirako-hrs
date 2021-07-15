import { send } from ".";

export interface BusinessIdentifyResponse {
  id: string;
  alias: string;
  name: string;
  image_url: string;
  is_claimed: boolean;
  is_closed: boolean;
  url: string;
  phone: string;
  display_phone: string;
  review_count: number;
  categories: {
    alias: string;
    title: string;
  }[];
  rating: number;
  location: {
    address1: string;
    address2: string;
    address3: string;
    city: string;
    zip_code: string;
    country: string;
    state: string;
    display_address: string[];
    cross_streets: string;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  photos: string[];
  price: string;
  hours: {
    open: {
      is_overnight: boolean;
      start: string;
      end: string;
      day: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    }[];
    hours_type: string;
    is_open_now: boolean;
  }[];
  transactions: ("pickup" | "delivery" | "restaurant_reservation")[];
  special_hours: {
    date: string;
    is_closed: boolean;
    start: string;
    end: string;
    is_overnight: boolean;
  }[];
}

interface MovedResponse {
  error?: {
    code: "BUSINESS_MIGRATED";
    description: string;
    new_business_id: string;
  };
}

type CombinedResponse = BusinessIdentifyResponse & MovedResponse; // it's actually more of a | but TS isn't playing nice

export default async (id: string) => {
  const ENDPOINT = "businesses/" + id;

  let response = await send<CombinedResponse>(ENDPOINT, {
    method: "get",
  });

  if (response?.error?.code === "BUSINESS_MIGRATED") {
    const newEndpoint = "businesses/" + response.error.new_business_id;
    response = await send<CombinedResponse>(newEndpoint, {
      method: "get",
    });
  }

  return response as BusinessIdentifyResponse;
};
