<template>
  <div class="grid gap-1">
    <div class="flex flex-row items-center container">
      <div class="flex-grow">
        <input
          ref="inputElem"
          :type="show ? 'text' : 'password'"
          :value="value"
          v-bind="$attrs"
          :class="[classes, { invalid: validationError }, 'pr-10']"
          @input="onInput"
          @input.once="setTouched"
          @invalid="onInvalid"
        />
      </div>
      <button
        class="visibility-button px-2"
        type="button"
        :title="show ? 'Hide password' : 'Show password'"
        @click="togglePasswordVisibility"
      >
        <VisibilityOff v-if="show" />
        <Visibility v-else />
      </button>
    </div>
    <PasswordStrengthBar :strength="pwResult && Math.max(pwResult.score, 1)" />
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
import zxcvbn, { ZXCVBNResult } from "zxcvbn";
import Visibility from "client/components/icons/Visibility.vue";
import VisibilityOff from "client/components/icons/VisibilityOff.vue";

export default Vue.extend({
  name: "PasswordInput",
  components: {
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
      default: 100,
    },
  },
  data() {
    return {
      touched: false as boolean,
      timer: null as any, // timeout object
      validationError: "" as string,
      show: false as boolean,
    };
  },
  computed: {
    passiveText(): string {
      if (this.validationError) {
        return "";
      }
      return this.passwordText;
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
          if (this.pwResult) {
            if (this.value && Math.max(this.pwResult.score, 1) < 3) {
              if (this.pwResult.feedback.warning) {
                this.validationError = this.pwResult.feedback.warning + ".";
              } else if (this.pwResult.feedback.suggestions.length) {
                this.validationError =
                  this.pwResult.feedback.suggestions.join(" ");
              }
            }
          }

          this.$nextTick(() => {
            if (!this.validationError) elem.checkValidity();
          });
        });

        clearTimeout(this.timer);
      }, this.debounceMs);
    },
    onInvalid(el: Event) {
      this.validationError = (el.target as HTMLInputElement).validationMessage;
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
