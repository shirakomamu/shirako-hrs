import { Destination } from "server/entities/Destination";

const mapItems = (items: Destination[]) => {
  return items.map((e) => ({
    id: e.yelpId,
    name: e.name,
    url: e.url,
    price: e.price,
    rating: e.rating,
    review_count: e.review_count,
    display_address: e.display_address,
    display_phone: e.display_phone,
    lastUpdated: e.updatedAt.getTime(),
    timezone: e.timezone,
    hours: e.hours,
    special_hours: e.special_hours,
  }));
};

export default mapItems;
