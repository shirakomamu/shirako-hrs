export default (base: string, ender: string): string => {
  return base + (base.endsWith(ender) ? "" : ender);
};
