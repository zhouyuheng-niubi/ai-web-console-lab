import { defineComponent as p, useCssVars as l, computed as t, createElementBlock as u, openBlock as s, normalizeClass as m, createBlock as d, resolveDynamicComponent as _ } from "vue";
import { toCssUnit as c } from "../shared/index.js";
import { _ as f } from "../_plugin-vue_export-helper.js";
const v = /* @__PURE__ */ p({
  __name: "index",
  props: {
    icon: {},
    size: { default: "24px" },
    svgSize: { default: "16px" },
    rounded: { type: Boolean }
  },
  setup(n) {
    l((i) => ({
      "72b46ad2": a.value,
      66777814: r.value
    }));
    const o = n, a = t(() => c(o.size)), r = t(() => c(o.svgSize));
    return (i, z) => (s(), u("button", {
      class: m(["tr-icon-button", { rounded: o.rounded }])
    }, [
      (s(), d(_(o.icon)))
    ], 2));
  }
}), e = /* @__PURE__ */ f(v, [["__scopeId", "data-v-fe8553bc"]]);
e.name = "TrIconButton";
const x = function(n) {
  n.component(e.name, e);
};
e.install = x;
export {
  e as default
};
