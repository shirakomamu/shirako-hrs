<template>
  <div class="grid gap-1">
    <div class="flex flex-row items-center container">
      <div class="flex-grow">
        <input
          ref="inputElem"
          :type="show ? 'text' : 'password'"
          :value="value"
          v-bind="$attrs"
          :class="[
            classes,
            'pr-10',
            {
              invalid: validationError,
              'pr-20': !['failure', 'none'].includes(indicatorState),
            },
          ]"
          @input="onInput"
          @input.once="setTouched"
          @invalid="onInvalid"
        />
      </div>
      <div
        class="
          visibility-button
          px-2
          flex flex-row
          items-center
          justify-end
          gap-2
        "
      >
        <div class="">
          <Loader v-if="indicatorState === 'loading'" />
          <Error
            v-else-if="indicatorState === 'failure'"
            class="text-yellow-600 dark:text-yellow-500"
          />
          <Check
            v-else-if="indicatorState === 'success'"
            class="text-blue-srk"
          />
        </div>
        <button
          type="button"
          class="p-0"
          :title="show ? 'Hide password' : 'Show password'"
          @click="togglePasswordVisibility"
        >
          <VisibilityOff v-if="show" />
          <Visibility v-else />
        </button>
      </div>
    </div>
    <PasswordStrengthBar :strength="pwResult && Math.max(pwResult.score, 1)" />
    <div
      v-if="indicatorState === 'failure'"
      class="text-xs text-yellow-600 dark:text-yellow-500"
    >
      {{ validationError }}
    </div>
    <div v-else-if="passwordText" class="text-xs opacity-50">
      {{ passwordText }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import zxcvbn, { ZXCVBNResult } from "zxcvbn";
import Loader from "client/components/icons/Loader.vue";
import Check from "client/components/icons/Check.vue";
import Error from "client/components/icons/Error.vue";
import Visibility from "client/components/icons/Visibility.vue";
import VisibilityOff from "client/components/icons/VisibilityOff.vue";
import uniqueId from "@@/common/utils/uniqueId";

export default Vue.extend({
  name: "PasswordInput",
  components: {
    Loader,
    Check,
    Error,
    Visibility,
    VisibilityOff,
  },
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
      show: false as boolean,
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
    pwResult(): ZXCVBNResult | null {
      if (!this.value) {
        return null;
      }
      return zxcvbn(this.value);
    },
    passwordText(): string {
      if (!this.pwResult) {
        return "Enter a password.";
      }
      const pwStrength = Math.max(this.pwResult.score, 1);
      if (pwStrength >= 4) return "Very strong password.";
      if (pwStrength >= 3) return "Strong password.";
      if (pwStrength >= 2) return "Weak password.";
      return "Very weak password.";
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

        if (uid !== this.context) return;
        if (this.pwResult) {
          if (this.value && Math.max(this.pwResult.score, 1) < 3) {
            if (this.pwResult.feedback.warning) {
              this.setValidationError(this.pwResult.feedback.warning + ".");
            } else if (this.pwResult.feedback.suggestions.length) {
              this.setValidationError(
                this.pwResult.feedback.suggestions.join(" ")
              );
            }
          }
        }

        await this.$nextTick();

        if (uid !== this.context) return;
        if (!this.validationError) elem.checkValidity();

        this.validating = false;
      }, this.debounceMs);
    },
    onInvalid(el: Event) {
      this.setValidationError(
        (el.target as HTMLInputElement).validationMessage
      );
    },
    togglePasswordVisibility() {
      this.show = !this.show;
    },
  },
});
</script>

<style lang="less" scoped>
.container {
  position: relative;
}
.visibility-button {
  position: absolute;
  right: 0;
  outline: none;
}
</style>
