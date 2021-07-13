import { useAsync, useContext } from "@nuxtjs/composition-api";
import uniqueId from "common/utils/uniqueId";
import getMemberByUsername from "./base/getMemberByUsername";
import useInternalApi from "./useInternalApi";

const useMember = ({ username }: { username: string }) => {
  const context = useContext();
  const api = useInternalApi();

  return useAsync(async () => {
    const r = await getMemberByUsername(api, username);

    if (r.ok) {
      return r.payload;
    }

    context.error({
      statusCode: 404,
      message: r.error.message || r.error.name || "An error has occurred.",
    });

    return null;
  }, uniqueId());
};

export default useMember;
