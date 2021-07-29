<template>
  <div class="w-full">
    <div
      class="
        flex flex-col
        sm:(flex-row
        items-center)
        bg-white/50
        dark:bg-white/5
        p-4
        gap-4
      "
    >
      <div class="grid grid-cols-1 gap-1 flex-grow">
        <div>
          <nuxt-link
            class="inline font-semibold hover:underline focus:underline"
            :to="{
              path: `/u/${list.owner}/${list.id}`,
              query: {
                db: '1',
              },
            }"
            >{{ list.name }}</nuxt-link
          >
          <nuxt-link
            class="text-sm opacity-50 hover:underline focus:underline w-min"
            :to="`/u/${list.owner}`"
            >@{{ list.owner }}</nuxt-link
          >
        </div>

        <ListVisibilityIndicator :visibility="list.visibility" class="inline" />

        <p class="text-sm" :class="{ italic: !list.description }">
          {{ list.description || "No description provided." }}
        </p>
      </div>
      <div>
        <ComboButton
          alt="Use list"
          class="text-white text-sm w-full sm:w-max"
          :class="{
            'bg-blue-srk': !picked,
            'bg-orange-srk': picked,
          }"
          :loading="loading"
          :disabled="disabled"
          @click="onPick"
          ><IconsAdd v-if="!picked" class="icon-inline" /><IconsRemove
            v-else
            class="icon-inline"
          />
          {{ picked ? "Remove" : "Add" }}</ComboButton
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@nuxtjs/composition-api";
import { Item } from "@vuex-orm/core";
import { DestinationListModel } from "client/models";

export default defineComponent({
  name: "DashboardListChooser",
  props: {
    list: {
      type: Object as PropType<Item<DestinationListModel>>,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    picked: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const onPick = () => {
      emit("pick", props.list?.id);
    };

    return { onPick };
  },
});
</script>

<style lang="less" scoped></style>
