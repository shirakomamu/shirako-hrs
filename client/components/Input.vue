<template>
  <div class="grid gap-1">
    <input
      ref="inputElem"
      :value="value"
      v-bind="$attrs"
      :class="[classes, { invalid: validationError }]"
      @input="onInput"
      @input.once="setTouched"
      @invalid="onInvalid"
    />
    <slot />
    <div
      v-if="validationError"
      class="text-xs text-yellow-600 dark:text-yellow-500"
    >
      {{ validationError }}
    </div>
    <div v-else-if="passiveText" class="text-xs opacity-50">
      {{ passiveText }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Input",
  inheritAttrs: false,
  props: {
    value: {
      type: String,
      default: null,
    },
    classes: {
      type: String,
      default: "",
    },
    debounceMs: {
      type: Number,
      default: 100,
    },
    // if validator returns a non-empty string, it will display it as a validation error
    // if it's an empty string or true, then it will be valid
    // if it's false, then it will be invalid without a validation error
    validator: {
      type: Function,
      default: undefined,
    },
    passiveText: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      touched: false as boolean,
      timer: null as any, // timeout object
      validationError: "" as string,
    };
  },
  watch: {
    validationError(newValue: string) {
      (this.$refs.inputElem as HTMLInputElement)?.setCustomValidity(newValue);
    },
  },
  methods: {
    setTouched() {
      this.touched = true;
    },
    onInput(el: Event) {
      const elem = el.target as HTMLInputElement;
      const value = elem.value;
      this.$emit("input", value);
      this.timer = setTimeout(() => {
        this.validationError = "";

        this.$nextTick(() => {
          if (this.validator) {
            this.validationError = this.validator(value) || "";

            this.$nextTick(() => {
              if (!this.validationError) elem.checkValidity();
            });
          } else {
            elem.checkValidity();
          }
        });

        clearTimeout(this.timer);
      }, this.debounceMs);
    },
    onInvalid(el: Event) {
      this.validationError = (el.target as HTMLInputElement).validationMessage;
    },
  },
});
</script>

<style lang="less" scoped></style>
