import { useAsync, useContext, useStore } from "@nuxtjs/composition-api";
import { MemberModel } from "client/models";
import uniqueId from "common/utils/uniqueId";

const useMember = ({ username }: { username: string }) => {
  const context = useContext();
  const model = useStore().$db().model(MemberModel);

  return useAsync(async () => {
    const r = await model.apiFetch(username);

    if (!r) {
      context.error({
        statusCode: 404,
      });
    }

    return r;
  }, uniqueId());
};

export default useMember;
