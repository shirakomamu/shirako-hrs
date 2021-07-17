<template>
  <div ref="parent" class="parent-container">
    <slot name="default" />
    <div
      ref="tooltipContents"
      v-click-outside="onClickOutside"
      class="tooltip-container"
      :class="[
        {
          active: shown,
          visible: visibility,
        },
        containerClass,
      ]"
      :style="{
        'transition-duration': animationMs + 'ms',
        'max-width': maxWidthComputedCss,
      }"
    >
      <slot name="tooltip" />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  watch,
} from "@nuxtjs/composition-api";
import vClickOutside from "v-click-outside";

export default defineComponent({
  name: "Drop",
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
    containerClass: {
      type: String,
      default: "",
    },
    animationMs: {
      type: Number,
      default: 200,
    },
  },
  setup(props, { emit }) {
    const parent = ref<null | HTMLDivElement>(null);
    const tooltipContents = ref<null | HTMLDivElement>(null);
    const shown = ref<boolean>(props.visible);
    const visibility = ref<boolean>(props.visible);
    const transition = ref<boolean>(false);

    const onClickOutside = (_event: Event) => {
      if (props.clickClose && !transition.value && visibility.value) {
        emit("hide");
      }
    };

    const maxWidthComputedCss = ref<string>(`480px`);

    watch(
      () => props.visible,
      (newValue) => {
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

    onMounted(() => {
      if (!parent.value) return;
      const windowWidth = window.innerWidth;
      const boundingRect = parent.value.getBoundingClientRect();

      const rightSize = 1 * (windowWidth - boundingRect.right);
      const leftSize = 1 * (windowWidth - boundingRect.left);

      if (props.containerClass.includes("drop-left")) {
        // if it's aligned to go left, then subtract the right size
        maxWidthComputedCss.value = `min(480px, calc(100vw - ${rightSize}px))`;
      } else if (props.containerClass.includes("drop-right")) {
        // if it's aligned to go right, then subtract the left size
        maxWidthComputedCss.value = `min(480px, calc(100vw - ${leftSize}px))`;
      }
    });

    return {
      parent,
      tooltipContents,
      shown,
      visibility,
      transition,
      onClickOutside,
      maxWidthComputedCss,
    };
  },
});
</script>

<style lang="less" scoped>
.parent-container {
  position: relative;
}

.tooltip-container {
  position: absolute;
  visibility: hidden;
  opacity: 0;
  transition-property: opacity, top, bottom;
  transition-timing-function: ease;
  width: max-content;
  overflow: auto;

  &.active {
    opacity: 1;
  }
  &.visible {
    visibility: visible;
  }
  &.drop-right {
    left: 0; // make it appear on the right
    right: auto;
  }
  &.drop-left {
    right: 0; // make it appear on the left
    left: auto;
  }
  &.drop-top {
    bottom: 50%;
    &.active {
      bottom: calc(100% + 0.2rem); // make it appear on the top
    }
  }
  &.drop-bottom {
    top: 50%;
    &.active {
      top: calc(100% + 0.2rem); // make it appear on the bottom
    }
  }
}
</style>
