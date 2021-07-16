<template>
  <div class="space-y-4">
    <form class="grid grid-cols-1 gap-4" @submit.prevent="onSearch">
      <div>
        <label :for="termUid">Search term</label>
        <Input
          :id="termUid"
          ref="termInput"
          v-model="term"
          type="text"
          name="searchTerm"
          classes="p-2 text-sm w-full"
          passive-text="Restaurant or food to search for."
          required
          :disabled="isSearching"
        />
      </div>
      <div>
        <label :for="locationUid">Location</label>
        <Input
          :id="locationUid"
          ref="locationInput"
          v-model="location"
          type="text"
          name="location"
          classes="p-2 text-sm w-full"
          passive-text="Location to search near. You can use an address, ZIP code, or city name."
          required
          :disabled="isSearching"
        />
      </div>
      <div>
        <ComboButton
          type="submit"
          alt="Search"
          class="text-sm border w-full"
          :loading="isSearching"
          :disabled="isSearching"
          ><Search class="icon-inline" /> Search</ComboButton
        >
      </div>
      <div class="flex flex-row justify-end">
        <a
          class="flex flex-row items-center gap-1"
          href="https://yelp.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <p class="text-xs">data provided by</p>
          <img class="yelp-icon" alt="Yelp logo" width="64" />
        </a>
      </div>
    </form>
    <div v-if="searchResults.total >= 0" class="grid grid-cols-1 gap-2">
      <div v-for="(item, index) in searchResults.items" :key="index">
        <hr v-if="index === 0" class="mb-2" />
        <YelpSearchModuleItem
          :id="item.id"
          :name="item.name"
          :url="item.url"
          :price="item.price"
          :rating="item.rating"
          :review_count="item.review_count"
          :display_address="item.display_address"
          :display_phone="item.display_phone"
          :last-updated="item.lastUpdated"
        />
        <hr class="mt-2" />
      </div>

      <div v-if="searchResults.total === 0">
        <hr class="mb-4" />
        <p>No results were found.</p>
        <hr class="mt-4" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@nuxtjs/composition-api";
import useInternalApi from "client/composables/useInternalApi";
import useSelf from "client/composables/useSelf";
import { BusinessSearchDto } from "common/dto/items";
import {
  DestinationItemMetadata,
  IDestinationSearchPayload,
} from "common/types/api/items";
import Input from "client/components/Input.vue";
import Search from "client/components/icons/Search.vue";
import uniqueId from "common/utils/uniqueId";

export default defineComponent({
  name: "YelpSearchModule",
  components: {
    Search,
  },
  setup() {
    const self = useSelf();
    const api = useInternalApi();

    // refs
    const termInput = ref<null | InstanceType<typeof Input>>(null);
    const locationInput = ref<null | InstanceType<typeof Input>>(null);

    const uid = uniqueId();
    const termUid = "term-" + uid;
    const locationUid = "location-" + uid;

    // data
    const isSearching = ref<boolean>(false);
    const searchResults = ref<IDestinationSearchPayload>({
      total: -1,
      items: [],
    });
    const term = ref<null | string>(null);
    const location = ref<null | string>(
      self.value?.meta.locationSettings?.defaultLocation || null
    );

    const onSearch = async () => {
      if (!term.value || !location.value) return;

      isSearching.value = true;
      const response = await api({
        method: "post",
        url: "/api/items/search",
        data: {
          location: location.value,
          term: term.value,
        } as BusinessSearchDto,
      });
      isSearching.value = false;

      if (response.ok) {
        searchResults.value = response.payload;
      }
    };

    const onSelect = (item: DestinationItemMetadata) => {
      console.log(item);
    };

    // searchResults.value = {
    //   total: 339,
    //   items: [
    //     {
    //       id: "ezqQFIlefHbowqEl76z3wQ",
    //       name: "Pho Souper Bowl",
    //       url: "https://www.yelp.com/biz/pho-souper-bowl-diamond-bar?adjust_creative=nad827_re0d0TcJsc2KuCg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=nad827_re0d0TcJsc2KuCg",
    //       price: "$",
    //       rating: 4,
    //       review_count: 764,
    //       display_address: ["329 S Diamond Bar Blvd", "Diamond Bar, CA 91765"],
    //       display_phone: "(909) 860-2704",
    //       lastUpdated: -1,
    //     },
    //     {
    //       id: "AJRXB9TpW3gtBIXZiZy4Xw",
    //       name: "Pho Ha Plus",
    //       url: "https://www.yelp.com/biz/pho-ha-plus-diamond-bar-2?adjust_creative=nad827_re0d0TcJsc2KuCg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=nad827_re0d0TcJsc2KuCg",
    //       price: "$$",
    //       rating: 3.5,
    //       review_count: 445,
    //       display_address: ["21090 Golden Springs Dr", "Diamond Bar, CA 91789"],
    //       display_phone: "(909) 444-3388",
    //       lastUpdated: -1,
    //     },
    //     {
    //       id: "g8zvvR5kk77rq9u0jADsZA",
    //       name: "Saigon Noodle House",
    //       url: "https://www.yelp.com/biz/saigon-noodle-house-diamond-bar?adjust_creative=nad827_re0d0TcJsc2KuCg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=nad827_re0d0TcJsc2KuCg",
    //       price: "$",
    //       rating: 4,
    //       review_count: 601,
    //       display_address: ["1136 S Diamond Bar Blvd", "Diamond Bar, CA 91765"],
    //       display_phone: "(909) 861-5020",
    //       lastUpdated: -1,
    //     },
    //     {
    //       id: "jZNVtcmHzPwKOXug5kfBZA",
    //       name: "Pho Rowland Restaurant",
    //       url: "https://www.yelp.com/biz/pho-rowland-restaurant-rowland-heights?adjust_creative=nad827_re0d0TcJsc2KuCg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=nad827_re0d0TcJsc2KuCg",
    //       price: "$$",
    //       rating: 4,
    //       review_count: 505,
    //       display_address: ["18910 Gale Ave", "Rowland Heights, CA 91748"],
    //       display_phone: "(626) 810-8800",
    //       lastUpdated: -1,
    //     },
    //     {
    //       id: "Bdz_rohfIr0iT7Lu2sybIQ",
    //       name: "Pho Hai",
    //       url: "https://www.yelp.com/biz/pho-hai-walnut-2?adjust_creative=nad827_re0d0TcJsc2KuCg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=nad827_re0d0TcJsc2KuCg",
    //       price: "$",
    //       rating: 4,
    //       review_count: 188,
    //       display_address: ["1263 N Grand Ave", "Walnut, CA 91789"],
    //       display_phone: "(909) 595-1521",
    //       lastUpdated: -1,
    //     },
    //     {
    //       id: "1sXN7K_xCT2HIOylRB3a-g",
    //       name: "Pho Bro",
    //       url: "https://www.yelp.com/biz/pho-bro-rowland-heights?adjust_creative=nad827_re0d0TcJsc2KuCg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=nad827_re0d0TcJsc2KuCg",
    //       price: "$",
    //       rating: 4,
    //       review_count: 82,
    //       display_address: [
    //         "19705 Colima Rd",
    //         "Ste 5",
    //         "Rowland Heights, CA 91748",
    //       ],
    //       display_phone: "(909) 768-9855",
    //       lastUpdated: -1,
    //     },
    //     {
    //       id: "U4sT-bwRgds0yGNNtSY3TQ",
    //       name: "Pho Bamboo",
    //       url: "https://www.yelp.com/biz/pho-bamboo-city-of-industry?adjust_creative=nad827_re0d0TcJsc2KuCg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=nad827_re0d0TcJsc2KuCg",
    //       price: "$",
    //       rating: 4.5,
    //       review_count: 274,
    //       display_address: ["18209 E Gale Ave", "City of Industry, CA 91748"],
    //       display_phone: "(626) 912-5757",
    //       lastUpdated: -1,
    //     },
    //     {
    //       id: "bzbwGhgT7WksQIzBK0s3tQ",
    //       name: "Pho Ha",
    //       url: "https://www.yelp.com/biz/pho-ha-city-of-industry?adjust_creative=nad827_re0d0TcJsc2KuCg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=nad827_re0d0TcJsc2KuCg",
    //       price: "$$",
    //       rating: 3.5,
    //       review_count: 750,
    //       display_address: ["18220 Gale Ave", "City of Industry, CA 91748"],
    //       display_phone: "(626) 810-5629",
    //       lastUpdated: -1,
    //     },
    //     {
    //       id: "rXqaMZ1tBO5UonmJgUZAiQ",
    //       name: "Basil and Co",
    //       url: "https://www.yelp.com/biz/basil-and-co-diamond-bar-6?adjust_creative=nad827_re0d0TcJsc2KuCg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=nad827_re0d0TcJsc2KuCg",
    //       price: "$$",
    //       rating: 4.5,
    //       review_count: 392,
    //       display_address: [
    //         "23545 Palomino Dr",
    //         "Ste F",
    //         "Diamond Bar, CA 91765",
    //       ],
    //       display_phone: "(909) 551-0022",
    //       lastUpdated: -1,
    //     },
    //     {
    //       id: "pNLx3IFdVSBWEVZ1HOlEuw",
    //       name: "Golden Noodle & Grill",
    //       url: "https://www.yelp.com/biz/golden-noodle-and-grill-rowland-heights?adjust_creative=nad827_re0d0TcJsc2KuCg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=nad827_re0d0TcJsc2KuCg",
    //       price: "$",
    //       rating: 4,
    //       review_count: 151,
    //       display_address: ["19756 E Colima Rd", "Rowland Heights, CA 91748"],
    //       display_phone: "(909) 595-0714",
    //       lastUpdated: -1,
    //     },
    //     {
    //       id: "LEHMI7fgm5RkFpAooFCqig",
    //       name: "Pho Hana",
    //       url: "https://www.yelp.com/biz/pho-hana-diamond-bar-2?adjust_creative=nad827_re0d0TcJsc2KuCg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=nad827_re0d0TcJsc2KuCg",
    //       price: "$",
    //       rating: 3.5,
    //       review_count: 290,
    //       display_address: [
    //         "2777 South Diamond Bar Blvd",
    //         "Diamond Bar, CA 91765",
    //       ],
    //       display_phone: "(909) 444-3081",
    //       lastUpdated: -1,
    //     },
    //     {
    //       id: "byD6_74WKEb94B7Gcz4L9g",
    //       name: "Pho & Grill",
    //       url: "https://www.yelp.com/biz/pho-and-grill-san-dimas?adjust_creative=nad827_re0d0TcJsc2KuCg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=nad827_re0d0TcJsc2KuCg",
    //       price: "$$",
    //       rating: 4.5,
    //       review_count: 423,
    //       display_address: ["873 W Arrow Hwy", "San Dimas, CA 91773"],
    //       display_phone: "(909) 394-8088",
    //       lastUpdated: -1,
    //     },
    //     {
    //       id: "qvdmi_B_LgYD2aDb7REvnw",
    //       name: "Pho Grand Vietnamese Noodle and Grill",
    //       url: "https://www.yelp.com/biz/pho-grand-vietnamese-noodle-and-grill-chino-3?adjust_creative=nad827_re0d0TcJsc2KuCg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=nad827_re0d0TcJsc2KuCg",
    //       price: "$",
    //       rating: 4,
    //       review_count: 337,
    //       display_address: ["4013 Grand Ave", "Ste B", "Chino, CA 91710"],
    //       display_phone: "(909) 548-2848",
    //       lastUpdated: -1,
    //     },
    //     {
    //       id: "lSwJxwfEXIbJIh-zXNuAqg",
    //       name: "Slurpin' Ramen Bar - City of Industry",
    //       url: "https://www.yelp.com/biz/slurpin-ramen-bar-city-of-industry-city-of-industry?adjust_creative=nad827_re0d0TcJsc2KuCg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=nad827_re0d0TcJsc2KuCg",
    //       price: "$$",
    //       rating: 4.5,
    //       review_count: 2637,
    //       display_address: ["18508-A E Gale Ave", "City of Industry, CA 91748"],
    //       display_phone: "(626) 581-1171",
    //       lastUpdated: -1,
    //     },
    //     {
    //       id: "BJr0sIwRwTNrIcF-NkrPqA",
    //       name: "Súp Noodle Bar - Buena Park",
    //       url: "https://www.yelp.com/biz/s%C3%BAp-noodle-bar-buena-park-buena-park?adjust_creative=nad827_re0d0TcJsc2KuCg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=nad827_re0d0TcJsc2KuCg",
    //       price: "$$",
    //       rating: 4.5,
    //       review_count: 2379,
    //       display_address: [
    //         "5141 Beach Blvd",
    //         "Unit B",
    //         "Buena Park, CA 90621",
    //       ],
    //       display_phone: "(714) 521-2444",
    //       lastUpdated: -1,
    //     },
    //     {
    //       id: "IOUYvb86-ufmMIilBVP73w",
    //       name: "Culantro & Basil Pho Bistro",
    //       url: "https://www.yelp.com/biz/culantro-and-basil-pho-bistro-west-covina?adjust_creative=nad827_re0d0TcJsc2KuCg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=nad827_re0d0TcJsc2KuCg",
    //       price: "n/a",
    //       rating: 4.5,
    //       review_count: 22,
    //       display_address: [
    //         "2626 E Garvey Ave S",
    //         "Ste D",
    //         "West Covina, CA 91791",
    //       ],
    //       display_phone: "(626) 332-8998",
    //       lastUpdated: -1,
    //     },
    //     {
    //       id: "ymaCYFW9VP1aPtxFKoSeZA",
    //       name: "PhoReal Kitchen",
    //       url: "https://www.yelp.com/biz/phoreal-kitchen-fullerton-2?adjust_creative=nad827_re0d0TcJsc2KuCg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=nad827_re0d0TcJsc2KuCg",
    //       price: "n/a",
    //       rating: 4.5,
    //       review_count: 238,
    //       display_address: ["2466 E Chapman Ave", "Fullerton, CA 92831"],
    //       display_phone: "(714) 770-0970",
    //       lastUpdated: -1,
    //     },
    //     {
    //       id: "JjoGH-_51DmS-cIyxVxseA",
    //       name: "XT Cafe",
    //       url: "https://www.yelp.com/biz/xt-cafe-la-habra?adjust_creative=nad827_re0d0TcJsc2KuCg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=nad827_re0d0TcJsc2KuCg",
    //       price: "$",
    //       rating: 4.5,
    //       review_count: 91,
    //       display_address: ["1403 E Lambert Rd", "Ste C", "La Habra, CA 90631"],
    //       display_phone: "(562) 697-3838",
    //       lastUpdated: -1,
    //     },
    //     {
    //       id: "VRPT_CDx1bcMbTpY4KfbLQ",
    //       name: "48 Bistro Brea",
    //       url: "https://www.yelp.com/biz/48-bistro-brea-brea-2?adjust_creative=nad827_re0d0TcJsc2KuCg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=nad827_re0d0TcJsc2KuCg",
    //       price: "$$",
    //       rating: 4.5,
    //       review_count: 193,
    //       display_address: ["215 W Birch St", "Ste 2", "Brea, CA 92821"],
    //       display_phone: "(714) 784-6666",
    //       lastUpdated: -1,
    //     },
    //     {
    //       id: "qyUPNCDMr74XhjXcXq7KrQ",
    //       name: "Quan Nem Ninh Hoa",
    //       url: "https://www.yelp.com/biz/quan-nem-ninh-hoa-west-covina-3?adjust_creative=nad827_re0d0TcJsc2KuCg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=nad827_re0d0TcJsc2KuCg",
    //       price: "$$",
    //       rating: 4,
    //       review_count: 390,
    //       display_address: ["973 S Glendora Ave", "West Covina, CA 91790"],
    //       display_phone: "(626) 337-3603",
    //       lastUpdated: -1,
    //     },
    //   ],
    // };

    const focus = () => termInput.value?.focus();

    return {
      termInput,
      locationInput,

      termUid,
      locationUid,

      isSearching,
      searchResults,
      term,
      location,

      onSearch,
      onSelect,
      focus,
    };
  },
});
</script>

<style lang="less" scoped>
.yelp-icon {
  content: url("client/assets/vendor/yelp/Logo_RGB.png");

  @media (prefers-color-scheme: dark) {
    content: url("client/assets/vendor/yelp/Logo_RGB_dark.png");
  }
}
</style>
