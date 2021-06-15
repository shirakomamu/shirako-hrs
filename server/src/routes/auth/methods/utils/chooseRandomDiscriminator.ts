import SrkError from "src/classes/SrkError";
import getAvailableDiscriminators from "./getAvailableDiscriminators";

export default async function chooseRandomDiscriminator({
  displayName,
}: {
  displayName: string;
}) {
  const availableDiscriminators = await getAvailableDiscriminators({
    displayName,
  });

  if (!availableDiscriminators.length) {
    throw new SrkError("displayNameNotAvailable");
  }

  const discriminator =
    availableDiscriminators[
      Math.floor(Math.random() * availableDiscriminators.length)
    ];

  return discriminator;
}
