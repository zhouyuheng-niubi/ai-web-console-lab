function e(t) {
  if (typeof t == "number") return `${t}px`;
  const o = t == null ? void 0 : t.trim();
  return o ? /^-?\d+(\.\d+)?$/.test(o) ? `${o}px` : o : "0px";
}
function i(t) {
  var n;
  if (!t) return window.getSelection();
  const o = t.getRootNode();
  return o instanceof ShadowRoot && ((n = o.getSelection) == null ? void 0 : n.call(o)) || window.getSelection();
}
function r(t) {
  return t.getRootNode() instanceof ShadowRoot;
}
export {
  i as g,
  r as i,
  e as t
};
