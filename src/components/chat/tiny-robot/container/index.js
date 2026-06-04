import { defineComponent as m, useCssVars as v, useModel as c, computed as _, createElementBlock as $, openBlock as w, createElementVNode as n, renderSlot as r, createVNode as u, unref as a } from "vue";
import { $ as g, i as h, t as C } from "../tiny-robot-svgs.js";
import d from "../icon-button/index.js";
import { _ as b } from "../_plugin-vue_export-helper.js";
const B = { class: "tr-container" }, k = { class: "tr-container__header" }, z = { class: "tr-container__header-operations" }, y = { class: "tr-container__footer" }, E = /* @__PURE__ */ m({
  __name: "index",
  props: {
    show: { type: Boolean, required: !0 },
    showModifiers: {},
    fullscreen: { type: Boolean },
    fullscreenModifiers: {}
  },
  emits: ["update:show", "update:fullscreen"],
  setup(o) {
    v((t) => ({
      b67b7ee6: s.value ? "0" : "unset",
      "72873ea0": s.value ? "unset" : "var(--tr-container-width)",
      "224ae4c1": l.value ? "100" : "-1",
      cb10cae2: l.value ? "1" : "0"
    }));
    const l = c(o, "show"), s = c(o, "fullscreen"), f = _(() => s.value ? g : h);
    return (t, e) => (w(),
     $("div", B, [
      e[3] 
      || 
      (e[3] = n("div", { class: "tr-container__dragging-bar-wrapper" }, [
        n("div", { class: "tr-container__dragging-bar" })
      ], -1))
      
      ,
      n("div", k, [
        r(t.$slots, "title", {}, () => [
          e[2] || (e[2] = n("h3", { class: "tr-container__title" }, "OpenTiny NEXT", -1))
        ]),
        n("div", z, [
          r(t.$slots, "operations"),
          // u(a(d), {
          //   size: "28",
          //   "svg-size": "20",
          //   icon: f.value,
          //   onClick: e[0] || (e[0] = (p) => t.$emit("update:fullscreen", !s.value))
          // }, null, 8, ["icon"]),
          // u(a(d), {
          //   size: "28",
          //   "svg-size": "20",
          //   icon: a(C),
          //   onClick: e[1] || (e[1] = (p) => t.$emit("update:show", !1))
          // }, null, 8, ["icon"])
        ])
      ]),
      r(t.$slots, "default"),
      n("div", y, [
        r(t.$slots, "footer")
      ])
    ]));
  }
}), i = /* @__PURE__ */ b(E, [["__scopeId", "data-v-81c9f59e"]]);
i.name = "TrContainer";
const I = function(o) {
  o.component(i.name, i);
};
i.install = I;
export {
  i as default
};
