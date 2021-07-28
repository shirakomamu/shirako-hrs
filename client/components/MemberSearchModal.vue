<template>
  <Modal
    :visible="visible"
    container-class="p-8 w-full max-w-xl"
    @hide="emit('hide', ...arguments)"
  >
    <div class="p-8 bg-gray-200 dark:bg-gray-700">
      <MemberSearchModule
        ref="module"
        :managed-list="managedList"
        :disable-add="disableAdd"
        @pick="emit('pick', ...arguments)"
      />
    </div>
  </Modal>
</template>

<script lang="ts">
import {
  defineComponent,
  nextTick,
  PropType,
  ref,
  watch,
} from "@nuxtjs/composition-api";
import { Item } from "@vuex-orm/core";
import YelpSearchModule from "client/components/YelpSearchModule.vue";
import { DestinationListModel } from "client/models";

export default defineComponent({
  name: "MemberSearchModal",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    managedList: {
      type: Object as PropType<Item<DestinationListModel> | null>,
      default: null,
    },
    disableAdd: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const module = ref<null | InstanceType<typeof YelpSearchModule>>(null);

    watch(
      () => props.visible,
      async (value) => {
        if (value && module.value) {
          await nextTick();
          module.value.focus();
        }
      }
    );

    return { module, emit };
  },
});
</script>

<style lang="less" scoped></style>
