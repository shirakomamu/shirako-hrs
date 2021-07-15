import { ListVisibility } from "common/enums";

export interface DestinationListMetadata {
  id: string;
  name: string;
  owner: string;
  description: string | null;
  visibility: ListVisibility;
}

// from yelp API
export interface DestinationItem {
  id: string;
  // name: string;
  // image: string;
  // url: string;
  // display_address: string[];
  // display_phone: string;
  // price: string; // $$$$
  // hours: {
  //   is_open_now: boolean;
  //   open: {
  //     is_overnight: boolean;
  //     start: string; // 0000
  //     end: string; // 0000
  //     day: number; // 0-6 (Mon - Sun)
  //   }[];
  // }[];
  // special_hours: {
  //   date: string; // yyyy-MM-dd
  //   is_closed: boolean;
  //   is_overnight: boolean;
  //   start: string; // 0000
  //   end: string; // 0000
  // }[];
}

export interface IDestinationListPayload extends DestinationListMetadata {
  items: DestinationItem[];
}
