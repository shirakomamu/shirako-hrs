import { send } from ".";

export interface BusinessSearchResponse {
  total: number;
  businesses: [
    {
      rating: number;
      price: string;
      phone: string;
      id: string;
      alias: string;
      is_closed: false;
      categories: {
        alias: string;
        title: string;
      }[];
      review_count: number;
      name: string;
      url: string;
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
    },
  });

  return response;
};
