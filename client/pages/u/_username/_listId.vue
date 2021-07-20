<template>
  <div class="space-y-8">
    <template v-if="list">
      <nuxt-link
        class="text-lg text-blue-srk hover:underline focus:underline"
        :to="`/u/${route.params.username}`"
        ><ArrowBack class="icon-inline" /> Back to {{ route.params.username }}'s
        profile</nuxt-link
      >
      <div class="space-x-2">
        <ComboButton
          v-if="canModifyList && isMe"
          class="p-0"
          @click="onShowEditListModal"
          ><Edit class="icon-inline text-blue-srk"
        /></ComboButton>
        <h6 class="text-2xl dark:text-white inline">{{ title }}</h6>
        <ListVisibilityIndicator :visibility="list.visibility" class="inline" />
      </div>
      <p :class="{ italic: !list.description }">
        {{ list.description || "No description provided." }}
      </p>
      <div class="items-center bg-gray-200 dark:bg-gray-700 p-8">
        <Loader v-if="listLoading" class="loading text-blue-srk" />
        <div
          v-else
          class="
            grid grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            gap-8
          "
        >
          <ComboButton
            v-if="isMe && canModifyList"
            key="add"
            class="p-0"
            alt="Add to list"
            @click="showSearchModal = true"
          >
            <DestinationItemAddAvatar />
          </ComboButton>
          <nuxt-link
            v-else-if="isMe && !canModifyList"
            key="verifRequired"
            to="/settings"
            custom
          >
            <ComboButton
              class="p-0 h-full w-full"
              alt="Email verification required"
            >
              <DestinationItemAddAvatarDisabled />
            </ComboButton>
          </nuxt-link>
          <DestinationItem
            v-for="item in list.items"
            :id="item.id"
            :key="item.id"
            :name="item.name"
            :url="item.url"
            :price="item.price"
            :rating="item.rating"
            :review_count="item.review_count"
            :display_address="item.display_address"
            :display_phone="item.display_phone"
            :timezone="item.timezone"
            :hours="item.hours"
            :special_hours="item.special_hours"
            :last-updated="item.lastUpdated"
            :show-remove-button="canModifyList"
            :is-removing="loadingIds.includes(item.id)"
            @pick="onSelect(item.id)"
          />
        </div>
      </div>
      <YelpSearchModal
        :visible="showSearchModal"
        :managed-list="list"
        @hide="showSearchModal = false"
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
            <ComboButton
              alt="Remove from list"
              class="text-sm bg-red-500 text-white"
              @click="onShowDeleteConfirmationModal"
              ><Delete class="icon-inline"
            /></ComboButton>
            <h6 class="text-2xl dark:text-white">Edit list</h6>
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
            >Edit list</ComboButton
          >
        </form>
      </Modal>
    </template>
    <template v-else>
      <div class="grid grid-cols-1 place-items-center">
        <Loader class="loading text-blue-srk" /></div
    ></template>
  </div>
</template>

<script lang="ts">
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
} from "@nuxtjs/composition-api";
import ArrowBack from "client/components/icons/ArrowBack.vue";
import Delete from "client/components/icons/Delete.vue";
import Edit from "client/components/icons/Edit.vue";
import Loader from "client/components/icons/Loader.vue";
import { DestinationListModel } from "client/models";
import useSelf from "client/composables/useSelf";
import hrbacCan from "common/utils/hrbacCan";
import { Role } from "common/enums/hrbac";
import uniqueId from "common/utils/uniqueId";
import useListVisibilityOptions from "client/composables/useListVisibilityOptions";
import { ListVisibility } from "common/enums";
import Input from "client/components/Input.vue";

export default defineComponent({
  components: {
    ArrowBack,
    Delete,
    Edit,
    Loader,
  },
  setup() {
    const context = useContext();
    const route = useRoute();
    const store = useStore();
    const router = useRouter();
    const model = store.$db().model(DestinationListModel);
    const self = useSelf();

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

    const showSearchModal = ref<boolean>(false);
    const loadingIds = ref<string[]>([]);

    const onSelect = async (destinationId: string) => {
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

    return {
      console,
      route,
      listLoading,

      loadingIds,

      showSearchModal,
      onSelect,

      list,
      isMe,
      canModifyList,
      title,

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
