import { ListVisibility } from "common/enums";
import { IDestinationListPayload } from "common/types/api";
import { useAsync } from "@nuxtjs/composition-api";

const useList = ({
  username,
  listId,
}: {
  username: string;
  listId: string;
}) => {
  // imagine this is an api call
  const listData = useAsync<IDestinationListPayload>(async () => {
    return await new Promise((resolve) =>
      resolve({
        id: "list-id-test",
        title: "This is a list_" + listId,
        owner: "shirako",
        description: "Hello. This is a description. " + username,
        visibility: ListVisibility.list,
        items: [
          {
            id: "this_is_yelp_id",
            name: "This is a restaurant",
            image:
              "https://s3-media2.fl.yelpcdn.com/bphoto/CPc91bGzKBe95aM5edjhhQ/o.jpg",
            url: "https://www.yelp.com/biz/gary-danko-san-francisco?adjust_creative=wpr6gw4FnptTrk1CeT8POg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_lookup&utm_source=wpr6gw4FnptTrk1CeT8POg",
            display_address: ["800 N Point St", "San Francisco, CA 94109"],
            display_phone: "(415) 749-2060",
            price: "$$$$",
            hours: [
              {
                open: [
                  {
                    is_overnight: false,
                    start: "1730",
                    end: "2200",
                    day: 0,
                  },
                  {
                    is_overnight: false,
                    start: "1730",
                    end: "2200",
                    day: 1,
                  },
                  {
                    is_overnight: false,
                    start: "1730",
                    end: "2200",
                    day: 2,
                  },
                  {
                    is_overnight: false,
                    start: "1730",
                    end: "2200",
                    day: 3,
                  },
                  {
                    is_overnight: false,
                    start: "1730",
                    end: "2200",
                    day: 4,
                  },
                  {
                    is_overnight: false,
                    start: "1730",
                    end: "2200",
                    day: 5,
                  },
                  {
                    is_overnight: false,
                    start: "1730",
                    end: "2200",
                    day: 6,
                  },
                ],
                is_open_now: false,
              },
            ],
            special_hours: [
              {
                date: "2019-02-07",
                is_closed: false,
                start: "1600",
                end: "2000",
                is_overnight: false,
              },
            ],
          },
        ],
      })
    );
  }, "listData_" + username + "_" + listId);

  return listData;
};

export default useList;
