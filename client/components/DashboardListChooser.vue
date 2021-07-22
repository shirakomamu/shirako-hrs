<template>
  <div class="w-full">
    <div
      class="
        flex flex-col
        sm:flex-row
        bg-white bg-opacity-50
        dark:bg-opacity-5
        p-4
        sm:items-center
        gap-4
      "
    >
      <div class="grid grid-cols-1 gap-1 flex-grow">
        <div>
          <nuxt-link
            class="inline font-semibold hover:underline focus:underline"
            :to="`/u/${list.owner}/${list.id}`"
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
          ><Add v-if="!picked" class="icon-inline" /><Remove
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
import Add from "client/components/icons/Add.vue";
import Remove from "client/components/icons/Remove.vue";

export default defineComponent({
  name: "DashboardListChooser",
  components: {
    Add,
    Remove,
  },
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
