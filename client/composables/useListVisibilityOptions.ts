import { ListVisibility } from "common/enums";

const useListVisibilityOptions = () => {
  const listVisibilityOptions = [
    {
      text: "List members",
      value: ListVisibility.list,
    },
    {
      text: "Friends",
      value: ListVisibility.friends,
    },
    {
      text: "Anyone",
      value: ListVisibility.anyone,
    },
  ];

  return listVisibilityOptions;
};

export default useListVisibilityOptions;
