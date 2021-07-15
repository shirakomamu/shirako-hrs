<template>
  <div
    class="
      modal-overlay
      bg-opacity-50
      overflow
      grid grid-cols-1
      justify-items-center
    "
    :class="{
      'items-center': verticalCenter,
      'bg-black': overlay,
      active: shown,
      visible: visibility,
    }"
    :style="{ 'transition-duration': animationMs + 'ms' }"
  >
    <div ref="modalContents" class="mx-auto" :class="containerClass">
      <div
        v-click-outside="onClickOutside"
        class="mx-auto direct-container"
        :style="{
          'transition-duration': animationMs + 'ms',
        }"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "@nuxtjs/composition-api";
import vClickOutside from "v-click-outside";

export default defineComponent({
  name: "Modal",
  directives: {
    clickOutside: vClickOutside.directive,
  },
  props: {
    // control visibility of modal
    visible: {
      type: Boolean,
      default: false,
    },
    // whether background is darkened
    overlay: {
      type: Boolean,
      default: true,
    },
    // click outside contents to close or not
    clickClose: {
      type: Boolean,
      default: true,
    },
    verticalCenter: {
      type: Boolean,
      default: false,
    },
    containerClass: {
      type: String,
      default: "",
    },
    animationMs: {
      type: Number,
      default: 300,
    },
  },
  setup(props, { emit }) {
    const modalContents = ref<null | HTMLDivElement>(null);
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
          const elem = modalContents.value;
          if (elem) {
            elem.scrollIntoView({ behavior: "smooth" });
          }
        }
        if (props.overlay) {
          if (newValue)
            document.querySelector("body")?.classList.add("no-overflow");
          else document.querySelector("body")?.classList.remove("no-overflow");
        }
        setTimeout(() => {
          if (!newValue) visibility.value = false; // remove visibility after it's done
          transition.value = false; // re-enables onClickOutside
        }, props.animationMs);
      }
    );

    return {
      modalContents,
      shown,
      visibility,
      transition,
      onClickOutside,
    };
  },
});
</script>

<style lang="less" scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 999; // 50 is appheader
  margin: 0px !important;
  visibility: hidden;
  opacity: 0;
  transition-property: opacity;
  transition-timing-function: ease;

  &.active {
    opacity: 1;
  }
  &.visible {
    visibility: visible;
  }
}

.direct-container {
  position: relative;
  top: -50%;
  transition-property: opacity, top;
  transition-timing-function: ease;
  opacity: 0;
}
.active .direct-container {
  top: 0;
  opacity: 1;
}

.overflow {
  overflow: auto;
}
</style>
