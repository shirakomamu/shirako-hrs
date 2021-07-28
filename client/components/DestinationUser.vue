<template>
  <div class="bg-white bg-opacity-50 dark:bg-opacity-5 p-4 sm:(py-2 px-4)">
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

      <div>
        <ComboButton
          v-if="showDeleteButton"
          alt="Remove from list"
          class="w-full sm:w-max text-sm bg-orange-srk text-white"
          :disabled="isRemoving"
          :loading="isRemoving"
          @click="removeUser"
          ><IconsRemove class="icon-inline"
        /></ComboButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  name: "DestinationUser",
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
    isFriend: {
      type: Boolean,
      default: false,
    },
    isRemoving: {
      type: Boolean,
      default: false,
    },
    showDeleteButton: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const removeUser = () => {
      emit("pick", props.username);
    };

    return { removeUser };
  },
});
</script>

<style lang="less" scoped></style>
