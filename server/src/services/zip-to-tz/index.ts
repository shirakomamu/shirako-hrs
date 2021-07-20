import zipcodeToTimezone from "zipcode-to-timezone";

const zipToTz = (zip: string) => {
  return zipcodeToTimezone.lookup(zip) as string | null;
};

export default zipToTz;
