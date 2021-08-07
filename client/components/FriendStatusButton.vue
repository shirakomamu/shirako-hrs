<template>
  <div class="space-2">
    <ComboButton
      v-if="friendStatus === FriendStatus.confirmed"
      alt="Remove friend"
      class="bg-red-500 text-white text-sm"
      :loading="isRemoving"
      :disabled="isRemoving"
      @click="onRemove"
    >
      <IconsPersonRemove class="icon-inline" />
      Remove friend</ComboButton
    >
    <template v-else-if="friendStatus === FriendStatus.pendingIncoming">
      <ComboButton
        alt="Accept friend request"
        class="bg-green-600 text-white text-sm"
        :loading="isAdding"
        :disabled="isAdding || isRemoving"
        @click="onAdd"
      >
        <IconsCheck class="icon-inline" />
        Accept friend request</ComboButton
      >

      <ComboButton
        alt="Reject friend request"
        class="bg-red-500 text-white text-sm"
        :loading="isRemoving"
        :disabled="isAdding || isRemoving"
        @click="onRemove"
      >
        <IconsNotInterested class="icon-inline" />
        Reject friend request</ComboButton
      >
    </template>
    <ComboButton
      v-else-if="friendStatus === FriendStatus.pendingOutgoing"
      class="bg-orange-srk text-white text-sm"
      :loading="isRemoving"
      :disabled="isRemoving"
      @click="onRemove"
    >
      <IconsClose class="icon-inline" />
      Cancel pending friend request</ComboButton
    >
    <ComboButton
      v-else-if="isAcceptingFriends && canAddFriends"
      alt="Send friend request"
      class="bg-blue-srk text-white text-sm"
      :loading="isAdding"
      :disabled="isAdding"
      @click="onAdd"
    >
      <IconsPersonAdd class="icon-inline" />
      Send friend request</ComboButton
    >
    <ComboButton
      v-else-if="!canAddFriends"
      class="bg-blue-srk text-white text-sm"
      :disabled="true"
    >
      <IconsPersonAdd class="icon-inline" />
      Email verification required</ComboButton
    >
    <ComboButton
      v-else
      alt="Not accepting friend requests"
      class="bg-blue-srk text-white text-sm"
      :disabled="true"
    >
      <IconsBlock class="icon-inline" />
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
import { FriendModel } from "client/models";

export default defineComponent({
  name: "FriendStatusButton",
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
    const isAdding = ref<boolean>(false);
    const isRemoving = ref<boolean>(false);

    const store = useStore();
    const model = store.$db().model(FriendModel);

    const onAdd = async () => {
      isAdding.value = true;
      await model.apiCreateFriend(props.username);
      isAdding.value = false;
    };
    const onRemove = async () => {
      isRemoving.value = true;
      await model.apiDeleteFriend(props.username);
      isRemoving.value = false;
    };

    return {
      FriendStatus,
      canAddFriends,
      isAdding,
      isRemoving,
      onAdd,
      onRemove,
    };
  },
});
</script>

<style lang="less" scoped></style>
