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
            <p class="opacity-50">@{{ member.username }}</p>
          </div>
        </div>

        <div class="inset-0 absolute overflow-hidden">
          <div class="p-bg inset-0 w-full h-full bg-gray-200 dark:bg-gray-700">
            <ImageFader
              v-if="p[0]"
              class="
                inset-0
                w-full
                h-full
                object-cover
                filter
                blur-xl
                transform-gpu
                scale-110
              "
              src="/images/p1.png"
            />
            <ImageFader
              v-if="p[1]"
              class="
                inset-0
                w-full
                h-full
                object-cover
                filter
                blur-xl
                transform-gpu
                scale-110
              "
              src="/images/p2.png"
            />
            <ImageFader
              v-if="p[2]"
              class="
                inset-0
                w-full
                h-full
                object-cover
                filter
                blur-xl
                transform-gpu
                scale-110
              "
              src="/images/p3.png"
            />
          </div>
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
          v-else-if="isAcceptingRequests && canAddFriends"
          alt="Send friend request"
          class="text-sm border border-blue-srk text-blue-srk"
          :loading="isFriendLoading"
          :disabled="isFriendLoading"
        >
          <PersonAdd class="icon-inline" />
          Send friend request</ComboButton
        >
        <ComboButton
          v-else-if="!canAddFriends"
          class="text-sm border border-blue-srk text-blue-srk"
          :disabled="true"
        >
          <PersonAdd class="icon-inline" />
          Email verification required</ComboButton
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
              (destinationLists && destinationLists.length) || canCreateList
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
            <ComboButton
              v-if="isMe && canCreateList"
              key="new"
              class="p-0"
              alt="Create list"
              @click="onShowCreateListModal"
            >
              <DestinationListAddAvatar />
            </ComboButton>
            <nuxt-link
              v-else-if="isMe && !canCreateList"
              key="verifRequired"
              to="/settings"
              custom
            >
              <ComboButton
                class="p-0 h-full w-full"
                alt="Email verification required"
              >
                <DestinationListAddAvatarDisabled />
              </ComboButton>
            </nuxt-link>
            <template v-if="destinationLists && destinationLists.length">
              <nuxt-link
                v-for="(list, index) in destinationLists"
                :key="index"
                :to="`/u/${route.params.username}/${list.id}`"
                custom
              >
                <ComboButton class="p-0 h-full w-full" :alt="list.name">
                  <DestinationListAvatar>
                    <div
                      class="
                        relative
                        grid grid-cols-1
                        items-center
                        justify-items-center
                        h-full
                      "
                    >
                      <p class="text-sm font-semibold">{{ list.name }}</p>
                      <ListVisibilityIndicator
                        :visibility="list.visibility"
                        class="absolute -left-2 -bottom-1"
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

      <Modal
        :visible="showCreateListModal"
        container-class="p-8 w-full max-w-prose"
        @hide="showCreateListModal = false"
      >
        <form
          class="p-8 bg-gray-200 dark:bg-gray-700 grid grid-cols-1 gap-4"
          @submit.prevent="onCreate"
        >
          <h6 class="text-2xl dark:text-white">Create new list</h6>
          <div
            class="
              grid grid-cols-1
              gap-4
              items-center
              bg-gray-200
              dark:bg-gray-700
            "
          >
            <Input
              ref="listNameInput"
              v-model="formListName"
              type="text"
              passive-text="Choose a descriptive name. It must be 1 to 24 characters long."
              label="Name"
              class="w-full"
              classes="p-2 text-sm w-full"
              minlength="1"
              maxlength="24"
              :do-validation="true"
              required
            />

            <div class="grid grid-cols-1 gap-1">
              <label :for="listVisibilityUid">Visibility</label>
              <select
                :id="listVisibilityUid"
                v-model="formListVisibility"
                class="p-2 text-sm"
              >
                <option
                  v-for="(option, index) in listVisibilityOptions"
                  :key="index"
                  :value="option.value"
                >
                  {{ option.text }}
                </option>
              </select>
              <p class="text-xs opacity-50">Determine who can see this list.</p>
            </div>

            <div class="grid grid-cols-1 gap-1">
              <label :for="listDescriptionUid"
                >Description
                <span class="italic opacity-50">(optional)</span></label
              >
              <textarea
                v-model="formListDescription"
                class="list-description-form p-2 text-sm"
                rows="5"
                :maxlength="maxDescriptionLength"
              />
              <div class="flex flex-row gap-2">
                <p class="text-xs opacity-50">Give your list a description.</p>
                <div class="flex-grow"></div>
                <p class="text-xs opacity-50">
                  {{ descriptionLengthHelper }}
                </p>
              </div>
            </div>
          </div>

          <ComboButton
            type="submit"
            class="text-sm border border-blue-srk text-blue-srk"
            :disabled="isCreatingList"
            :loading="isCreatingList"
            >Create list</ComboButton
          >
        </form>
      </Modal>
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
  nextTick,
  onMounted,
  ref,
  useContext,
  useMeta,
  useRoute,
  useRouter,
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
import { DestinationListModel, MemberModel } from "client/models";
import uniqueId from "common/utils/uniqueId";
import { ListVisibility } from "common/enums";
import useListVisibilityOptions from "client/composables/useListVisibilityOptions";
import Input from "client/components/Input.vue";

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

    const listNameInput = ref<null | InstanceType<typeof Input>>(null);

    const isFriend = computed(() => member.value?.isFriend);
    const isAcceptingRequests = computed(
      () => member.value?.isAcceptingFriends
    );
    const destinationLists = computed(() => member.value?.lists);

    // self functions
    const isMe = computed(
      () => member.value?.username === self.value?.username
    );
    const canAddFriends = computed(() =>
      hrbacCan({ roles: [Role._self_friends] }, self.value)
    );
    const canCreateList = computed(() =>
      hrbacCan({ roles: [Role._self_destination_lists] }, self.value)
    );
    // const canCreateLists = false;

    const isFriendLoading = ref<boolean>(false);

    useMeta(() => ({
      title:
        (member.value
          ? `${member.value.nickname}'s profile | `
          : "Loading... | ") + context.$config.appinfo.name,
    }));

    // form items
    const onShowCreateListModal = async () => {
      showCreateListModal.value = true;
      await nextTick();
      listNameInput.value?.focus();
    };
    const router = useRouter();
    const listModel = store.$db().model(DestinationListModel);
    const showCreateListModal = ref<boolean>(false);
    const maxDescriptionLength = 200;

    const uid = uniqueId();
    const listDescriptionUid = "list-description-" + uid;
    const listVisibilityUid = "list-visibility-" + uid;

    const formListName = ref<null | string>(null);
    const formListDescription = ref<null | string>(null);
    const formListVisibility = ref<null | ListVisibility>(
      self.value?.meta.privacySettings?.defaultListVisibility || null
    );
    const descriptionLengthHelper = computed(() => {
      return `${
        (formListDescription.value || "").length
      } / ${maxDescriptionLength}`;
    });
    const listVisibilityOptions = useListVisibilityOptions();
    const isCreatingList = ref<boolean>(false);
    const onCreate = async () => {
      isCreatingList.value = true;
      const response = await listModel.apiCreateList(
        route.value.params.username,
        {
          name: formListName.value || "",
          description: formListDescription.value,
          visibility: formListVisibility.value as ListVisibility,
        }
      );
      isCreatingList.value = false;

      if (response.ok) {
        router.push(
          "/u/" + route.value.params.username + "/" + response.payload.id
        );
      }
    };

    // used for randomly selecting the background
    const pIndex = ref<number | null>(null);
    const p = computed(() => {
      return [false, false, false].map((_e, i) => pIndex.value === i);
    });

    onMounted(() => {
      pIndex.value = Math.floor(Math.random() * p.value.length);
    });

    return {
      route,
      pIndex,
      p,
      // pBgBackgroundUrl,

      member,
      isMe,
      isFriend,
      isAcceptingRequests,
      isFriendLoading,

      canAddFriends,
      canCreateList,

      destinationLists,

      // form
      onShowCreateListModal,
      listNameInput,
      showCreateListModal,
      onCreate,
      formListName,
      formListDescription,
      formListVisibility,
      maxDescriptionLength,
      listVisibilityUid,
      listVisibilityOptions,
      listDescriptionUid,
      descriptionLengthHelper,
      isCreatingList,
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
  --tw-drop-shadow: drop-shadow(0 10px 8px rgba(0, 0, 0, 0.3))
    drop-shadow(0 4px 3px rgba(0, 0, 0, 0.4));
}
.p-contents {
  z-index: 2;
}
.loading {
  height: 4rem;
  width: 4rem;
}
</style>
