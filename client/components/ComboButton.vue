<template>
  <button
    :type="type"
    :disabled="disabled"
    class="
      button-container
      hover:font-semibold
      focus:font-semibold
      disabled:font-normal
    "
    :class="{
      'opacity-50': loading || disabled,
      'disable-pointer': loading || disabled,
    }"
    v-on="$listeners"
  >
    <Loader v-if="loading" class="loader" />
    <div :class="{ hide: loading }">
      <slot />
    </div>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import Loader from "client/components/icons/Loader.vue";

export default defineComponent({
  name: "ComboButton",
  components: {
    Loader,
  },
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
  height: 1.5em;
  position: absolute;
  left: calc(50% - 0.75em);
  top: calc(50% - 0.75em);
}

.hide {
  opacity: 0;
}
</style>
