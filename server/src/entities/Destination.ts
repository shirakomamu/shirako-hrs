import { ArrayType, EntitySchema } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";

interface Hour {
  is_open_now: boolean;
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
  price: string;
  rating: number;
  review_count: number;
  display_address: string[];
  display_phone: string;
  hours: Hour[];
  special_hours: SpecialHour[];

  constructor(
    yelpId: string,
    name: string,
    url: string,
    price: string,
    rating: number,
    review_count: number,
    display_address: string[],
    display_phone: string,
    hours: Hour[],
    special_hours: SpecialHour[]
  ) {
    super();
    this.yelpId = yelpId;
    this.name = name;
    this.url = url;
    this.price = price;
    this.rating = rating;
    this.review_count = review_count;
    this.display_address = display_address;
    this.display_phone = display_phone;
    this.hours = hours;
    this.special_hours = special_hours;
  }
}

export default new EntitySchema<Destination, BaseEntity>({
  class: Destination,
  properties: {
    yelpId: { type: "string", unique: true },
    name: { type: "string" },
    url: { type: "string" },
    price: { type: "string" },
    rating: { type: "number" },
    review_count: { type: "number" },
    display_address: { type: ArrayType },
    display_phone: { type: "number" },
    hours: { type: ArrayType },
    special_hours: { type: ArrayType },
  },
});
