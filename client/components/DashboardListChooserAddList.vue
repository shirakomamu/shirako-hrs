<template>
  <div class="w-full">
    <ComboButton
      class="bg-blue-srk p-4 w-full text-right text-white font-semibold"
      @click="onCreateList"
      >Create list <IconsPlaylistAdd class="icon-inline h-8 w-8" />
    </ComboButton>

    <CreateListModal
      :visible="isCreateListModalVisible"
      :to-dashboard-after-create="true"
      @hide="isCreateListModalVisible = false"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@nuxtjs/composition-api";

export default defineComponent({
  name: "DashboardListChooserAddList",
  setup() {
    const isCreateListModalVisible = ref<boolean>(false);
    const onCreateList = () => {
      isCreateListModalVisible.value = true;
    };

    return { isCreateListModalVisible, onCreateList };
  },
});
</script>

<style lang="less" scoped></style>
