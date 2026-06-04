function n(t) {
  if (typeof t == "number") return `${t}px`;
  const r = t == null ? void 0 : t.trim();
  return r ? /^-?\d+(\.\d+)?$/.test(r) ? `${r}px` : r : "0px";
}
export {
  n as toCssUnit
};
