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
          <ImageFader
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
              p-bg-text
            "
          >
            <p class="text-4xl font-bold">
              {{ member.nickname }}
            </p>
            <p class="font-semibold">@{{ member.username }}</p>
          </div>
        </div>

        <div class="inset-0 absolute overflow-hidden">
          <div class="p-bg w-full h-full bg-gray-200 dark:bg-gray-700">
            <ImageFader
              v-if="p[0]"
              class="
                w-full
                h-full
                object-cover
                filter
                blur-2xl
                transform-gpu
                scale-110
              "
              src="@/assets/images/p1.png"
            />
            <ImageFader
              v-if="p[1]"
              class="
                w-full
                h-full
                object-cover
                filter
                blur-2xl
                transform-gpu
                scale-110
              "
              src="@/assets/images/p2.png"
            />
            <ImageFader
              v-if="p[2]"
              class="
                w-full
                h-full
                object-cover
                filter
                blur-2xl
                transform-gpu
                scale-110
              "
              src="@/assets/images/p3.png"
            />
          </div>
        </div>
      </div>

      <div
        v-if="!isMe"
        class="flex flex-row justify-end gap-4 text-sm items-center"
      >
        <FriendStatusButton
          :username="member.username"
          :friend-status="friendStatus"
          :is-accepting-friends="member.isAcceptingFriends"
        />
      </div>

      <div class="grid grid-cols-1 gap-4">
        <div class="flex flex-row gap-4 items-center">
          <h6 class="text-2xl dark:text-white">
            <List class="icon-inline" /> Lists
          </h6>
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
            v-if="(destinationLists && destinationLists.length) || isMe"
            class="
              grid grid-cols-1
              sm:grid-cols-2
              md:grid-cols-4
              lg:grid-cols-6
              xl:grid-cols-8
              gap-4
            "
          >
            <ComboButton
              v-if="isMe && canCreateList"
              key="new"
              class="p-0 h-full w-full bg-blue-srk text-white font-semibold"
              alt="Create list"
              @click="onShowCreateListModal"
            >
              <DestinationListAddAvatar />
            </ComboButton>
            <nuxt-link
              v-else-if="isMe && !canCreateList"
              v-slot="{ navigate }"
              key="verifRequired"
              to="/settings"
              custom
            >
              <ComboButton
                class="p-0 h-full w-full"
                alt="Email verification required"
                @click="navigate"
              >
                <DestinationListAddAvatarDisabled />
              </ComboButton>
            </nuxt-link>
            <template v-if="destinationLists && destinationLists.length">
              <nuxt-link
                v-for="(list, index) in destinationLists"
                v-slot="{ navigate }"
                :key="index"
                :to="`/u/${route.params.username}/${list.id}`"
                custom
              >
                <ComboButton
                  class="p-0 h-full w-full"
                  :alt="list.name"
                  @click="navigate"
                >
                  <DestinationListAvatar>
                    <div
                      class="
                        relative
                        grid grid-cols-1
                        items-center
                        justify-items-center
                        h-full
                        w-full
                        py-8
                      "
                    >
                      <p class="text-sm font-semibold">{{ list.name }}</p>
                      <ListVisibilityIndicator
                        :visibility="list.visibility"
                        class="absolute left-0 bottom-0"
                      />
                    </div>
                  </DestinationListAvatar>
                </ComboButton>
              </nuxt-link>
            </template>
          </div>
          <div v-else class="grid grid-flow-row grid-cols-1 gap-4 items-center">
            <p>No lists available.</p>
          </div>
        </div>
      </div>

      <div v-if="isMe" class="grid grid-cols-1 gap-4">
        <div class="flex flex-row gap-4 items-center">
          <h6 class="text-2xl dark:text-white">
            <People class="icon-inline" /> Friends
          </h6>
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
          <div class="flex flex-row w-full sm:w-auto gap-2">
            <TabSelector
              tab-id="friends"
              tab-name="Friends"
              :selected="selectedTab === 'friends'"
              @pick="onPickTab"
            />
            <TabSelector
              :badge-number="pendingIncomingFriends.length"
              tab-id="pending"
              tab-name="Pending"
              :selected="selectedTab === 'pending'"
              @pick="onPickTab"
            />
          </div>
          <hr />
          <div v-if="selectedTab === 'friends'" class="grid grid-cols-1 gap-2">
            <p v-if="!confirmedFriends.length" class="italic">
              No friends right now.
            </p>
            <FriendDisplay
              v-for="(friend, index) of confirmedFriends"
              :key="'friend-confirmed-' + index"
              :username="friend.member.username"
              :nickname="friend.member.nickname"
              :mode="FriendStatus.confirmed"
            />
          </div>
          <div
            v-if="selectedTab === 'pending'"
            class="grid grid-cols-1 lg:grid-cols-2 gap-4"
          >
            <div class="space-y-2 text-center sm:text-left">
              <p class="font-semibold">Incoming requests</p>
              <p v-if="!pendingIncomingFriends.length" class="italic">
                No incoming requests.
              </p>
              <FriendDisplay
                v-for="(friend, index) of pendingIncomingFriends"
                :key="'friend-pending-in-' + index"
                :username="friend.member.username"
                :nickname="friend.member.nickname"
                :mode="FriendStatus.pendingIncoming"
              />
            </div>
            <div class="space-y-2 text-center sm:text-left">
              <p class="font-semibold">Outgoing requests</p>
              <p v-if="!pendingOutgoingFriends.length" class="italic">
                No outgoing requests.
              </p>
              <FriendDisplay
                v-for="(friend, index) of pendingOutgoingFriends"
                :key="'friend-pending-out-' + index"
                :username="friend.member.username"
                :nickname="friend.member.nickname"
                :mode="FriendStatus.pendingOutgoing"
              />
            </div>
          </div>
        </div>

        <!-- Friends list Show confirmed in one tab (with remove button) Show pending
        (outgoing / incoming) to accept / cancel -->
      </div>

      <CreateListModal
        :visible="isCreateListModalVisible"
        @hide="isCreateListModalVisible = false"
      />
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
  onMounted,
  ref,
  useContext,
  useMeta,
  useRoute,
  useStore,
  watch,
} from "@nuxtjs/composition-api";
import hrbacCan from "common/utils/hrbacCan";
import useMember from "client/composables/useMember";
import List from "client/components/icons/List.vue";
import Loader from "client/components/icons/Loader.vue";
import People from "client/components/icons/People.vue";
import useSelf from "client/composables/useSelf";
import { FriendModel, MemberModel } from "client/models";
import { FriendStatus } from "common/enums";

export default defineComponent({
  meta: {
    guard: {
      roles: [Role._self_profile],
    } as Guard,
  },
  components: {
    List,
    Loader,
    People,
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
      async (value: string, oldValue: string) => {
        if (value.toLowerCase() === oldValue.toLowerCase()) return;
        member.value = null;
        const r = await model.apiFetch(value);

        if (!r) {
          return context.error({ statusCode: 404 });
        }

        member.value = r;
      }
    );

    const isAcceptingFriends = computed(() => member.value?.isAcceptingFriends);
    const destinationLists = computed(() => member.value?.lists);

    // self functions
    const isMe = computed(
      () => route.value.params.username === self.value?.username
    );
    const canAddFriends = computed(() =>
      hrbacCan({ roles: [Role._self_friends] }, self.value)
    );
    const canCreateList = computed(() =>
      hrbacCan({ roles: [Role._self_destination_lists] }, self.value)
    );
    // const canCreateList = false;

    const isFriendLoading = ref<boolean>(false);

    useMeta(() => ({
      title:
        (member.value
          ? `${member.value.nickname}'s profile | `
          : "Loading... | ") + context.$config.appinfo.name,
    }));

    // used for randomly selecting the background
    const pIndex = ref<number | null>(null);
    const p = computed(() => {
      return [false, false, false].map((_e, i) => pIndex.value === i);
    });

    const friendModel = store.$db().model(FriendModel);
    const friendStatus = computed(
      () => friendModel.find(member.value?.username || "")?.status
    );
    const allFriends = computed(() => friendModel.query().with("member").all());
    const confirmedFriends = computed(() =>
      allFriends.value.filter((e) => e.status === FriendStatus.confirmed)
    );
    const pendingOutgoingFriends = computed(() =>
      allFriends.value.filter((e) => e.status === FriendStatus.pendingOutgoing)
    );
    const pendingIncomingFriends = computed(() =>
      allFriends.value.filter((e) => e.status === FriendStatus.pendingIncoming)
    );

    onMounted(() => {
      pIndex.value = Math.floor(Math.random() * p.value.length);
    });

    const isCreateListModalVisible = ref<boolean>(false);
    const onShowCreateListModal = () => {
      isCreateListModalVisible.value = true;
    };

    const selectedTab = ref<string>("friends");
    const onPickTab = (tabId: string) => (selectedTab.value = tabId);

    return {
      route,
      pIndex,
      p,
      // pBgBackgroundUrl,

      member,
      isMe,
      friendStatus,
      isAcceptingFriends,
      isFriendLoading,

      canAddFriends,
      canCreateList,

      destinationLists,

      isCreateListModalVisible,
      onShowCreateListModal,

      confirmedFriends,
      pendingOutgoingFriends,
      pendingIncomingFriends,

      selectedTab,
      onPickTab,

      FriendStatus,
    };
  },
  // required for useMeta to work
  head: {},
});
</script>

<style lang="less" scoped>
.p-bg {
  z-index: 1;
  // &.p1 {
  //   background-image: url("client/assets/images/p1.png");
  //   opacity: 1;
  // }
  // &.p2 {
  //   background-image: url("client/assets/images/p2.png");
  //   opacity: 1;
  // }
  // &.p3 {
  //   background-image: url("client/assets/images/p3.png");
  //   opacity: 1;
  // }
}
.p-bg-text {
  // --tw-drop-shadow: drop-shadow(0 10px 8px rgba(0, 0, 0, 0.3))
  //   drop-shadow(0 4px 3px rgba(0, 0, 0, 0.4));
  // text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2), 2px -2px 2px rgba(0, 0, 0, 0.2),
  //   -2px 2px 2px rgba(0, 0, 0, 0.2), -2px -2px 2px rgba(0, 0, 0, 0.2);
  text-shadow: 0px 0px 5px rgba(0, 0, 0, 0.6);
}
.p-contents {
  z-index: 2;
}
.loading {
  height: 4rem;
  width: 4rem;
}
</style>
