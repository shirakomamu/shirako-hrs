<template>
  <div class="space-y-8 flex flex-col">
    <Drop
      :visible="helpVisible"
      container-class="p-8 drop-bottom drop-right bg-gray-100 dark:bg-gray-800 filter drop-shadow-lg text-sm"
      @hide="helpVisible = false"
    >
      <template #default>
        <div class="flex flex-row gap-2 items-end">
          <h5 class="text-4xl dark:text-white">Dashboard</h5>
          <ComboButton
            alt="Show instructions"
            class="p-0 text-orange-srk dark:text-blue-srk"
            @click="helpVisible = true"
            ><IconsHelpOutline class="icon-inline h-8 w-8"
          /></ComboButton></div></template
      ><template #tooltip>
        <p class="font-semibold">How to use</p>
        <ol class="pl-4 list-decimal list-outside">
          <li>Select from your lists, or search for others' lists.</li>
          <li>
            Press
            <span class="text-orange-srk dark:text-blue-srk"
              ><IconsPlayArrow class="icon-inline" /> Activate neurons</span
            >
            at the bottom.
          </li>
          <li>
            We'll show you the destinations that appear most often in the chosen
            lists. If business hours data is available, we'll only choose
            restaurants open for at least the next hour.
          </li>
        </ol>
      </template></Drop
    >
    <div
      v-if="isActivating || isOnArtificialDelay"
      class="flex-grow flex flex-col justify-center"
    >
      <div class="grid grid-cols-1 gap-4 place-items-center">
        <div>
          <IconsArtificialLoader
            class="text-8xl icon-inline text-orange-srk dark:text-blue-srk"
          />
        </div>
        <p class="text-2xl text-center">{{ activatingMessage }}</p>
      </div>
    </div>
    <div v-else-if="!isActivated" class="space-y-8">
      <div
        class="
          grid grid-cols-1
          md:grid-cols-2
          bg-gray-200
          dark:bg-gray-700
          p-8
          gap-4
        "
      >
        <div class="flex flex-col gap-4 col-container-grid">
          <Drop
            :visible="hasSearched && showSearchTooltip"
            container-class="w-full p-2 drop-bottom drop-right bg-gray-100 dark:bg-gray-800 filter drop-shadow-lg"
            max-width="100%"
            @hide="showSearchTooltip = false"
          >
            <template #default>
              <div>
                <label :for="termUid">Search...</label>
                <Input
                  :id="termUid"
                  ref="termInput"
                  v-model="term"
                  type="text"
                  name="searchTerm"
                  classes="p-2 text-sm w-full"
                  passive-text="Search by list name, description, username, or nickname."
                  min="1"
                  max="64"
                  :do-validation="true"
                  :validator="onSearch"
                  @click="showSearchTooltip = true"
                />
              </div>
            </template>
            <template #tooltip>
              <div
                class="
                  flex-grow
                  space-y-2
                  px-2
                  border-l-4 border-opacity-20 border-black
                  dark:border-white
                "
              >
                <p v-if="!availableListSearchResults.length" class="m-2">
                  No results found.
                </p>
                <DashboardListChooser
                  v-for="(list, index) in availableListSearchResults"
                  :key="index"
                  :list="list"
                  :disabled="maxNeuronsReached"
                  @pick="onPick"
                />
              </div>
            </template>
          </Drop>
          <p class="text-xl dark:text-white font-semibold">Quick lists</p>
          <div
            class="
              flex-grow
              space-y-2
              px-2
              overflow-y-scroll
              border-l-4 border-opacity-20 border-black
              dark:border-white
            "
          >
            <DashboardListChooserAddList />
            <div v-if="isLoading">
              <IconsLoader class="text-orange-srk dark:text-blue-srk h-8 w-8" />
            </div>
            <p v-else-if="!unselectedLists.length && !isLoading" class="m-2">
              No lists available.
            </p>
            <DashboardListChooser
              v-for="(list, index) in unselectedLists"
              :key="index"
              :list="list"
              :disabled="maxNeuronsReached"
              @pick="onPick"
            />
          </div>
        </div>

        <div class="flex flex-col gap-4 col-container-grid">
          <p class="text-xl dark:text-white font-semibold">
            Selected
            <span
              class="transition opacity-50"
              :class="{
                'text-orange-srk opacity-100': maxNeuronsReached,
              }"
              >({{ selectedLists.length }} / {{ maxNeurons }})</span
            >
          </p>
          <div
            class="
              flex-grow
              space-y-2
              px-2
              overflow-y-scroll
              border-l-4 border-opacity-20 border-black
              dark:border-white
            "
          >
            <p v-if="!selectedLists.length" class="m-2">
              Select lists to get started.
            </p>
            <DashboardListChooser
              v-for="(list, index) in selectedLists"
              :key="index"
              :list="list"
              :picked="true"
              @pick="onUnpick"
            />
          </div>
        </div>
      </div>

      <div class="w-full text-right">
        <ComboButton
          class="w-full sm:w-auto text-white bg-orange-srk dark:bg-blue-srk"
          :class="{
            'font-bold': selectedLists.length,
          }"
          :alt="
            selectedLists.length ? 'Activate neurons' : 'Neurons not available'
          "
          :disabled="!selectedLists.length || isActivating"
          :loading="isActivating"
          @click="activateNeurons"
        >
          <IconsPlayArrow
            v-if="selectedLists.length"
            class="h-6 w-6 icon-inline"
          />
          {{
            selectedLists.length ? "Activate neurons" : "Neurons not available"
          }}
        </ComboButton>
      </div>
    </div>
    <div v-else-if="isActivated" class="space-y-8">
      <ComboButton
        class="
          text-lg text-orange-srk
          dark:text-blue-srk
          hover:underline
          focus:underline
        "
        @click="deactivateNeurons"
        ><IconsArrowBack class="icon-inline" /> Back to start</ComboButton
      >
      <div class="grid grid-cols-1 justify-items-center w-full">
        <div
          class="
            grid grid-cols-1
            w-full
            max-w-md
            bg-gray-200
            dark:bg-gray-700
            p-8
            gap-8
          "
        >
          <p class="text-center">
            From
            <span class="font-semibold">{{ possibleNeurons }}</span
            >; to
            <span class="font-semibold text-orange-srk dark:text-blue-srk">{{
              neuronResults.length
            }}</span
            >.
          </p>
          <div v-if="!neuronResults.length">
            <p>No neurons available.</p>
          </div>
          <div
            v-for="(item, index) in neuronResults.slice(
              0,
              allNeuronsShown ? neuronResults.length : 1
            )"
            :key="item.id"
            class="space-y-2"
          >
            <p class="text-center font-semibold text-3xl neuron-title">
              {{ index + 1 }}
            </p>
            <p class="text-xs text-right">
              <span class="opacity-50">in</span>
              <Drop
                :visible="listViewerVisibility[index]"
                class="inline"
                container-class="p-4 drop-bottom drop-left bg-gray-100 dark:bg-gray-800 filter drop-shadow-lg text-xs w-max"
                :close-after="2000"
                @hide="listViewerVisibility[index] = false"
              >
                <template #default>
                  <ComboButton
                    class="inline p-0"
                    @click="listViewerVisibility[index] = true"
                  >
                    {{ rPayloadStore[index].lists.length }} list{{
                      rPayloadStore[index].lists.length === 1 ? "" : "s"
                    }}</ComboButton
                  ></template
                ><template #tooltip>
                  <p
                    v-for="(list, listIndex) in rPayloadStore[index].lists"
                    :key="item.id + '_' + listIndex"
                  >
                    {{ list }}
                  </p>
                </template>
              </Drop>

              <span class="opacity-50">by</span>
              <Drop
                :visible="userViewerVisibility[index]"
                class="inline"
                container-class="p-4 drop-bottom drop-left bg-gray-100 dark:bg-gray-800 filter drop-shadow-lg text-xs w-max"
                :close-after="2000"
                @hide="userViewerVisibility[index] = false"
              >
                <template #default>
                  <ComboButton
                    class="inline p-0"
                    @click="userViewerVisibility[index] = true"
                    >{{ rPayloadStore[index].users.length }} user{{
                      rPayloadStore[index].users.length === 1 ? "" : "s"
                    }}</ComboButton
                  ></template
                ><template #tooltip>
                  <p
                    v-for="(user, userIndex) in rPayloadStore[index].users"
                    :key="item.id + '_' + userIndex"
                  >
                    {{ (user === "n/a" ? "" : "@") + user }}
                  </p>
                </template>
              </Drop>
            </p>
            <DestinationItem
              :id="item.id"
              class="w-full"
              :name="item.name"
              :image_url="item.image_url"
              :url="item.url"
              :price="item.price"
              :rating="item.rating"
              :review_count="item.review_count"
              :display_address="item.display_address"
              :display_phone="item.display_phone"
              :timezone="item.timezone"
              :hours="item.hours"
              :special_hours="item.special_hours"
              :regular-hours="item.regularHours"
              :time-until-close="item.getTimeUntilClose(time)"
              :last-updated="item.lastUpdated"
            />
          </div>

          <ComboButton
            v-if="neuronResults.length > 1 && !allNeuronsShown"
            class="
              text-orange-srk
              dark:text-blue-srk
              hover:underline
              focus:underline
              text-center
              w-full
            "
            @click="allNeuronsShown = true"
            >Show more</ComboButton
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Role } from "common/enums/hrbac";
import { Guard } from "common/types/hrbac";
import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  ref,
  useContext,
  useMeta,
  useRoute,
  useRouter,
  useStore,
  watch,
} from "@nuxtjs/composition-api";
import useSelf from "client/composables/useSelf";
import {
  DestinationItemModel,
  DestinationListModel,
  MemberModel,
} from "client/models";
import { Collection, Item } from "@vuex-orm/core";
import uniqueId from "common/utils/uniqueId";
import Input from "client/components/Input.vue";
import useInternalApi from "client/composables/useInternalApi";
import { MAX_NEURONS } from "server/config/dataLimits";
import { IActivatedNeuronsPayload, NeuronData } from "common/types/api";
import { ActivateNeuronsDto } from "common/dto/neurons";

export default defineComponent({
  meta: {
    guard: {
      roles: [Role._self_destination_lists],
    } as Guard,
  },
  setup() {
    const context = useContext();
    const self = useSelf();
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const api = useInternalApi();
    useMeta({ title: "Dashboard | " + context.$config.appinfo.name });

    const maxNeurons = MAX_NEURONS;
    const maxNeuronsReached = computed(
      () => selectedLists.value.length >= maxNeurons
    );

    const helpVisible = ref<boolean>(false);

    const selectedLists = computed(() => {
      return listModel.query().where("id", selectedListsIds.value).get();
    });
    const selectedListsIds = computed<string[]>(
      () => store.getters.selectedNeurons || []
    );
    const listSearchResults = ref<Item<DestinationListModel>[]>([]);
    const isLoading = ref<boolean>(true);

    const memberModel = store.$db().model(MemberModel);
    const member = computed(() =>
      memberModel
        .query()
        .with(["lists", "lists.items"])
        .find(self.value?.username || "")
    );
    const destinationLists = computed(() => [
      ...(member.value?.lists || []).sort((a, b) =>
        (a.name || "").localeCompare(b.name)
      ),
      ...listModel
        .query()
        .where("isOfInterest", true)
        .get()
        .sort((a, b) => (a.name || "").localeCompare(b.name)),
    ]);
    const unselectedLists = computed(() =>
      destinationLists.value.filter(
        (e) => !selectedListsIds.value.includes(e.id)
      )
    );

    onMounted(async () => {
      isLoading.value = true;
      await Promise.all([
        memberModel.apiFetch(self.value?.username || ""),
        listModel.getListsOfInterest(),
      ]);
      isLoading.value = false;
      allNeuronsShown.value = false;
    });

    const listModel = store.$db().model(DestinationListModel);

    const termInput = ref<null | InstanceType<typeof Input>>(null);
    const uid = uniqueId();
    const termUid = "term-" + uid;
    const term = ref<null | string>(null);
    const hasSearched = ref<boolean>(false);
    const showSearchTooltip = ref<boolean>(false);
    const onSearch = async (value: string) => {
      if (!value) {
        termInput.value?.setTouched(false);
        return;
      }
      listSearchResults.value = await listModel.apiSearch({
        keyword: value,
        pickedIds: selectedListsIds.value,
      });
      hasSearched.value = true;
      showSearchTooltip.value = true;
    };
    const availableListSearchResults = computed(() =>
      listSearchResults.value.filter(
        (e) => e && !selectedListsIds.value.includes(e.id)
      )
    );

    const onPick = (id: string) => {
      const list = listModel.query().where("id", id).first();
      if (!list) return;

      // if (selectedLists.value.includes(list)) return;
      if (store.getters.selectedNeurons.includes(id)) return;
      if (maxNeuronsReached.value) return;
      // selectedLists.value.push(id);
      store.commit("addNeuron", id);
    };

    const onUnpick = (id: string) => {
      // selectedLists.value = selectedLists.value.filter((e) => e && e.id !== id);
      store.commit("removeNeuron", id);
    };

    const model = store.$db().model(DestinationItemModel);
    const isActivating = ref<boolean>(false);
    const possibleNeurons = ref<number>(0);
    const hasActivated = ref<boolean>(false);
    const rPayloadStore = ref<NeuronData[]>([]);
    const userViewerVisibility = ref<boolean[]>([]);
    const listViewerVisibility = ref<boolean[]>([]);
    const activateNeurons = async () => {
      if (!selectedLists.value.length) return;
      activatingMessage.value =
        possibleMessages.value[
          Math.floor(Math.random() * possibleMessages.value.length)
        ];
      isOnArtificialDelay.value = true;
      isActivating.value = true;
      setTimeout(() => (isOnArtificialDelay.value = false), 3000);
      const r = await api<IActivatedNeuronsPayload>({
        method: "post",
        url: "/api/neurons/activate",
        data: {
          neurons: selectedLists.value.map((e) => e?.id),
        } as ActivateNeuronsDto,
      });
      isActivating.value = false;

      if (r.ok) {
        const modelSafeNeurons = r.payload.neurons.map((e) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { lists, users, ...rest } = e;

          // lists and users are discarded because they cause relation conflict in ORM
          return rest;
        });
        userViewerVisibility.value = Array(r.payload.neurons.length).fill(
          false
        );
        listViewerVisibility.value = Array(r.payload.neurons.length).fill(
          false
        );
        await model.insertOrUpdate({
          data: modelSafeNeurons,
        });
        neuronResults.value = model
          .query()
          .whereIdIn(r.payload.neurons.map((e) => e.id))
          .get();
        rPayloadStore.value = r.payload.neurons;
        possibleNeurons.value = r.payload.totalNeurons;
        isActivated.value = true;
        hasActivated.value = true;
        router.push("/dashboard?neurons=activated");
      }
    };

    if (route.value.query.neurons) {
      router.replace("/dashboard");
    }

    watch(
      () => route.value.query.neurons,
      (newNeuronState) => {
        allNeuronsShown.value = false;
        if (newNeuronState !== "activated") {
          isActivated.value = false;
        } else if (newNeuronState === "activated" && hasActivated.value) {
          isActivated.value = true;
        }
      }
    );

    const deactivateNeurons = () => {
      router.push("/dashboard");
      allNeuronsShown.value = false;
    };

    const time = ref<number>(Date.now());
    const timeUpdater = ref<any>(null);

    onMounted(() => {
      timeUpdater.value = setInterval(() => {
        time.value = Date.now();
      }, 600);
    });

    onUnmounted(() => {
      clearInterval(timeUpdater.value);
    });

    // onMounted(() => {
    //   context.$emitter.on("go-to-dashboard", deactivateNeurons);
    // });
    // onUnmounted(() => {
    //   context.$emitter.off("go-to-dashboard", deactivateNeurons);
    // });

    const isActivated = ref<boolean>(false);
    const neuronResults = ref<Collection<DestinationItemModel>>([]);
    const allNeuronsShown = ref<boolean>(false);
    const isOnArtificialDelay = ref<boolean>(false);
    const activatingMessage = ref<string>("Hang on tight...");
    const possibleMessages = ref<string[]>([
      "Hang on tight...",
      "Activating neurons...",
      "Working on it...",
      "Variety is spicy...",
      "Reticulating splines...",
      "Don't touch my ship!",
      "A rolling stone gathers no bugs...",
      "Getting things ready...",
      "Suspense is golden...",
      "Activating almonds...",
    ]);

    return {
      time,
      maxNeurons,
      maxNeuronsReached,
      allNeuronsShown,
      isOnArtificialDelay,
      possibleMessages,
      activatingMessage,

      member,
      helpVisible,
      destinationLists,
      selectedLists,
      selectedListsIds,
      unselectedLists,
      listSearchResults,
      availableListSearchResults,
      isLoading,

      termInput,
      uid,
      termUid,
      term,
      hasSearched,
      showSearchTooltip,
      onSearch,

      onPick,
      onUnpick,

      isActivating,
      activateNeurons,
      isActivated,
      hasActivated,
      neuronResults,
      possibleNeurons,
      deactivateNeurons,
      rPayloadStore,
      listViewerVisibility,
      userViewerVisibility,
    };
  },
  // required for useMeta to work
  head: {},
});
</script>

<style lang="less" scoped>
.col-container-grid {
  max-height: max(70vh, 600px);
}
.neuron-title {
  overflow: hidden;
}
.neuron-title:before,
.neuron-title:after {
  background-color: currentColor;
  content: "";
  display: inline-block;
  height: 1px;
  position: relative;
  vertical-align: middle;
  width: 50%;
}

.neuron-title:before {
  right: 0.5em;
  margin-left: -50%;
}

.neuron-title:after {
  left: 0.5em;
  margin-right: -50%;
}
</style>
