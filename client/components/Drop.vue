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
        'max-height': maxHeightComputedCss,
        'max-width': maxWidthComputedCss,
        'z-index': zIndex,
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
  onUnmounted,
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
    maxWidth: {
      type: String,
      default: "480px",
    },
    closeAfter: {
      type: Number,
      default: -1,
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

    const zIndex = ref<string>("1001");
    const maxHeightComputedCss = ref<string>("unset");
    const maxWidthComputedCss = ref<string>(props.maxWidth);

    watch(
      () => props.visible,
      (newValue) => {
        transition.value = true; // prevents onClickOutside
        shown.value = newValue; // immediately begin opacity transition
        if (newValue) {
          computeBoundingRects();
          visibility.value = true; // make it visible immediately
          zIndex.value = (
            2001 +
            document.querySelectorAll(".tooltip-container.visible").length
          ).toString();
        }
        setTimeout(() => {
          if (!newValue) visibility.value = false; // remove visibility after it's done
          transition.value = false; // re-enables onClickOutside

          if (props.closeAfter > 0) {
            setTimeout(() => {
              if (!transition.value && visibility.value) {
                emit("hide");
              }
            }, props.closeAfter);
          }
        }, props.animationMs);
      }
    );

    const resizeObserver = ref<null | ResizeObserver>(null);

    onMounted(() => {
      resizeObserver.value = new ResizeObserver(() => {
        computeHeightBound();
      });
      resizeObserver.value.observe(
        document.querySelector("#__nuxt") as HTMLDivElement
      );
    });

    onUnmounted(() => resizeObserver.value?.disconnect());

    const computeHeightBound = () => {
      if (!tooltipContents.value) return;
      if (!parent.value) return;
      const nuxtRootRect = (
        document.querySelector("#__nuxt") as HTMLDivElement
      ).getBoundingClientRect();
      const parentRect = parent.value.getBoundingClientRect();
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      if (props.containerClass.includes("drop-bottom")) {
        maxHeightComputedCss.value = `${Math.ceil(
          nuxtRootRect.height - (scrollTop + parentRect.bottom + 16)
        )}px`;
      } else if (props.containerClass.includes("drop-top")) {
        maxHeightComputedCss.value = `${Math.ceil(parentRect.top - 16)}px`;
      }
    };

    const computeWidthBound = () => {
      if (!parent.value) return props.maxWidth;
      // const windowWidth = window.innerWidth;
      const boundingRect = parent.value.getBoundingClientRect();

      if (props.containerClass.includes("drop-left")) {
        // if it's aligned to go left, then subtract the right size
        maxWidthComputedCss.value = `min(${props.maxWidth}, ${Math.ceil(
          boundingRect.right
        )}px)`;
        return;
      } else if (props.containerClass.includes("drop-right")) {
        // if it's aligned to go right, then subtract the left size
        maxWidthComputedCss.value = `min(${
          props.maxWidth
        }, calc(100vw - ${Math.ceil(boundingRect.left)}px))`;
        return;
      }

      maxWidthComputedCss.value = props.maxWidth;
    };

    const computeBoundingRects = () => {
      computeHeightBound();
      computeWidthBound();
    };

    return {
      parent,
      tooltipContents,
      shown,
      visibility,
      transition,
      onClickOutside,
      maxHeightComputedCss,
      maxWidthComputedCss,
      zIndex,
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
      bottom: calc(100% + 4px); // make it appear on the top
    }
  }
  &.drop-bottom {
    top: 50%;
    &.active {
      top: calc(100% + 4px); // make it appear on the bottom
    }
  }
}
</style>
