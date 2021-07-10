import { useAsync } from "@nuxtjs/composition-api";
import { IMemberPayload } from "common/types/api/users";
import useInternalApi from "./useInternalApi";

const useMember = ({ username }: { username: string }) => {
  const api = useInternalApi();
  return useAsync<IMemberPayload | null>(async () => {
    const response = await api<IMemberPayload>({
      url: "/api/users/" + username,
    });

    if (response.ok) {
      return response.payload;
    }

    return null;
  }, "useMember");
};

export default useMember;
