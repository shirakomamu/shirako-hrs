import { DI } from "server/middleware/initializeDi";
import { SrkCookie } from "server/services/jwt";
import { ListVisibility } from "common/enums";
import { IActivatedNeuronsPayload } from "common/types/api";
import SrkError from "server/classes/SrkError";
import { ActivateNeuronsDto } from "common/dto/neurons";
import _identifyDestinations from "server/methods/items/_identifyDestinations";
import getTimeUntilClose from "common/utils/getTimeUntilClose";
import getWeightedRandom from "common/utils/getWeightedRandom";
import { IDestinationItemPayload } from "common/types/api/items";

const MERGE_EXPONENT = 2;
const OWNER_EXPONENT = 3;
const NEURON_COUNT = 10;

export default async (
  authResult: SrkCookie,
  { neurons }: ActivateNeuronsDto
): Promise<IActivatedNeuronsPayload> => {
  if (!authResult.actor) {
    throw new SrkError("unauthorized");
  }

  const repo = DI.destinationListRepo;
  const memberRepo = DI.memberRepo;

  const user = await memberRepo.findOneOrFail({ sub: authResult.actor?.id }, [
    "outgoingFriends",
    "incomingFriends",
  ]);

  const confirmedFriends = user.confirmedFriends.map((e) => e.id) || [];

  const lists = await repo.find(
    {
      $and: [
        // already-picked lists
        {
          id: {
            $in: neurons,
          },
        },

        // visibility rules
        {
          $or: [
            // condition: visible to anyone
            {
              visibility: ListVisibility.anyone,
            },
            // condition: visible to confirmed friends
            {
              visibility: ListVisibility.friends,
              owner: {
                $in: confirmedFriends,
              },
            },
            // condition: visible to shared list
            {
              visibility: ListVisibility.list,
              sharedWith: user,
            },
            // condition: owner
            {
              owner: user,
            },
          ],
        },
      ],
    },
    ["destinations"]
  );

  const neuronStore: {
    [key: string]: {
      list: string;
      owner: string;
    }[];
  } = {};

  for (const list of lists) {
    for (const item of list.destinations) {
      if (!neuronStore[item.yelpId]) {
        // if the destination is new to the neuron store
        neuronStore[item.yelpId] = [
          {
            list: list.id,
            owner: list.owner.sub,
          },
        ];
      } else {
        // if the destination is in the store
        neuronStore[item.yelpId].push({
          list: list.id,
          owner: list.owner.sub,
        });
      }
    }
  }

  const ids = Object.keys(neuronStore);
  const neuronData = await _identifyDestinations(authResult, ids);
  const neuronTime: {
    id: string;
    time: number | null;
  }[] = [];

  for (const neuron of neuronData) {
    if (!neuron.hours) {
      neuronTime.push({
        id: neuron.id,
        time: null,
      });
      continue;
    }

    // return those without hours
    const regularHours = neuron.hours.find(
      (f) => f.hours_type === "REGULAR"
    )?.open;
    if (!regularHours || !neuron.timezone) {
      neuronTime.push({
        id: neuron.id,
        time: null,
      });
      continue;
    }

    const timeUntilClose = getTimeUntilClose(
      Date.now(),
      regularHours,
      neuron.timezone
    );

    if (!timeUntilClose || timeUntilClose < 60) {
      continue;
    }

    neuronTime.push({
      id: neuron.id,
      time: null,
    });
  }
  const validNeuronTimeIds = neuronTime.map((e) => e.id);

  // neuronStore stores link data
  // neuronData stores all metadata
  // neuronTime stores timing data

  const neuronScore: { nid: string; score: number }[] = [];
  for (const nid of ids) {
    if (!validNeuronTimeIds.includes(nid)) {
      continue;
    }
    const storeData = neuronStore[nid];
    if (!storeData) {
      continue;
    }

    const mergeCount = storeData.length;
    const ownerCount = storeData
      .map((e) => e.owner)
      .filter((e, i, a) => a.indexOf(e) === i).length;

    neuronScore.push({
      nid,
      score: mergeCount ** MERGE_EXPONENT + ownerCount ** OWNER_EXPONENT,
    });
  }

  const selectedNeuronCount = Math.min(NEURON_COUNT, neuronScore.length);
  const selectedNeurons: { nid: string; score: number }[] = [];
  const selectedIds: string[] = [];

  if (neuronScore.length === selectedNeuronCount) {
    selectedNeurons.push(...neuronScore);
  } else {
    for (let i = 0; i < selectedNeuronCount; i++) {
      const selected = getWeightedRandom(
        neuronScore.filter((e) => !selectedIds.includes(e.nid)),
        "score"
      );

      selectedNeurons.push(selected);
      selectedIds.push(selected.nid);
    }
  }

  return {
    neurons: selectedNeurons
      .sort((a, b) => a.score - b.score)
      .map((e) => {
        return neuronData.find(
          (f) => f.id === e.nid
        ) as IDestinationItemPayload;
      }),
  };
};
