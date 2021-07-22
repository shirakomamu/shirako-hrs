import { BusinessIdentifyDto } from "common/dto/items";
import { IDestinationItemPayload } from "common/types/api/items";
import { YELP_BUSINESS_MAX_AGE } from "server/config/yelp";
import { DI } from "server/middleware/initializeDi";
import { SrkCookie } from "server/services/jwt";
import businessIdentifyCached from "server/services/yelp/businessIdentifyCached";
import zipToTz from "server/services/zip-to-tz";
// import cityTimezones from "city-timezones";

export default async (
  _authResult: SrkCookie,
  { id }: BusinessIdentifyDto
): Promise<IDestinationItemPayload> => {
  const repo = DI.destinationItemRepo;
  let item = await repo.findOne({ yelpId: id });

  if (
    !item ||
    item.updatedAt.getTime() <
      Date.now() - YELP_BUSINESS_MAX_AGE * 24 * 60 * 60 * 1000
  ) {
    const r = await businessIdentifyCached({ id });

    const timezone = zipToTz(r.location.zip_code);

    item = repo.create({
      yelpId: r.id,
      name: r.name,
      image_url: r.image_url,
      url: r.url,
      price: r.price || "n/a",
      rating: r.rating,
      review_count: r.review_count,
      display_address: r.location.display_address,
      display_phone: r.display_phone,
      timezone,
      hours: r.hours,
      special_hours: r.special_hours,
    });

    await repo.persistAndFlush(item);
  }

  return {
    id: item.yelpId,
    name: item.name,
    image_url: item.image_url,
    url: item.url,
    price: item.price,
    rating: item.rating,
    review_count: item.review_count,
    display_address: item.display_address,
    display_phone: item.display_phone,
    lastUpdated: item.updatedAt.getTime(),
    timezone: item.timezone,
    hours: item.hours,
    special_hours: item.special_hours,
  };
};
