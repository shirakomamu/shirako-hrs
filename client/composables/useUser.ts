import { ActorDto } from "common/dto/auth";
import { computed, useStore } from "@nuxtjs/composition-api";

const useUser = () => {
  const store = useStore();
  const user = computed<ActorDto | null>(() => store.getters["auth/actor"]);

  return user;
};

export default useUser;
