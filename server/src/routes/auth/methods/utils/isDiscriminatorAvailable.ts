import getAvailableDiscriminators from "./getAvailableDiscriminators";

export default async function isDiscriminatorAvailable({
  displayName,
  discriminator,
}: {
  displayName: string;
  discriminator: number;
}) {
  return (await getAvailableDiscriminators({ displayName })).includes(
    discriminator
  );
}
