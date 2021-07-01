export default ({
  username,
  email,
  displayName,
}: {
  username?: string | null;
  email?: string | null;
  displayName?: string | null;
}) => {
  return (
    [username, email, displayName].filter((e) => !!e) as string[]
  ).flatMap((e) =>
    e.split("@").flatMap((f) => f.split(" ").flatMap((g) => g.split(".")))
  );
};
