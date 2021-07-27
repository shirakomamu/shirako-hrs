<template>
  <div class="gap-2 bg-white bg-opacity-50 dark:bg-opacity-5 p-2 max-w-2xl">
    <div class="flex flex-col sm:flex-row items-center gap-2">
      <div>
        <img
          :src="avatar"
          class="profile-avatar rounded-full"
          alt="Avatar"
          width="32"
          height="32"
        />
      </div>
      <div class="grid grid-cols-1 text-sm text-center sm:text-left">
        <p class="font-semibold truncate">
          {{ nickname }}
        </p>
        <nuxt-link
          :to="`/u/${username}`"
          class="opacity-50 hover:underline focus:underline truncate"
          >@{{ username }}</nuxt-link
        >
      </div>

      <div class="flex-grow" />
      <ComboButton
        v-if="mode === FriendStatus.confirmed"
        class="bg-red-500 text-white text-sm w-full sm:w-auto flex-shrink-0"
        alt="Remove friend"
        :loading="isLoading"
        :disabled="isLoading"
        @click="onRemove"
        ><PersonRemove class="icon-inline" /> Remove</ComboButton
      >
      <ComboButton
        v-if="mode === FriendStatus.pendingIncoming"
        class="bg-green-600 text-white text-sm w-full sm:w-auto flex-shrink-0"
        alt="Accept friend request"
        :loading="isLoading"
        :disabled="isLoading"
        @click="onAdd"
        ><Check class="icon-inline" /> Accept</ComboButton
      >
      <ComboButton
        v-if="mode === FriendStatus.pendingIncoming"
        class="bg-red-500 text-white text-sm w-full sm:w-auto flex-shrink-0"
        alt="Reject friend request"
        :loading="isLoading"
        :disabled="isLoading"
        @click="onRemove"
        ><NotInterested class="icon-inline" /> Reject</ComboButton
      >
      <ComboButton
        v-if="mode === FriendStatus.pendingOutgoing"
        class="bg-orange-srk text-white text-sm w-full sm:w-auto flex-shrink-0"
        alt="Cancel friend request"
        :loading="isLoading"
        :disabled="isLoading"
        @click="onRemove"
        ><Close class="icon-inline" /> Cancel</ComboButton
      >
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  useStore,
} from "@nuxtjs/composition-api";
import Check from "client/components/icons/Check.vue";
import Close from "client/components/icons/Close.vue";
import NotInterested from "client/components/icons/NotInterested.vue";
import PersonRemove from "client/components/icons/PersonRemove.vue";
import { FriendModel } from "client/models";
import { FriendStatus } from "common/enums";

export default defineComponent({
  name: "FriendDisplayConfirmed",
  components: { Check, Close, NotInterested, PersonRemove },
  props: {
    username: {
      type: String,
      required: true,
    },
    nickname: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    mode: {
      type: String as PropType<FriendStatus>,
      default: "",
    },
  },
  setup(props) {
    const store = useStore();
    const model = store.$db().model(FriendModel);

    const onAdd = async () => {
      isLoading.value = true;
      await model.apiCreateFriend(props.username);
      isLoading.value = false;
    };
    const onRemove = async () => {
      isLoading.value = true;
      await model.apiDeleteFriend(props.username);
      isLoading.value = false;
    };

    const isLoading = ref<boolean>(false);

    return { FriendStatus, onAdd, onRemove, isLoading };
  },
});
</script>

<style lang="less" scoped></style>
