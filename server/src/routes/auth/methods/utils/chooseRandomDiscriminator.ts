import SrkError from "src/classes/SrkError";
import getAvailableDiscriminators from "./getAvailableDiscriminators";

export default async function chooseRandomDiscriminator({
  username,
}: {
  username: string;
}) {
  const availableDiscriminators = await getAvailableDiscriminators({
    username,
  });

  if (!availableDiscriminators.length) {
    throw new SrkError("usernameNotAvailable");
  }

  const discriminator =
    availableDiscriminators[
      Math.floor(Math.random() * availableDiscriminators.length)
    ];

  return discriminator;
}
