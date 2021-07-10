<template>
  <div class="space-y-8">
    <div class="relative flex flex-col flex-grow">
      <div
        class="
          p-contents
          grid grid-cols-1
          sm:grid-cols-2
          gap-8
          items-center
          p-8
        "
      >
        <img
          :src="member.avatar"
          class="profile-avatar rounded-full mx-auto"
          alt="Avatar"
          width="150"
          height="150"
        />
        <div
          class="
            grid grid-cols-1
            text-center
            sm:text-left
            filter
            text-white
            drop-shadow-md
          "
        >
          <p class="text-4xl font-bold">
            {{ member.nickname }}
          </p>
          <p class="opacity-50">@{{ member.username }}</p>
        </div>
      </div>

      <div class="inset-0 absolute overflow-hidden">
        <div
          class="
            p-bg
            inset-0
            w-full
            h-full
            filter
            scale-110
            bg-left bg-no-repeat bg-cover
          "
        />
      </div>
    </div>

    <div
      v-if="!isMe"
      class="flex flex-row justify-end gap-4 text-sm items-center"
    >
      {{
        `${member.nickname} is currently${isFriend ? "" : " not"} your friend.`
      }}
      <ComboButton
        v-if="isFriend"
        alt="Remove friend"
        class="text-sm border border-red-500 text-red-500"
        :loading="isFriendLoading"
        :disabled="isFriendLoading"
      >
        <PersonRemove class="icon-inline" />
        Remove as friend</ComboButton
      >
      <ComboButton
        v-else-if="isAcceptingRequests"
        alt="Send friend request"
        class="text-sm border border-blue-srk text-blue-srk"
        :loading="isFriendLoading"
        :disabled="isFriendLoading"
      >
        <PersonAdd class="icon-inline" />
        Send friend request</ComboButton
      >
      <ComboButton
        v-else
        alt="Not accepting friend requests"
        class="text-sm border border-gray-500 text-gray-500"
        :disabled="true"
      >
        <Block class="icon-inline" />
        Not accepting friend requests</ComboButton
      >
    </div>

    <div class="grid grid-cols-1 gap-4">
      <div class="flex flex-row gap-4 items-center">
        <h6 class="text-2xl dark:text-white">Lists</h6>
        <div class="flex-grow" />
        <nuxt-link
          v-if="isMe && canList"
          :to="`/u/${member.username}/new`"
          custom
        >
          <ComboButton
            alt="New list"
            class="text-sm border border-blue-srk text-blue-srk"
          >
            <PlaylistAdd class="icon-inline" /> New list</ComboButton
          >
        </nuxt-link>
      </div>

      <div
        class="
          grid grid-cols-1
          gap-4
          items-center
          bg-gray-200
          dark:bg-gray-700
          p-8
        "
      >
        <div
          class="
            grid grid-flow-row grid-cols-2
            md:grid-cols-4
            lg:grid-cols-6
            xl:grid-cols-8
            gap-4
            items-center
          "
        >
          <nuxt-link
            v-for="(name, index) in listNameTest"
            :key="index"
            :to="`/u/${member.username}/${name}`"
            custom
          >
            <DestinationListAvatar
              :list-name="name"
              :owner="index.toString()"
            />
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Role } from "common/enums/hrbac";
import { Guard } from "common/types/hrbac";
import {
  defineComponent,
  Ref,
  ref,
  useContext,
  useMeta,
  useRoute,
} from "@nuxtjs/composition-api";
import useMember from "client/composables/useMember";
import Block from "client/components/icons/Block.vue";
import PersonAdd from "client/components/icons/PersonAdd.vue";
import PersonRemove from "client/components/icons/PersonRemove.vue";
import PlaylistAdd from "client/components/icons/PlaylistAdd.vue";
import useUser from "client/composables/useUser";
import hrbacCan from "common/utils/hrbacCan";
import assert from "common/utils/assert";
import { IMemberPayload } from "common/types/api/users";

export default defineComponent({
  meta: {
    guard: {
      roles: [Role._self_profile],
    } as Guard,
  },
  components: {
    Block,
    PersonAdd,
    PersonRemove,
    PlaylistAdd,
  },
  setup() {
    const context = useContext();
    const route = useRoute().value;
    const user = useUser();
    const member = useMember({ username: route.params.username });

    if (!member.value) {
      return context.error({
        statusCode: 404,
        message: "This page cannot be found",
        path: route.path,
      });
    }
    assert<Ref<IMemberPayload>>(member);

    const isMe = member.value.username === user.value?.username;
    const canFriend = hrbacCan({ roles: [Role._self_friends] }, user.value);
    const canList = hrbacCan(
      { roles: [Role._self_destination_lists] },
      user.value
    );
    const isFriend = true;
    const isAcceptingRequests = true;
    const listNameTest = [
      "Hello there",
      "My name is",
      "Shirako",
      "Mamu",
      "Favorites",
      "Hello there",
      "My name is",
      "Shirako",
      "Mamu",
      "Favorites",
      "Hello there",
      "My name is",
      "Shirako",
      "Mamu",
      "Favorites",
      "Hello there",
      "My name is",
      "list-id-test",
      "Mamu",
      "Favorites",
    ];

    const isFriendLoading = ref<boolean>(false);

    useMeta({
      title:
        `${member.value.nickname}'s profile | ` + context.$config.appinfo.name,
    });

    return {
      member,
      isMe,
      isFriend,
      isAcceptingRequests,
      isFriendLoading,

      canFriend,
      canList,

      listNameTest,
    };
  },
  // required for useMeta to work
  head: {},
});
</script>

<style lang="less" scoped>
.p-bg {
  background-image: url("client/assets/images/p1.png");
  filter: blur(24px) brightness(70%);
  z-index: 1;
}
.p-contents {
  z-index: 2;
}
</style>
