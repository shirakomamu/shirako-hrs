import lucene from "lucene-query-string-builder";
import SrkError from "server/classes/SrkError";
import { GetUserResponse } from "./getUser";
import { send } from ".";

export default async (username: string) => {
  const ENDPOINT = "api/v2/users"; // added onto issuer base url

  // https://www.lucenetutorial.com/lucene-query-syntax.html
  const params = {
    q: lucene.field("username", lucene.term(username)),
    per_page: 1,
  };

  try {
    const response = await send<GetUserResponse[]>(ENDPOINT, {
      method: "get",
      params,
    });

    const user = response.find((e) => e.username === username);

    if (!user) {
      throw new SrkError("resourceInvalid");
    }

    return user;
  } catch (e) {
    throw new SrkError("resourceInvalid");
  }
};

const searchForUsersByUsername = async (username: string) => {
  const ENDPOINT = "api/v2/users"; // added onto issuer base url

  // https://www.lucenetutorial.com/lucene-query-syntax.html
  const params = {
    q: lucene.field("username", `*${username}*`),
    per_page: 5,
  };

  try {
    return await send<GetUserResponse[]>(ENDPOINT, {
      method: "get",
      params,
    });
  } catch (e) {
    return [];
  }
};

const searchForUsersByUsernameOrNickname = async (keyword: string) => {
  const ENDPOINT = "api/v2/users"; // added onto issuer base url

  // https://www.lucenetutorial.com/lucene-query-syntax.html
  const params = {
    q: lucene.or(
      lucene.field("username", `*${keyword}*^4`),
      lucene.field("nickname", `*${keyword}*`)
    ),
    per_page: 5,
  };

  try {
    return await send<GetUserResponse[]>(ENDPOINT, {
      method: "get",
      params,
    });
  } catch (e) {
    return [];
  }
};

export { searchForUsersByUsername, searchForUsersByUsernameOrNickname };
