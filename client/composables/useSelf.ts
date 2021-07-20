import { ActorDto } from "common/dto/auth";
import { computed, useStore } from "@nuxtjs/composition-api";

const useSelf = () => {
  const store = useStore();
  const user = computed<ActorDto | null>(() => store.getters["auth/actor"]);

  return user;
};

export default useSelf;
