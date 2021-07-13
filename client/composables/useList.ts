import { useAsync, useContext } from "@nuxtjs/composition-api";
import uniqueId from "common/utils/uniqueId";
import getDestinationList from "./base/getDestinationList";
import useInternalApi from "./useInternalApi";
import useUser from "./useUser";

const useList = ({ username, id }: { username: string; id: string }) => {
  const context = useContext();
  const user = useUser();
  const api = useInternalApi();

  return useAsync(async () => {
    if (user.value?.username === username && id === "new") {
      return null;
    }
    if (id === "new") {
      context.error({
        statusCode: 404,
        message: "You are unauthorized.",
      });
    }
    const r = await getDestinationList(api, username, id);

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

export default useList;
