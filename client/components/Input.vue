<template>
  <div class="grid grid-cols-1 gap-1">
    <div class="flex flex-row items-center container">
      <div class="flex-grow">
        <input
          ref="inputElem"
          :value="value"
          v-bind="$attrs"
          :class="[
            classes,
            {
              invalid: indicatorState === 'failure',
              'pr-10': !['failure', 'none'].includes(indicatorState),
            },
          ]"
          @input.once="setTouched"
          @invalid="onInvalid"
          v-on="{
            ...$listeners,
            input: (event) => onInput(event),
          }"
        />
      </div>
      <div class="check-mark px-2 w-10">
        <Loader v-if="indicatorState === 'loading'" />
        <Error
          v-else-if="indicatorState === 'failure'"
          class="text-yellow-600 dark:text-yellow-500"
        />
        <Check v-else-if="indicatorState === 'success'" class="text-blue-srk" />
      </div>
    </div>
    <slot />
    <div
      v-if="indicatorState === 'failure'"
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
import Loader from "client/components/icons/Loader.vue";
import Check from "client/components/icons/Check.vue";
import Error from "client/components/icons/Error.vue";
import uniqueId from "@@/common/utils/uniqueId";

export default Vue.extend({
  name: "Input",
  components: { Loader, Check, Error },
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
      default: 1000,
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
      context: "0" as string,
      validating: false as boolean,
      touching: false as boolean,
      touched: false as boolean,
      validationChecked: false as boolean,
      timer: null as any, // timeout object
      validationError: "" as string,
    };
  },
  computed: {
    indicatorState(): "success" | "loading" | "failure" | "none" {
      if (!this.touched || !this.validationChecked || this.touching)
        return "none";
      if (this.validating) return "loading";
      if (this.validationError) return "failure";

      return "success";
    },
  },
  methods: {
    setValidationError(newValue: string) {
      (this.$refs.inputElem as HTMLInputElement)?.setCustomValidity(newValue);
      this.validationError = newValue;
      this.validationChecked = true;
    },
    setTouched() {
      this.touched = true;
    },
    onInput(el: Event) {
      this.touching = true;
      const uid = uniqueId();
      this.context = uid;
      clearTimeout(this.timer);

      const elem = el.target as HTMLInputElement;
      const value = elem.value;
      this.$emit("input", value);

      this.timer = setTimeout(async () => {
        this.validating = true;
        this.touching = false;
        if (uid !== this.context) return;
        this.setValidationError("");

        await this.$nextTick();

        if (this.validator) {
          const validatorValue = (await this.validator(value)) || "";
          if (uid !== this.context) return;
          this.setValidationError(validatorValue);

          await this.$nextTick();

          if (uid !== this.context) return;
          if (!this.validationError) elem.checkValidity();
        } else {
          if (uid !== this.context) return;
          elem.checkValidity();
        }

        this.validating = false;
      }, this.debounceMs);
    },
    onInvalid(el: Event) {
      this.setValidationError(
        (el.target as HTMLInputElement).validationMessage
      );
    },
  },
});
</script>

<style lang="less" scoped>
.container {
  position: relative;
}
.check-mark {
  position: absolute;
  right: 0;
}
</style>
