import { EntitySchema } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";

interface Hour {
  is_open_now: boolean;
  hours_type: string;
  open: {
    is_overnight: boolean;
    start: string; // 0000
    end: string; // 0000
    day: number; // 0-6 (Mon - Sun)
  }[];
}

interface SpecialHour {
  date: string; // yyyy-MM-dd
  is_closed: boolean;
  is_overnight: boolean;
  start: string; // 0000
  end: string; // 0000
}

export class Destination extends BaseEntity {
  yelpId: string;
  name: string;
  url: string;
  image_url: string | null;
  price: string;
  rating: number;
  review_count: number;
  display_address: string[];
  display_phone: string;
  timezone: string | null;
  hours: Hour[];
  special_hours: SpecialHour[];

  constructor(
    yelpId: string,
    name: string,
    url: string,
    image_url: string | null,
    price: string,
    rating: number,
    review_count: number,
    display_address: string[],
    display_phone: string,
    timezone: string | null,
    hours: Hour[],
    special_hours: SpecialHour[]
  ) {
    super();
    this.yelpId = yelpId;
    this.name = name;
    this.image_url = image_url;
    this.url = url;
    this.price = price;
    this.rating = rating;
    this.review_count = review_count;
    this.display_address = display_address;
    this.display_phone = display_phone;
    this.timezone = timezone;
    this.hours = hours;
    this.special_hours = special_hours;
  }
}

export default new EntitySchema<Destination, BaseEntity>({
  class: Destination,
  properties: {
    yelpId: { type: "string", unique: true },
    name: { type: "string" },
    image_url: { type: "string", nullable: true },
    url: { type: "string", length: 512 },
    price: { type: "string" },
    rating: { type: "number" },
    review_count: { type: "number" },
    display_address: { type: "json" },
    display_phone: { type: "string" },
    timezone: { type: "string", nullable: true },
    hours: { type: "json" },
    special_hours: { type: "json" },
  },
});
