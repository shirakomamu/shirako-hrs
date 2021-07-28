<template>
  <button
    :type="type"
    :disabled="disabled"
    class="
      transition
      button-container
      bg-opacity-80
      hover:bg-opacity-100
      focus:bg-opacity-100
      disabled:bg-opacity-50
      border-opacity-80
      hover:border-opacity-100
      focus:border-opacity-100
      disabled:border-opacity-50
    "
    :class="{
      'opacity-50': loading || disabled,
      'disable-pointer': loading || disabled,
    }"
    v-on="$listeners"
  >
    <IconsLoader v-if="loading" class="loader h-6" />
    <div :class="{ hide: loading }" class="w-full h-full">
      <slot />
    </div>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  name: "ComboButton",
  props: {
    type: {
      type: String,
      default: "button",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="less" scoped>
.disable-pointer {
  cursor: not-allowed;
}

.button-container {
  position: relative;
}

.loader {
  position: absolute;
  left: calc(50% - 0.75em);
  top: calc(50% - 0.75em);
}

.hide {
  opacity: 0;
}
</style>
