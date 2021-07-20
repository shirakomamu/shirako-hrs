import { useAsync, useContext, useStore } from "@nuxtjs/composition-api";
import { DestinationListModel } from "client/models";
import uniqueId from "common/utils/uniqueId";

const useList = ({ username, id }: { username: string; id: string }) => {
  const context = useContext();
  const model = useStore().$db().model(DestinationListModel);

  return useAsync(async () => {
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
