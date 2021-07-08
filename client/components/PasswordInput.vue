<template>
  <div class="grid grid-cols-1 gap-1">
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
              invalid: indicatorState === 'failure',
              'pr-18': !['failure', 'none'].includes(indicatorState),
            },
          ]"
          @input="onInput"
          @input.once="setTouched"
          @invalid="onInvalid"
        />
      </div>
      <div class="visibility-button flex flex-row items-center justify-end">
        <div v-if="indicatorState !== 'none'" class="w-8 pl-2">
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
          class="p-0 px-2"
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
import {
  computed,
  defineComponent,
  PropOptions,
  ref,
  watch,
  nextTick,
} from "@nuxtjs/composition-api";
import zxcvbn, { ZXCVBNResult } from "zxcvbn";
import Loader from "client/components/icons/Loader.vue";
import Check from "client/components/icons/Check.vue";
import Error from "client/components/icons/Error.vue";
import Visibility from "client/components/icons/Visibility.vue";
import VisibilityOff from "client/components/icons/VisibilityOff.vue";
import uniqueId from "common/utils/uniqueId";
import endWithString from "common/utils/endWithString";

export default defineComponent({
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
    dict: {
      type: Array,
      default: (): string[] => [],
    } as PropOptions<string[]>,
  },
  setup(props, { emit }) {
    // refs
    const inputElem = ref<HTMLInputElement | null>(null);

    // data
    const inputContext = ref<string>("0");
    const validating = ref<boolean>(false);
    const touching = ref<boolean>(false);
    const touched = ref<boolean>(false);
    const validationChecked = ref<boolean>(false);
    const timer = ref<any>(null);
    const validationError = ref<string>("");
    const show = ref<boolean>(false);

    // computed
    const indicatorState = computed(
      (): "success" | "loading" | "failure" | "none" => {
        if (!touched.value || !validationChecked.value || touching.value)
          return "none";
        if (validating.value) return "loading";
        if (validationError.value) return "failure";

        return "success";
      }
    );

    const pwResult = computed((): ZXCVBNResult | null => {
      if (!props.value) {
        return null;
      }
      return zxcvbn(props.value, props.dict);
    });

    const passwordText = computed((): string => {
      if (!pwResult.value) {
        return "Enter a password.";
      }
      const pwStrength = Math.max(pwResult.value.score, 1);
      if (pwStrength >= 4) return "Very strong password.";
      if (pwStrength >= 3) return "Strong password.";
      if (pwStrength >= 2) return "Weak password.";
      return "Very weak password.";
    });

    watch(
      () => props.dict,
      () => {
        touching.value = true;
        const uid = uniqueId();
        inputContext.value = uid;
        clearTimeout(timer.value);

        timer.value = setTimeout(async () => {
          await doValidate(uid);
        }, props.debounceMs);
      }
    );

    // methods
    const setValidationError = (newValue: string) => {
      (inputElem.value as HTMLInputElement)?.setCustomValidity(newValue);
      validationError.value = newValue;
      validationChecked.value = true;
    };

    const setTouched = () => {
      touched.value = true;
    };

    const onInput = (el: Event) => {
      touching.value = true;
      const uid = uniqueId();
      inputContext.value = uid;
      clearTimeout(timer);

      const elem = el.target as HTMLInputElement;
      const value = elem.value;
      emit("input", value);

      timer.value = setTimeout(async () => {
        await doValidate(uid);
      }, props.debounceMs);
    };

    const doValidate = async (uid: string) => {
      validating.value = true;
      touching.value = false;
      if (uid !== inputContext.value) return;
      setValidationError("");

      await nextTick();

      if (uid !== inputContext.value) return;
      if (pwResult.value) {
        if (props.value && Math.max(pwResult.value.score, 1) < 3) {
          if (pwResult.value.feedback.warning) {
            setValidationError(
              endWithString(pwResult.value.feedback.warning, ".")
            );
          } else if (pwResult.value.feedback.suggestions.length) {
            setValidationError(
              pwResult.value.feedback.suggestions
                .map((e) => endWithString(e, "."))
                .join(" ")
            );
          }
        }
      }

      await nextTick();

      if (uid !== inputContext.value) return;
      if (!validationError.value)
        (inputElem.value as HTMLInputElement).checkValidity();

      validating.value = false;
    };

    const onInvalid = (el: Event) => {
      setValidationError((el.target as HTMLInputElement).validationMessage);
    };

    const togglePasswordVisibility = () => {
      show.value = !show.value;
    };

    return {
      inputElem,

      inputContext,
      validating,
      touching,
      touched,
      validationChecked,
      timer,
      validationError,
      show,

      indicatorState,
      pwResult,
      passwordText,

      onInput,
      setTouched,
      onInvalid,
      togglePasswordVisibility,
    };
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
.pr-18 {
  padding-right: 4.5rem;
}
</style>
