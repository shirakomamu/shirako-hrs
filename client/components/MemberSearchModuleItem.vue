<template>
  <div class="gap-2 bg-white/50 dark:bg-white/5 p-4 sm:(py-2 px-4) max-w-2xl">
    <div class="flex flex-col sm:(flex-row items-center) gap-2">
      <div class="flex flex-row items-center gap-2">
        <div class="flex-shrink-0">
          <img
            :src="avatar"
            class="profile-avatar rounded-full"
            alt="Avatar"
            width="32"
            height="32"
          />
        </div>
        <div class="grid grid-cols-1 text-sm text-center sm:text-left">
          <p class="font-semibold truncate">
            <IconsPerson v-if="isFriend" class="icon-inline opacity-50" />
            {{ nickname }}
          </p>
          <nuxt-link
            :to="`/u/${username}`"
            class="opacity-50 hover:underline focus:underline truncate"
            >@{{ username }}</nuxt-link
          >
        </div>
      </div>

      <div class="flex-grow" />

      <div v-if="showAddButton">
        <ComboButton
          :alt="!isAdded ? 'Add to list' : 'Added'"
          class="w-full sm:w-max text-sm bg-blue-srk text-white"
          :disabled="disabled || isAdded || isAdding"
          :loading="isAdding"
          @click="addUser"
          ><IconsAdd class="icon-inline" />
          {{ !isAdded ? "Add to list" : "Added" }}</ComboButton
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  name: "MemberSearchModuleItem",
  props: {
    username: {
      type: String,
      required: true,
    },
    nickname: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    showAddButton: {
      type: Boolean,
      default: false,
    },
    isAdded: {
      type: Boolean,
      default: false,
    },
    isAdding: {
      type: Boolean,
      default: false,
    },
    isFriend: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const addUser = () => {
      emit("pick", props.username);
    };

    return { addUser };
  },
});
</script>

<style lang="less" scoped></style>
