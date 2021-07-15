import { BusinessSearchDto } from "common/dto/items";
import { SrkCookie } from "server/services/jwt";
import businessSearchCached from "server/services/yelp/businessSearchCached";

export default async (
  _authResult: SrkCookie,
  { location, term }: BusinessSearchDto
) => {
  return await businessSearchCached({ location, term });
};
