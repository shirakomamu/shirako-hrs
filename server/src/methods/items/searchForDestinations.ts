import { BusinessSearchDto } from "common/dto/items";
import { IDestinationSearchPayload } from "common/types/api/items";
import { DI } from "server/middleware/initializeDi";
import { SrkCookie } from "server/services/jwt";
import businessSearchCached from "server/services/yelp/businessSearchCached";

export default async (
  _authResult: SrkCookie,
  { location, term }: BusinessSearchDto
): Promise<IDestinationSearchPayload> => {
  const r = await businessSearchCached({ location, term });

  const items = await DI.destinationItemRepo.find({
    yelpId: {
      $in: r.businesses.map((e) => e.id),
    },
  });

  return {
    total: r.total,
    items: r.businesses.map((e) => ({
      id: e.id,
      name: e.name,
      url: e.url,
      price: e.price || "n/a",
      rating: e.rating,
      review_count: e.review_count,
      display_address: e.location.display_address,
      display_phone: e.display_phone,
      lastUpdated:
        items.find((f) => f.yelpId === e.id)?.updatedAt.getTime() || -1,
    })),
  };
};
