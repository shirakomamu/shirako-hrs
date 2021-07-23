import { IDestinationItemPayload } from "common/types/api/items";
import { YELP_BUSINESS_MAX_AGE } from "server/config/yelp";
import { DI } from "server/middleware/initializeDi";
import { SrkCookie } from "server/services/jwt";
import { BusinessIdentifyResponse } from "server/services/yelp/businessIdentify";
import businessIdentifyCached from "server/services/yelp/businessIdentifyCached";
import zipToTz from "server/services/zip-to-tz";
// import cityTimezones from "city-timezones";

export default async (
  _authResult: SrkCookie,
  ids: string[]
): Promise<IDestinationItemPayload[]> => {
  const repo = DI.destinationItemRepo;
  const items = await repo.find({
    yelpId: {
      $in: ids,
    },
  });

  const unidentifiedIds: string[] = [];
  const oldIds: string[] = [];
  const identifiedItems: IDestinationItemPayload[] = [];
  const resolvedIds = items.map((e) => e.yelpId);
  for (const id of ids) {
    // if it's not in db, then it needs to be resolved
    if (!resolvedIds.includes(id)) {
      unidentifiedIds.push(id);
      continue;
    }

    const item = items.find((e) => e.yelpId === id);

    if (!item) {
      continue;
    }

    // if it's old, it also needs to be resolved
    if (
      item.updatedAt.getTime() <
      Date.now() - YELP_BUSINESS_MAX_AGE * 24 * 60 * 60 * 1000
    ) {
      oldIds.push(id);
      continue;
    }

    identifiedItems.push({
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
    });
  }

  if (unidentifiedIds.length || oldIds.length) {
    const identificationResults = await Promise.allSettled(
      [...unidentifiedIds, ...oldIds].map((e) =>
        businessIdentifyCached({ id: e })
      )
    );

    const successfulNewResults: BusinessIdentifyResponse[] = [];
    const successfulUpdateResults: BusinessIdentifyResponse[] = [];

    for (const result of identificationResults) {
      if (result.status === "fulfilled") {
        if (unidentifiedIds.includes(result.value.id)) {
          successfulNewResults.push(result.value);
        } else if (oldIds.includes(result.value.id)) {
          successfulUpdateResults.push(result.value);
        }
      }
    }

    const newDestinations = successfulNewResults.map((r) => {
      const timezone = zipToTz(r.location.zip_code);

      const result = {
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
      };

      return repo.create(result);
    });

    const updateDestinations = await repo.find({
      yelpId: {
        $in: successfulUpdateResults.map((e) => e.id),
      },
    });

    for (const destination of updateDestinations) {
      const result = successfulUpdateResults.find(
        (e) => e.id === destination.yelpId
      );
      if (!result) continue;

      const timezone = zipToTz(result.location.zip_code);

      destination.name = result?.name;
      destination.image_url = result.image_url;
      destination.url = result.url;
      destination.price = result.price || "n/a";
      destination.rating = result.rating;
      destination.review_count = result.review_count;
      destination.display_address = result.location.display_address;
      destination.display_phone = result.display_phone;
      destination.timezone = timezone;
      destination.hours = result.hours;
      destination.special_hours = result.special_hours;
    }

    await repo.persistAndFlush([...newDestinations, ...updateDestinations]);

    identifiedItems.push(
      ...[...newDestinations, ...updateDestinations].map((item) => ({
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
      }))
    );
  }

  return identifiedItems;
};
