<template>
  <Modal
    :visible="visible"
    container-class="p-8 w-full max-w-prose"
    @hide="emit('hide', ...arguments)"
  >
    <div class="p-8 bg-gray-200 dark:bg-gray-700">
      <YelpSearchModule ref="module" @pick="emit('pick', ...arguments)" />
    </div>
  </Modal>
</template>

<script lang="ts">
import { defineComponent, nextTick, ref, watch } from "@nuxtjs/composition-api";
import YelpSearchModule from "client/components/YelpSearchModule.vue";

export default defineComponent({
  name: "YelpSearchModal",
  props: {
    visible: {
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
