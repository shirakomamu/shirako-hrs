<template>
  <Modal
    :visible="visible"
    container-class="p-8 w-full max-w-prose"
    @hide="emit('hide', ...arguments)"
  >
    <form
      class="p-8 bg-gray-200 dark:bg-gray-700 grid grid-cols-1 gap-4"
      @submit.prevent="onCreate"
    >
      <h6 class="text-2xl dark:text-white">Create new list</h6>
      <div
        class="grid grid-cols-1 gap-4 items-center bg-gray-200 dark:bg-gray-700"
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
        ><PlaylistAdd class="icon-inline" /> Create list</ComboButton
      >
    </form>
  </Modal>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  ref,
  useRouter,
  useStore,
  watch,
} from "@nuxtjs/composition-api";
import useListVisibilityOptions from "client/composables/useListVisibilityOptions";
import useSelf from "client/composables/useSelf";
import { DestinationListModel } from "client/models";
import { ListVisibility } from "common/enums";
import uniqueId from "common/utils/uniqueId";
import Input from "client/components/Input.vue";
import PlaylistAdd from "client/components/icons/PlaylistAdd.vue";

export default defineComponent({
  name: "CreateListModal",
  components: {
    PlaylistAdd,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const self = useSelf();
    const uid = uniqueId();
    const store = useStore();
    const router = useRouter();
    const listModel = store.$db().model(DestinationListModel);
    const listDescriptionUid = "list-description-" + uid;
    const listVisibilityUid = "list-visibility-" + uid;
    const maxDescriptionLength = 200;
    const listNameInput = ref<null | InstanceType<typeof Input>>(null);

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
        self.value?.username || "",
        {
          name: formListName.value || "",
          description: formListDescription.value,
          visibility: formListVisibility.value as ListVisibility,
        }
      );
      isCreatingList.value = false;

      if (response.ok) {
        router.push("/u/" + self.value?.username + "/" + response.payload.id);
      }
    };

    watch(
      () => props.visible,
      async (value) => {
        if (value && listNameInput.value) {
          await nextTick();
          listNameInput.value.focus();
        }
      }
    );

    return {
      emit,
      onCreate,
      formListName,
      listNameInput,
      listVisibilityUid,
      formListVisibility,
      listVisibilityOptions,
      listDescriptionUid,
      formListDescription,
      maxDescriptionLength,
      descriptionLengthHelper,
      isCreatingList,
    };
  },
});
</script>

<style lang="less" scoped></style>
