<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="{
      'opacity-50': loading || disabled,
      'disable-pointer': loading || disabled,
    }"
    v-on="$listeners"
  >
    <Loader v-show="loading" ref="loader" />
    <slot v-if="!loading" />
  </button>
</template>

<script lang="ts">
import Vue from "vue";
import Loader from "client/components/icons/Loader.vue";
import assert from "@@/common/utils/assert";

export default Vue.extend({
  name: "ComboButton",
  components: {
    Loader,
  },
  props: {
    type: {
      type: String,
      default: () => "button",
    },
    disabled: {
      type: Boolean,
      default: () => false,
    },
    loading: {
      type: Boolean,
      default: () => false,
    },
  },
  mounted() {
    const loader = this.$refs.loader;
    if (loader) {
      assert<Vue>(loader);

      const loaderEl = loader.$el;
      assert<HTMLElement>(loaderEl);

      const computedStyle = window.getComputedStyle(loaderEl);
      loaderEl.style.height = computedStyle.lineHeight;
    }
  },
});
</script>

<style lang="less" scoped>
.disable-pointer {
  cursor: not-allowed;
}
</style>
