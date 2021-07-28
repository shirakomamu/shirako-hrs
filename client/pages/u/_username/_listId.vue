<template>
  <div class="space-y-8">
    <div v-if="list" class="grid grid-cols-1 gap-4">
      <nuxt-link
        class="
          text-lg text-orange-srk
          dark:text-blue-srk
          hover:underline
          focus:underline
        "
        :to="`/u/${route.params.username}`"
        ><IconsArrowBack class="icon-inline" /> Back to
        {{ route.params.username }}'s profile</nuxt-link
      >
      <div class="space-x-2">
        <h6 class="text-2xl dark:text-white inline">{{ title }}</h6>
        <ComboButton
          v-if="canModifyList && isMe"
          class="p-0 text-orange-srk dark:text-blue-srk text-sm"
          @click="onShowEditListModal"
          ><IconsEdit class="icon-inline" /> Edit</ComboButton
        >
      </div>
      <ListVisibilityIndicator :visibility="list.visibility" class="inline" />

      <div v-if="list.visibility === ListVisibility.list && isMe">
        <div
          class="
            bg-gray-200
            dark:bg-gray-700
            p-4
            grid grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            2xl:grid-cols-5
            gap-4
          "
        >
          <ComboButton
            v-if="canModifyList"
            class="p-0"
            @click="showMemberSearchModal = true"
            ><DestinationUserAddAvatar
          /></ComboButton>
          <nuxt-link
            v-else
            v-slot="{ navigate }"
            key="verifRequiredShare"
            to="/settings"
            custom
          >
            <ComboButton
              class="p-0 h-full w-full"
              alt="Email verification required"
              @click="navigate"
            >
              <DestinationUserAddAvatarDisabled />
            </ComboButton>
          </nuxt-link>
          <DestinationUser
            v-for="(user, index) in list.users.sort()"
            :key="'list-users-' + index"
            :username="user.username"
            :nickname="user.nickname"
            :avatar="user.avatar"
            :is-friend="
              user.friendStatus &&
              user.friendStatus.status === FriendStatus.confirmed
            "
            :is-removing="loadingUserIds.includes(user.username)"
            :show-delete-button="canModifyList"
            @pick="onRemoveUser"
          />
        </div>
      </div>

      <p :class="{ italic: !list.description }">
        {{ list.description || "No description provided." }}
      </p>
      <div class="items-center bg-gray-200 dark:bg-gray-700 p-4">
        <IconsLoader
          v-if="listLoading"
          class="loading text-orange-srk dark:text-blue-srk"
        />
        <div
          v-else
          class="
            grid grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            2xl:grid-cols-5
            gap-4
          "
        >
          <ComboButton
            v-if="isMe && canModifyList"
            key="add"
            class="p-0 h-full w-full"
            alt="Add to list"
            :disabled="maxItemsReached"
            @click="showYelpSearchModal = true"
          >
            <DestinationItemAddAvatar>
              <p
                class="opacity-50"
                :class="{ 'text-orange-srk': maxItemsReached }"
              >
                ({{
                  Math.max(
                    maxItems - ((list.items && list.items.length) || 0),
                    0
                  )
                }}
                slot{{
                  Math.max(
                    maxItems - ((list.items && list.items.length) || 0),
                    0
                  ) === 1
                    ? ""
                    : "s"
                }}
                available)
              </p>
            </DestinationItemAddAvatar>
          </ComboButton>
          <nuxt-link
            v-else-if="isMe && !canModifyList"
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
              <DestinationItemAddAvatarDisabled />
            </ComboButton>
          </nuxt-link>
          <DestinationItem
            v-for="item in list.items"
            :id="item.id"
            :key="item.id"
            :name="item.name"
            :image_url="item.image_url"
            :url="item.url"
            :price="item.price"
            :rating="item.rating"
            :review_count="item.review_count"
            :display_address="item.display_address"
            :display_phone="item.display_phone"
            :timezone="item.timezone"
            :hours="item.hours"
            :special_hours="item.special_hours"
            :regular-hours="item.regularHours"
            :time-until-close="item.getTimeUntilClose(time)"
            :last-updated="item.lastUpdated"
            :show-remove-button="canModifyList && isMe"
            :is-removing="loadingIds.includes(item.id)"
            @pick="onRemoveItem"
          />
        </div>
      </div>
      <YelpSearchModal
        v-if="isMe"
        :visible="showYelpSearchModal"
        :managed-list="list"
        :disable-add="maxItemsReached"
        @hide="showYelpSearchModal = false"
      />
      <MemberSearchModal
        v-if="isMe && list.visibility === ListVisibility.list"
        :visible="showMemberSearchModal"
        :managed-list="list"
        @hide="showMemberSearchModal = false"
      />

      <Modal
        :visible="showDeleteConfirmationModal"
        container-class="p-8 w-full max-w-prose grid grid-cols-1 place-items-center"
        @hide="showDeleteConfirmationModal = false"
      >
        <div class="p-8 bg-gray-200 dark:bg-gray-700 grid grid-cols-1 gap-4">
          <h6 class="text-lg font-semibold dark:text-white">
            Confirm list deletion
          </h6>
          <p>
            Are you sure you want to delete
            <span class="font-semibold">{{ list.name }}?</span>
          </p>
          <form @submit.prevent="deleteList">
            <div class="grid grid-cols-2 mt-4 gap-4">
              <ComboButton
                alt="Cancel"
                class="text-sm border border-black dark:border-white"
                @click="showDeleteConfirmationModal = false"
                >Cancel</ComboButton
              >
              <ComboButton
                type="submit"
                alt="Confirm account deletion"
                class="text-sm bg-red-500 text-white"
                :loading="isDeletingList"
                :disabled="isDeletingList"
                >Delete list</ComboButton
              >
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        :visible="showEditListModal"
        container-class="p-8 w-full max-w-prose"
        @hide="showEditListModal = false"
      >
        <form
          class="p-8 bg-gray-200 dark:bg-gray-700 grid grid-cols-1 gap-4"
          @submit.prevent="onEditList"
        >
          <div class="flex flex-row gap-4 items-center">
            <h6 class="text-2xl dark:text-white">Edit list</h6>
            <div class="flex-grow" />
            <ComboButton
              alt="Delete"
              class="text-sm bg-red-500 text-white"
              @click="onShowDeleteConfirmationModal"
              ><IconsDelete class="icon-inline" /> Delete</ComboButton
            >
          </div>

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
            :disabled="isEditingList"
            :loading="isEditingList"
            ><IconsEdit class="icon-inline" /> Edit list</ComboButton
          >
        </form>
      </Modal>
    </div>
    <div v-else>
      <div class="grid grid-cols-1 place-items-center">
        <IconsLoader class="loading text-orange-srk dark:text-blue-srk" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  useContext,
  useMeta,
  useRoute,
  useRouter,
  useStore,
} from "@nuxtjs/composition-api";
import { DestinationListModel } from "client/models";
import useSelf from "client/composables/useSelf";
import hrbacCan from "common/utils/hrbacCan";
import { Role } from "common/enums/hrbac";
import uniqueId from "common/utils/uniqueId";
import useListVisibilityOptions from "client/composables/useListVisibilityOptions";
import { ListVisibility, FriendStatus } from "common/enums";
import Input from "client/components/Input.vue";
import { MAX_ITEMS_PER_LIST } from "server/config/dataLimits";

export default defineComponent({
  setup() {
    const context = useContext();
    const route = useRoute();
    const store = useStore();
    const router = useRouter();
    const model = store.$db().model(DestinationListModel);
    const self = useSelf();

    const maxItems = MAX_ITEMS_PER_LIST;
    const maxItemsReached = computed(
      () => (list.value?.items || []).length >= maxItems
    );

    // useList({
    //   username: route.value.params.username,
    //   id: route.value.params.listId,
    // });

    const refreshModel = async () => {
      const r = await model.apiFetch({
        username: route.value.params.username,
        id: route.value.params.listId,
      });

      if (!r) {
        return context.error({ statusCode: 404 });
      }
      formListName.value = r.name;
      formListVisibility.value = r.visibility;
      formListDescription.value = r.description;
    };

    onMounted(async () => {
      await refreshModel();
    });

    const showYelpSearchModal = ref<boolean>(false);

    const loadingIds = ref<string[]>([]);
    const onRemoveItem = async (destinationId: string) => {
      if (!list.value) {
        return;
      }

      loadingIds.value.push(destinationId);
      await model.apiRemoveItemFromList({
        id: list.value.id,
        username: list.value.owner,
        destinationId,
      });
      loadingIds.value = loadingIds.value.filter((e) => e !== destinationId);
    };

    const list = computed(() =>
      model
        .query()
        .with("items", (query) => query.orderBy("name"))
        .with("users", (query) => query.orderBy("username"))
        .with("users.friendStatus")
        .find([route.value.params.username, route.value.params.listId])
    );

    const isMe = computed(() => list.value?.owner === self.value?.username);
    const canModifyList = computed(() =>
      hrbacCan({ roles: [Role._self_destination_lists] }, self.value)
    );
    // const canModifyList = false;

    const listLoading = computed<boolean>(() => model.fetching);

    const title = computed(() => list.value?.name);

    useMeta(() => ({
      title:
        (list.value ? `${list.value.name} | ` : "Loading... | ") +
        context.$config.appinfo.name,
    }));

    const uid = uniqueId();

    const listNameInput = ref<null | InstanceType<typeof Input>>(null);
    const maxDescriptionLength = 200;
    const listDescriptionUid = "list-description-" + uid;
    const listVisibilityUid = "list-visibility-" + uid;

    const showEditListModal = ref<boolean>(false);

    const formListName = ref<null | string>(null);
    const formListDescription = ref<null | string>(null);
    const formListVisibility = ref<null | ListVisibility>(
      list.value?.visibility || null
    );
    const descriptionLengthHelper = computed(() => {
      return `${
        (formListDescription.value || "").length
      } / ${maxDescriptionLength}`;
    });
    const listVisibilityOptions = useListVisibilityOptions();
    const isEditingList = ref<boolean>(false);

    const onShowEditListModal = async () => {
      showEditListModal.value = true;
      await nextTick();
      listNameInput.value?.focus();
    };
    const onEditList = async () => {
      isEditingList.value = true;
      const response = await model.apiUpdateList(
        {
          username: route.value.params.username,
          id: route.value.params.listId,
        },
        {
          name: formListName.value || undefined,
          description:
            formListDescription.value === list.value?.description
              ? undefined
              : formListDescription.value || null,
          visibility: formListVisibility.value || undefined,
        }
      );
      isEditingList.value = false;

      if (response.ok) {
        showEditListModal.value = false;
      }
    };

    const loadingUserIds = ref<string[]>([]);
    const onRemoveUser = async (username: string) => {
      if (!list.value) {
        return;
      }

      loadingUserIds.value.push(username);
      await model.apiRemoveUserFromList({
        id: list.value.id,
        username: list.value.owner,
        targetUsername: username,
      });
      loadingUserIds.value = loadingUserIds.value.filter((e) => e !== username);
    };

    const showDeleteConfirmationModal = ref<boolean>(false);
    const onShowDeleteConfirmationModal = () => {
      showDeleteConfirmationModal.value = true;
    };
    const isDeletingList = ref<boolean>(false);
    const deleteList = async () => {
      isDeletingList.value = true;
      const response = await model.apiDeleteList({
        username: route.value.params.username,
        id: route.value.params.listId,
      });
      isDeletingList.value = false;

      if (response.ok) {
        router.push("/u/" + route.value.params.username);
      }
    };

    const showMemberSearchModal = ref<boolean>(false);

    const time = ref<number>(Date.now());
    const timeUpdater = ref<any>(null);

    onMounted(() => {
      timeUpdater.value = setInterval(() => {
        time.value = Date.now();
      }, 600);
    });

    onUnmounted(() => {
      clearInterval(timeUpdater.value);
    });

    return {
      time,
      console,
      route,
      listLoading,

      loadingIds,

      showYelpSearchModal,
      loadingUserIds,
      onRemoveItem,

      list,
      isMe,
      canModifyList,
      title,

      maxItems,
      maxItemsReached,

      ListVisibility,
      FriendStatus,
      showMemberSearchModal,
      onRemoveUser,

      // form
      listNameInput,
      maxDescriptionLength,
      listDescriptionUid,
      listVisibilityUid,
      showEditListModal,
      formListName,
      formListDescription,
      formListVisibility,
      descriptionLengthHelper,
      listVisibilityOptions,
      isEditingList,
      onShowEditListModal,
      onEditList,
      isDeletingList,
      deleteList,
      showDeleteConfirmationModal,
      onShowDeleteConfirmationModal,
    };
  },
  // required for useMeta to work
  head: {},
});
</script>

<style lang="less" scoped>
.loading {
  height: 4rem;
  width: 4rem;
}
</style>
