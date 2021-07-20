// from yelp API
export interface DestinationItemMetadata {
  id: string;
  name: string;
  url: string;
  price: string;
  rating: number;
  review_count: number;
  display_address: string[];
  display_phone: string;
  lastUpdated: number;
}

export interface IDestinationItemPayload extends DestinationItemMetadata {
  timezone: string | null;
  hours: {
    is_open_now: boolean;
    hours_type: string;
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
}

export interface IDestinationSearchPayload {
  total: number;
  items: DestinationItemMetadata[];
}
