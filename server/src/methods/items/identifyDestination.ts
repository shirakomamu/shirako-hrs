import { BusinessIdentifyDto } from "common/dto/items";
import { SrkCookie } from "server/services/jwt";
import businessIdentifyCached from "server/services/yelp/businessIdentifyCached";

export default async (_authResult: SrkCookie, { id }: BusinessIdentifyDto) => {
  return await businessIdentifyCached({ id });
};
