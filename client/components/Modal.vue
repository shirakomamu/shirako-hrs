<template>
  <div
    ref="modalOverlay"
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
    :style="{ 'transition-duration': animationMs + 'ms', 'z-index': zIndex }"
    tabindex="0"
    @keydown.esc="onEscPress"
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
import {
  defineComponent,
  nextTick,
  onUnmounted,
  ref,
  watch,
} from "@nuxtjs/composition-api";
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
    escClose: {
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
    // zIndex: {
    //   type: Number,
    //   default: 999,
    // },
  },
  setup(props, { emit }) {
    const modalOverlay = ref<null | HTMLDivElement>(null);
    const modalContents = ref<null | HTMLDivElement>(null);
    const shown = ref<boolean>(props.visible);
    const visibility = ref<boolean>(props.visible);
    const transition = ref<boolean>(false);

    const onClickOutside = (event: Event) => {
      if (
        props.clickClose &&
        !transition.value &&
        visibility.value &&
        event.target === modalOverlay.value // ensures it's not another modal
      ) {
        emit("hide");
      }
    };

    const onEscPress = (event: KeyboardEvent) => {
      if (
        props.escClose &&
        !transition.value &&
        visibility.value &&
        modalOverlay.value?.contains(event.target as Node) // ensures it's not another modal
      ) {
        emit("hide");
      }
    };

    const zIndex = ref<string>("1001");

    const removeOverflowIfApplicable = () => {
      // 1 because it includes itself
      if (document.querySelectorAll(".modal-overlay.visible").length <= 1) {
        document.querySelector("body")?.classList.remove("no-overflow");
      }
    };

    watch(
      () => props.visible,
      async (newValue) => {
        transition.value = true; // prevents onClickOutside
        shown.value = newValue; // immediately begin opacity transition
        if (newValue) {
          if (modalOverlay.value) {
            // always make it higher than the last overlay
            zIndex.value = (
              1001 + document.querySelectorAll(".modal-overlay.visible").length
            ).toString();
          }
          visibility.value = true; // make it visible immediately

          const elem = modalContents.value;
          if (elem) {
            elem.scrollIntoView({ behavior: "smooth" });
          }
        }
        if (props.overlay) {
          if (newValue)
            document.querySelector("body")?.classList.add("no-overflow");
          else removeOverflowIfApplicable();
        }

        // focus if there is no other focus
        await nextTick();
        if (!modalOverlay.value?.contains(document.activeElement)) {
          modalOverlay.value?.focus();
        }

        setTimeout(() => {
          if (!newValue) visibility.value = false; // remove visibility after it's done
          transition.value = false; // re-enables onClickOutside
          emit(newValue ? "shown" : "hidden");
        }, props.animationMs);
      }
    );

    // ensures no orphan modal that's abruptly destroyed makes body stuck without scrolling
    onUnmounted(() => {
      removeOverflowIfApplicable();
    });

    return {
      modalOverlay,
      modalContents,
      shown,
      visibility,
      transition,
      onClickOutside,
      onEscPress,
      zIndex,
    };
  },
});
</script>

<style lang="less" scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
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
  top: -20px;
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
