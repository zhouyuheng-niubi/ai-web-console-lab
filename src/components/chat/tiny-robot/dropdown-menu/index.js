import { defineComponent as $, useCssVars as T, unref as D, ref as d, computed as S, watch as B, createElementBlock as u, openBlock as n, renderSlot as M, createVNode as R, Transition as V, withCtx as E, createBlock as N, createCommentVNode as O, Teleport as W, createElementVNode as m, normalizeStyle as I, Fragment as b, renderList as z, toDisplayString as F } from "vue";
import { u as p, o as H } from "../index3.js";
import { toCssUnit as o } from "../shared/index.js";
import { _ as L } from "../_plugin-vue_export-helper.js";
const P = { class: "tr-dropdown-menu__list" }, U = ["onClick"], j = /* @__PURE__ */ $({
  __name: "index",
  props: {
    items: {},
    minWidth: { default: 160 },
    topOffset: { default: 0 }
  },
  emits: ["item-click"],
  setup(s, { emit: f }) {
    T((e) => ({
      f8e23632: D(o)(l.minWidth)
    }));
    const l = s, t = d(!1), _ = f, c = d(null), a = d(null), { x: w, y: h, update: v } = p(c), { width: k, height: g } = p(a), x = S(() => ({
      left: `min(${o(w.value)}, 100% - ${o(k.value)})`,
      top: `max(${o(h.value)} - ${o(g.value)} + ${o(l.topOffset)} - 8px, 0px)`
    }));
    H(a, (e) => {
      e.stopPropagation(), t.value = !1;
    }), B(t, (e) => {
      e && v();
    });
    const y = () => {
      t.value = !t.value;
    }, C = (e) => {
      t.value = !1, _("item-click", e);
    };
    return (e, A) => (n(), u("div", {
      class: "tr-dropdown-menu__wrapper",
      ref_key: "dropDownTriggerRef",
      ref: c,
      onClick: y
    }, [
      M(e.$slots, "default", {}, void 0, !0),
      R(V, { name: "tr-dropdown-menu" }, {
        default: E(() => [
          t.value ? (n(), N(W, {
            key: 0,
            to: "body"
          }, [
            m("div", {
              class: "tr-dropdown-menu",
              style: I(x.value),
              ref_key: "dropdownMenuRef",
              ref: a
            }, [
              m("ul", P, [
                (n(!0), u(b, null, z(l.items, (i) => (n(), u("li", {
                  class: "tr-dropdown-menu__list-item",
                  key: i.id,
                  onClick: (G) => C(i)
                }, F(i.text), 9, U))), 128))
              ])
            ], 4)
          ])) : O("", !0)
        ]),
        _: 1
      })
    ], 512));
  }
}), r = /* @__PURE__ */ L(j, [["__scopeId", "data-v-e4886a37"]]);
r.name = "TrDropdownMenu";
const q = function(s) {
  s.component(r.name, r);
};
r.install = q;
export {
  r as default
};
