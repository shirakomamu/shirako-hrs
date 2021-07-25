// https://cmsdk.com/javascript/get-random-element-from-array-with-weighted-elements-duplicate.html

type ObjectKnown = {
  [key: string]: any;
};

export default <T = ObjectKnown>(
  objArray: T[],
  weightPropertyName: keyof T
): T => {
  const sumOfWeights = objArray.reduce((a, b) => {
    return a + (b[weightPropertyName] as unknown as number);
  }, 0);

  let random = Math.floor(Math.random() * (sumOfWeights + 1));

  const found = objArray.find((e) => {
    random -= e[weightPropertyName] as unknown as number;
    return random <= 0;
  });

  if (!found) {
    throw new Error("Could not choose element");
  }

  return found;
};
