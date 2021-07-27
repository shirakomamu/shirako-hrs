<template>
  <div class="space-2">
    <ComboButton
      v-if="friendStatus === FriendStatus.confirmed"
      alt="Remove friend"
      class="bg-red-500 text-white text-sm"
      :loading="isLoading"
      :disabled="isLoading"
      @click="onRemove"
    >
      <PersonRemove class="icon-inline" />
      Remove friend</ComboButton
    >
    <template v-else-if="friendStatus === FriendStatus.pendingIncoming">
      <ComboButton
        alt="Accept friend request"
        class="bg-green-600 text-white text-sm"
        :loading="isLoading"
        :disabled="isLoading"
        @click="onAdd"
      >
        <Check class="icon-inline" />
        Accept friend request</ComboButton
      >

      <ComboButton
        alt="Reject friend request"
        class="bg-red-500 text-white text-sm"
        :loading="isLoading"
        :disabled="isLoading"
        @click="onRemove"
      >
        <NotInterested class="icon-inline" />
        Reject friend request</ComboButton
      >
    </template>
    <ComboButton
      v-else-if="friendStatus === FriendStatus.pendingOutgoing"
      class="bg-orange-srk text-white text-sm"
      :loading="isLoading"
      :disabled="isLoading"
      @click="onRemove"
    >
      <Close class="icon-inline" />
      Cancel pending friend request</ComboButton
    >
    <ComboButton
      v-else-if="isAcceptingFriends && canAddFriends"
      alt="Send friend request"
      class="bg-blue-srk text-white text-sm"
      :loading="isLoading"
      :disabled="isLoading"
      @click="onAdd"
    >
      <PersonAdd class="icon-inline" />
      Send friend request</ComboButton
    >
    <ComboButton
      v-else-if="!canAddFriends"
      class="bg-blue-srk text-white text-sm"
      :disabled="true"
    >
      <PersonAdd class="icon-inline" />
      Email verification required</ComboButton
    >
    <ComboButton
      v-else
      alt="Not accepting friend requests"
      class="bg-blue-srk text-white text-sm"
      :disabled="true"
    >
      <Block class="icon-inline" />
      Not accepting friend requests</ComboButton
    >
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  useStore,
} from "@nuxtjs/composition-api";
import useSelf from "client/composables/useSelf";
import { FriendStatus } from "common/enums";
import { Role } from "common/enums/hrbac";
import hrbacCan from "common/utils/hrbacCan";
import Check from "client/components/icons/Check.vue";
import Close from "client/components/icons/Close.vue";
import NotInterested from "client/components/icons/NotInterested.vue";
import PersonAdd from "client/components/icons/PersonAdd.vue";
import PersonRemove from "client/components/icons/PersonRemove.vue";
import { FriendModel } from "client/models";

export default defineComponent({
  name: "FriendStatusButton",
  components: {
    Check,
    Close,
    NotInterested,
    PersonAdd,
    PersonRemove,
  },
  props: {
    username: {
      type: String,
      required: true,
    },
    friendStatus: {
      type: String as PropType<FriendStatus>,
      default: null,
    },
    isAcceptingFriends: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const self = useSelf();
    const canAddFriends = hrbacCan({ roles: [Role._self_friends] }, self.value);
    const isLoading = ref<boolean>(false);

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

    return { FriendStatus, canAddFriends, isLoading, onAdd, onRemove };
  },
});
</script>

<style lang="less" scoped></style>