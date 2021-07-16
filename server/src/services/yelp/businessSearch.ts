import { send } from ".";

export interface BusinessSearchResponse {
  total: number;
  businesses: [
    {
      id: string;
      name: string;
      url: string;
      price?: string;
      rating: number;
      phone: string;
      display_phone: string;
      alias: string;
      is_closed: false;
      categories: {
        alias: string;
        title: string;
      }[];
      review_count: number;
      coordinates: {
        latitude: number;
        longitude: number;
      };
      image_url: string;
      location: {
        address1: string;
        address2: string;
        address3: string;
        city: string;
        zip_code: string;
        country: string;
        state: string;
        display_address: string[];
      };
      distance: number;
      transactions: ("pickup" | "delivery" | "restaurant_reservation")[];
    }
  ];
  region: {
    center: {
      latitude: number;
      longitude: number;
    };
  };
}

export default async ({
  term,
  location,
}: {
  term: string;
  location: string;
}) => {
  const ENDPOINT = "businesses/search";

  const response = await send<BusinessSearchResponse>(ENDPOINT, {
    method: "get",
    params: {
      term,
      location,
      categories: "restaurants",
    },
  });

  return response;
};
