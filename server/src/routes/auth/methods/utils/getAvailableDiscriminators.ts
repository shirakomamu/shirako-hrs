import { DI } from "src/app";
import { NUM_AVAILABLE_DISCRIMINATORS } from "src/config/discriminator";

export default async function getAvailableDiscriminators({
  displayName,
}: {
  displayName: string;
}) {
  const existingDiscriminators = (
    await DI.memberRepo.find({
      displayName,
    })
  ).map((e) => e.discriminator);

  const allDiscriminators = Array.from(
    Array(NUM_AVAILABLE_DISCRIMINATORS).keys()
  );

  return allDiscriminators.filter((e) => !existingDiscriminators.includes(e));
}