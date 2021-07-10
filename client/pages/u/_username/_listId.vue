<template>
  <div class="space-y-8">
    <nuxt-link
      class="text-lg text-blue-srk hover:underline focus:underline"
      :to="`/u/${formListOwner}`"
      ><ArrowBack class="icon-inline" /> Back to {{ formListOwner }}'s
      profile</nuxt-link
    >
    <hr />
    {{ r }}
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
              >Create list</ComboButton
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
} from "@nuxtjs/composition-api";
import hrbacCan from "common/utils/hrbacCan";
import { Role } from "common/enums/hrbac";
import Input from "client/components/Input.vue";
import useList from "client/composables/useList";
import useUser from "client/composables/useUser";
import useInternalApi from "client/composables/useInternalApi";
import { ListVisibility } from "common/enums";
import useListVisibilityOptions from "client/composables/useListVisibilityOptions";
import uniqueId from "common/utils/uniqueId";
import { CreateListDto } from "common/dto/lists";
import ArrowBack from "client/components/icons/ArrowBack.vue";
import { DestinationItem } from "common/types/api";

export default defineComponent({
  components: {
    ArrowBack,
    Input,
  },
  setup() {
    const context = useContext();
    const user = useUser();
    const route = useRoute().value;
    if (!user.value) {
      return context.error({
        statusCode: 404,
        message: "This page cannot be found",
        path: route.path,
      });
    }
    const api = useInternalApi();

    const r = ref<any>(null);
    const maxDescriptionLength = 200;

    const { username, listId } = route.params;

    const uid = uniqueId();
    const listDescriptionUid = "list-description-" + uid;
    const listVisibilityUid = "list-visibility-" + uid;

    const title = ref<string>("New list");
    const mode = ref<string>("view");

    const formListName = ref<null | string>(null);
    const formListOwner = ref<null | string>(null);
    const formListDescription = ref<null | string>(null);
    const formListVisibility = ref<null | ListVisibility>(null);
    const formListIds = ref<string[]>([]);
    const listItems = ref<DestinationItem[]>([]);
    if (listId === "new") {
      if (
        user.value.username !== username ||
        !hrbacCan({ roles: [Role._self_destination_lists] }, user.value)
      ) {
        return context.error({
          statusCode: 404,
          message: "This page cannot be found",
          path: route.path,
        });
      }
      mode.value = "add";
      formListOwner.value = username;
      formListVisibility.value =
        user.value.meta.privacySettings?.defaultListVisibility || null;
    } else {
      const listRef = useList({ username, listId });

      r.value = listRef.value;

      console.log(r.value);

      // console.log(formListOwner.value, mode.value, title.value);

      // if (!r.value) {
      //   return context.error({
      //     statusCode: 404,
      //     message: "This page cannot be found",
      //     path: route.path,
      //   });
      // }

      // title.value = r.value.title;

      // formListName.value = r.value.title;
      // formListOwner.value = r.value.owner;
      // formListDescription.value = r.value.description;
      // formListVisibility.value = r.value.visibility;
      // formListIds.value = r.value.items.map((e) => e.id);
      // listItems.value = r.value.items;
    }

    const descriptionLengthHelper = computed(() => {
      return `${
        (formListDescription.value || "").length
      } / ${maxDescriptionLength}`;
    });

    const listVisibilityOptions = useListVisibilityOptions();

    const isCreating = ref<boolean>(false);
    const onCreate = async () => {
      isCreating.value = true;
      const response = await api({
        method: "post",
        url: "/api/lists",
        data: {
          name: formListName.value,
          description: formListDescription.value,
          visibility: formListVisibility.value,
        } as CreateListDto,
      });

      console.log(response);

      isCreating.value = false;
    };

    useMeta({ title: `${title.value} | ` + context.$config.appinfo.name });
    return {
      mode,
      title,

      maxDescriptionLength,

      listDescriptionUid,
      listVisibilityUid,

      formListName,
      formListOwner,
      formListDescription,
      formListVisibility,
      formListIds,
      listItems,

      listVisibilityOptions,

      descriptionLengthHelper,

      isCreating,
      onCreate,

      r,
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
