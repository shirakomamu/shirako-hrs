<template>
  <div
    ref="tooltipContents"
    v-click-outside="onClickOutside"
    class="tooltip-container"
    :class="containerClass"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "@nuxtjs/composition-api";
import vClickOutside from "v-click-outside";

export default defineComponent({
  name: "Tooltip",
  directives: {
    clickOutside: vClickOutside.directive,
  },
  props: {
    // control visibility of modal
    visible: {
      type: Boolean,
      default: false,
    },
    // click outside contents to close or not
    clickClose: {
      type: Boolean,
      default: true,
    },
    animationMs: {
      type: Number,
      default: 500,
    },
  },
  setup(props, { emit }) {
    const tooltipContents = ref<null | HTMLDivElement>(null);
    const shown = ref<boolean>(props.visible);
    const visibility = ref<boolean>(props.visible);
    const transition = ref<boolean>(false);

    const onClickOutside = (_event: Event) => {
      if (props.clickClose && !transition.value && visibility.value) {
        emit("hide");
      }
    };

    watch(
      () => props.visible,
      (newValue: boolean) => {
        transition.value = true; // prevents onClickOutside
        shown.value = newValue; // immediately begin opacity transition
        if (newValue) {
          visibility.value = true; // make it visible immediately
        }
        setTimeout(() => {
          if (!newValue) visibility.value = false; // remove visibility after it's done
          transition.value = false; // re-enables onClickOutside
        }, props.animationMs);
      }
    );

    return {
      tooltipContents,
      shown,
      visibility,
      transition,
      onClickOutside,
    };
  },
});
</script>

<style lang="less" scoped></style>
