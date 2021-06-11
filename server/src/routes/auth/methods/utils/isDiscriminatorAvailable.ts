import getAvailableDiscriminators from "./getAvailableDiscriminators";

export default async function isDiscriminatorAvailable({
  username,
  discriminator,
}: {
  username: string;
  discriminator: number;
}) {
  return (await getAvailableDiscriminators({ username })).includes(
    discriminator
  );
}
