<template>
  <div class="grid grid-cols-1 gap-1">
    <label :for="thisUid">{{ label }}</label>
    <div class="flex flex-row items-center container">
      <div class="flex-grow">
        <input
          :id="thisUid"
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
import {
  defineComponent,
  ref,
  computed,
  nextTick,
  watch,
  PropType,
} from "@nuxtjs/composition-api";
import Loader from "client/components/icons/Loader.vue";
import Check from "client/components/icons/Check.vue";
import Error from "client/components/icons/Error.vue";
import uniqueId from "common/utils/uniqueId";

export default defineComponent({
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
      type: Function as PropType<(...args: any) => Promise<string>>,
      default: () => "",
    },
    passiveText: {
      type: String,
      default: "",
    },
    doValidation: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    // refs
    const inputElem = ref<HTMLInputElement | null>(null);

    const uid = uniqueId();

    const thisUid = "input-" + uid;

    // data
    const inputContext = ref("0");
    const validating = ref(false);
    const touching = ref(false);
    const touched = ref(false);
    const validationChecked = ref(false);
    const timer = ref<any>(null);
    const validationError = ref("");

    const indicatorState = computed(
      (): "success" | "loading" | "failure" | "none" => {
        if (!touched.value || !validationChecked.value || touching.value)
          return "none";
        if (validating.value) return "loading";
        if (validationError.value) return "failure";
        return "success";
      }
    );

    // methods
    const focus = () => inputElem.value?.focus();

    const setValidationError = (newValue: string) => {
      (inputElem.value as HTMLInputElement)?.setCustomValidity(newValue);
      validationError.value = newValue;
      validationChecked.value = true;
    };

    const setTouched = (state = true) => {
      touched.value = state;
    };

    const onInput = (el: Event) => {
      if (!touched.value) {
        setTouched(true);
      }
      touching.value = true;
      const uid = uniqueId();
      inputContext.value = uid;
      clearTimeout(timer.value);

      const elem = el.target as HTMLInputElement;
      const value = elem.value;
      emit("input", value);

      if (props.doValidation) {
        timer.value = setTimeout(async () => {
          validating.value = true;
          touching.value = false;
          if (uid !== inputContext.value) return;
          setValidationError("");

          await nextTick();

          if (props.validator) {
            const validatorValue = (await props.validator(value)) || "";
            if (uid !== inputContext.value) return;
            setValidationError(validatorValue);

            await nextTick();

            if (uid !== inputContext.value) return;
            if (!validationError.value) elem.checkValidity();
          } else {
            if (uid !== inputContext.value) return;
            elem.checkValidity();
          }

          validating.value = false;
        }, props.debounceMs);
      }
    };

    const onInvalid = (el: Event) => {
      setValidationError((el.target as HTMLInputElement).validationMessage);
    };

    watch(
      () => props.value,
      () => {
        if (!touching.value) {
          validating.value = false;
          touching.value = false;
          setValidationError("");
        }
      }
    );

    return {
      thisUid,

      inputElem,
      inputContext,
      validating,
      touching,
      touched,
      validationChecked,
      timer,
      validationError,
      indicatorState,

      focus,
      setTouched,
      onInput,
      onInvalid,
    };
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
  outline: none;
}
</style>
