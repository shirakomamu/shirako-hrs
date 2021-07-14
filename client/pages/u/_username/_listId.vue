<template>
  <div class="space-y-8">
    <template v-if="mode">
      <nuxt-link
        class="text-lg text-blue-srk hover:underline focus:underline"
        :to="`/u/${route.params.username}`"
        ><ArrowBack class="icon-inline" /> Back to {{ route.params.username }}'s
        profile</nuxt-link
      >
      <hr />
      <h6 class="text-2xl dark:text-white">{{ title }}</h6>
      <div class="grid grid-cols-1 justify-center gap-4">
        <template v-if="mode === 'add' || mode === 'edit'">
          <form
            class="
              grid grid-cols-1
              md:grid-cols-2
              items-center
              justify-items-center
            "
            @submit.prevent="onCreate"
          >
            <div class="w-full grid grid-cols-1 gap-8">
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
                <Input
                  v-model="formListName"
                  type="text"
                  passive-text="Choose a descriptive name. It must be 1~24 characters long."
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
                  <p class="text-xs opacity-50">
                    Determine who can see this list.
                  </p>
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
                    <p class="text-xs opacity-50">
                      Give your list a description.
                    </p>
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
                :disabled="isCreating"
                :loading="isCreating"
                >{{ submitButtonText }}</ComboButton
              >
            </div>
            <div class="hidden md:block">
              <img
                src="@/assets/images/irasutoya/gourmet_website.png"
                alt="Gourmet website"
                width="320"
              />
            </div>
          </form>
        </template>
      </div>
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
  ref,
  useContext,
  useMeta,
  useRoute,
  useRouter,
  useStore,
  watch,
} from "@nuxtjs/composition-api";
import Input from "client/components/Input.vue";
import useList from "client/composables/useList";
import useSelf from "client/composables/useSelf";
import { ListVisibility } from "common/enums";
import useListVisibilityOptions from "client/composables/useListVisibilityOptions";
import uniqueId from "common/utils/uniqueId";
import { CreateListDto } from "common/dto/lists";
import Loader from "client/components/icons/Loader.vue";
import ArrowBack from "client/components/icons/ArrowBack.vue";
import { DestinationItem } from "common/types/api";
import hrbacCan from "common/utils/hrbacCan";
import { Role } from "common/enums/hrbac";
import { DestinationListModel } from "client/models";

export default defineComponent({
  components: {
    ArrowBack,
    Input,
    Loader,
  },
  setup() {
    const context = useContext();
    const self = useSelf();
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const model = store.$db().model(DestinationListModel);
    if (!self.value) {
      return context.error({
        statusCode: 404,
      });
    }

    const list = useList({
      username: route.value.params.username,
      id: route.value.params.listId,
    });

    const maxDescriptionLength = 200;

    const uid = uniqueId();
    const listDescriptionUid = "list-description-" + uid;
    const listVisibilityUid = "list-visibility-" + uid;

    const formListName = ref<null | string>(null);
    const formListDescription = ref<null | string>(null);
    const formListVisibility = ref<null | ListVisibility>(
      self.value?.meta.privacySettings?.defaultListVisibility || null
    );
    const formListItems = ref<DestinationItem[]>([]);

    const descriptionLengthHelper = computed(() => {
      return `${
        (formListDescription.value || "").length
      } / ${maxDescriptionLength}`;
    });

    const listVisibilityOptions = useListVisibilityOptions();

    watch(
      () => route.value.params.username,
      async (value: string) => {
        list.value = null;
        if (
          self.value?.username === value &&
          route.value.params.listId === "new"
        ) {
          return;
        }
        if (route.value.params.listId === "new") {
          context.error({
            statusCode: 404,
          });
        }

        const r = await model.apiFetch({
          username: value,
          id: route.value.params.listId,
        });

        if (!r) {
          return context.error({ statusCode: 404 });
        }

        list.value = r;
        formListName.value = r.name;
        formListDescription.value = r.description;
        formListVisibility.value = r.visibility;
        formListItems.value = r.items;
      }
    );
    watch(
      () => route.value.params.listId,
      async (value: string) => {
        list.value = null;
        if (self.value?.username === value && value === "new") {
          return;
        }
        if (value === "new") {
          context.error({
            statusCode: 404,
          });
        }

        const r = await model.apiFetch({
          username: route.value.params.username,
          id: value,
        });

        if (!r) {
          return context.error({ statusCode: 404 });
        }

        list.value = r;
        formListName.value = r.name;
        formListDescription.value = r.description;
        formListVisibility.value = r.visibility;
        formListItems.value = r.items;
      }
    );
    const mode = computed(() => {
      if (!list.value) {
        // if the user is themselves
        if (route.value.params.username === self.value?.username) {
          // if user can't access list data, then redirect to settings
          if (
            !hrbacCan({ roles: [Role._self_destination_lists] }, self.value)
          ) {
            router.push("/settings");
            return "";
          }
          return "add";
        }
        // if there is no list and the username isn't themselves
        return "";
      }

      if (route.value.params.username === self.value?.username) {
        return "edit";
      }

      return "view";
    });

    const title = computed(() =>
      mode.value === "add" ? "New list" : list.value?.name
    );
    const submitButtonText = computed(() =>
      mode.value === "add" ? "Create list" : "Edit list"
    );

    const isCreating = ref<boolean>(false);
    const onCreate = async () => {
      isCreating.value = true;
      const response = await model.apiCreateList(route.value.params.username, {
        name: formListName.value || "",
        description: formListDescription.value,
        visibility: formListVisibility.value,
      } as CreateListDto);

      console.log(response);

      isCreating.value = false;
    };

    const tabTitle = computed(
      () =>
        (list.value
          ? `${list.value.name} | `
          : mode.value === "add"
          ? "New list | "
          : "Loading... | ") + context.$config.appinfo.name
    );
    useMeta({
      title: tabTitle.value,
    });

    return {
      mode,
      route,

      maxDescriptionLength,

      list,
      title,
      submitButtonText,

      listDescriptionUid,
      listVisibilityUid,

      formListName,
      formListDescription,
      formListVisibility,
      formListItems,

      listVisibilityOptions,

      descriptionLengthHelper,

      isCreating,
      onCreate,
    };
  },
  // required for useMeta to work
  head: {},
});
</script>

<style lang="less" scoped>
.list-description-form {
  resize: vertical;
}
</style>
