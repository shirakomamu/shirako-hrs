<template>
  <div
    class="py-1 px-2 uppercase w-max text-xs font-semibold"
    :class="classAdder"
  >
    <Person v-if="visibility === ListVisibility.list" class="icon-inline" />
    <People
      v-else-if="visibility === ListVisibility.friends"
      class="icon-inline"
    />
    <Groups v-else class="icon-inline" />
    {{ listVisibilityText }}
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "@nuxtjs/composition-api";
import useListVisibilityOptions from "client/composables/useListVisibilityOptions";
import { ListVisibility } from "common/enums";
import Groups from "client/components/icons/Groups.vue";
import People from "client/components/icons/People.vue";
import Person from "client/components/icons/Person.vue";

export default defineComponent({
  name: "ListVisibilityIndicator",
  components: {
    Groups,
    People,
    Person,
  },
  props: {
    visibility: {
      type: String as PropType<ListVisibility>,
      required: true,
    },
  },
  setup(props) {
    const listOptions = useListVisibilityOptions();
    const listVisibilityText = computed(
      () =>
        listOptions.find((e) => e.value === props.visibility)?.text || "Unknown"
    );
    const classAdder = computed(() => {
      switch (props.visibility) {
        case ListVisibility.list:
          return ["text-purple-600", "dark:text-purple-400"];
        case ListVisibility.friends:
          return ["text-green-600", "dark:text-green-400"];
        default:
          return ["text-orange-srk"];
      }
    });

    return { listVisibilityText, classAdder, ListVisibility };
  },
});
</script>

<style lang="less" scoped></style>
