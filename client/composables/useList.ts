import { useAsync, useContext, useStore } from "@nuxtjs/composition-api";
import { DestinationListModel } from "client/models";
import uniqueId from "common/utils/uniqueId";
import useSelf from "./useSelf";

const useList = ({ username, id }: { username: string; id: string }) => {
  const context = useContext();
  const self = useSelf();
  const model = useStore().$db().model(DestinationListModel);

  return useAsync(async () => {
    if (self.value?.username === username && id === "new") {
      return null;
    }
    if (id === "new") {
      context.error({
        statusCode: 404,
      });
    }
    const r = await model.apiFetch({ username, id });

    if (!r) {
      context.error({
        statusCode: 404,
      });
    }

    return r;
  }, uniqueId());
};

export default useList;
