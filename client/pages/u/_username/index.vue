<template>
  <div :key="route.params.username" class="space-y-8">
    <template v-if="member">
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
          `${member.nickname} is currently${
            isFriend ? "" : " not"
          } your friend.`
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
            v-if="
              (destinationLists && destinationLists.length) || (isMe && canList)
            "
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
              v-if="isMe && canList"
              key="new"
              :to="`/u/${route.params.username}/new`"
              custom
            >
              <DestinationListAddAvatar />
            </nuxt-link>
            <template v-if="destinationLists && destinationLists.length">
              <nuxt-link
                v-for="(list, index) in destinationLists"
                :key="index"
                :to="`/u/${route.params.username}/${list.id}`"
                custom
              >
                <DestinationListAvatar
                  :list-name="list.name"
                  :owner="list.owner"
                />
              </nuxt-link>
            </template>
          </div>
          <div v-else class="grid grid-flow-row grid-cols-1 gap-4 items-center">
            <p>No lists available.</p>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="grid grid-cols-1 place-items-center">
        <Loader class="loading text-blue-srk" />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Role } from "common/enums/hrbac";
import { Guard } from "common/types/hrbac";
import {
  computed,
  defineComponent,
  ref,
  useContext,
  useMeta,
  useRoute,
  useStore,
  watch,
} from "@nuxtjs/composition-api";
import hrbacCan from "common/utils/hrbacCan";
import Loader from "client/components/icons/Loader.vue";
import useMember from "client/composables/useMember";
import Block from "client/components/icons/Block.vue";
import PersonAdd from "client/components/icons/PersonAdd.vue";
import PersonRemove from "client/components/icons/PersonRemove.vue";
import useSelf from "client/composables/useSelf";
import { MemberModel } from "client/models";

export default defineComponent({
  meta: {
    guard: {
      roles: [Role._self_profile],
    } as Guard,
  },
  components: {
    Block,
    Loader,
    PersonAdd,
    PersonRemove,
  },
  setup() {
    const context = useContext();
    const route = useRoute();
    const self = useSelf();
    const store = useStore();
    const model = store.$db().model(MemberModel);

    const member = useMember({
      username: route.value.params.username,
    });

    watch(
      () => route.value.params.username,
      async (value: string) => {
        member.value = null;
        const r = await model.apiFetch(value);

        if (!r) {
          return context.error({ statusCode: 404 });
        }

        member.value = r;
      }
    );

    const isFriend = computed(() => member.value?.isFriend);
    const isAcceptingRequests = computed(
      () => member.value?.isAcceptingFriends
    );
    const destinationLists = computed(() => member.value?.lists);

    // self functions
    const isMe = computed(
      () => member.value?.username === self.value?.username
    );
    const canFriend = hrbacCan({ roles: [Role._self_friends] }, self.value);
    const canList = hrbacCan(
      { roles: [Role._self_destination_lists] },
      self.value
    );

    const isFriendLoading = ref<boolean>(false);

    const title = computed(
      () =>
        (member.value
          ? `${member.value.nickname}'s profile | `
          : "Loading... | ") + context.$config.appinfo.name
    );
    useMeta({
      title: title.value,
    });

    return {
      route,

      member,
      isMe,
      isFriend,
      isAcceptingRequests,
      isFriendLoading,

      canFriend,
      canList,

      destinationLists,
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
.loading {
  height: 4rem;
  width: 4rem;
}
</style>
