<template>
  <div class="space-y-8">
    <h5>Home</h5>
    <div class="grid grid-cols-1 md:grid-cols-2 grid-flow-row">
      <div class="grid grid-cols-1 col-span-2 md:col-span-1 place-items-center">
        <Input
          v-model="test"
          name="input"
          type="text"
          classes="p-2 text-sm w-full"
          :do-validation="true"
          required
        />
        <br />
        <PasswordInput
          v-model="test"
          name="password"
          classes="p-2 text-sm w-full"
          required
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  useContext,
  useMeta,
} from "@nuxtjs/composition-api";

export default defineComponent({
  name: "Index",
  setup() {
    const context = useContext();
    useMeta({ title: "Home | " + context.$config.appinfo.name });

    const test = ref<string | null>(null);
    return {
      test,
    };
  },
  head: {},
});
</script>

<style lang="less" scoped></style>
