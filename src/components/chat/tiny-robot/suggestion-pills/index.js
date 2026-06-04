import { defineComponent as T, useSlots as N, computed as d, createElementBlock as a, openBlock as n, normalizeClass as R, renderSlot as v, createBlock as c, resolveDynamicComponent as V, createCommentVNode as z, toDisplayString as E, useCssVars as F, ref as L, Fragment as $, renderList as b, unref as i, mergeProps as x, createSlots as M, withCtx as C, createVNode as D } from "vue";
import { d as j } from "../index3.js";
import q from "../dropdown-menu/index.js";
import A from "../suggestion-popover/index.js";
import { _ as w } from "../_plugin-vue_export-helper.js";
const H = { key: 0 }, J = /* @__PURE__ */ T({
  __name: "PillButton",
  props: {
    item: {}
  },
  setup(s) {
    const u = s, p = N(), r = d(() => {
      var e;
      return !!(p.icon || (e = u.item) != null && e.icon);
    }), m = d(() => {
      var e;
      return !!(p.default || (e = u.item) != null && e.text);
    }), k = d(() => r.value && !m.value);
    return (e, g) => (n(), a("button", {
      class: R(["tr-suggestion-pills__item", { "only-icon": k.value }])
    }, [
      v(e.$slots, "icon", {}, () => {
        var l;
        return [
          (n(), c(V((l = e.item) == null ? void 0 : l.icon), { class: "tr-suggestion-pills__item_icon" }))
        ];
      }, !0),
      v(e.$slots, "default", {}, () => {
        var l;
        return [
          (l = e.item) != null && l.text ? (n(), a("span", H, E(e.item.text), 1)) : z("", !0)
        ];
      }, !0)
    ], 2));
  }
}), o = /* @__PURE__ */ w(J, [["__scopeId", "data-v-8df2df8c"]]), K = /* @__PURE__ */ T({
  __name: "index",
  props: {
    items: {}
  },
  emits: ["item-click"],
  setup(s, { emit: u }) {
    F((g) => ({
      31203585: e.value
    }));
    const p = s, r = u, m = L(null), { arrivedState: k } = j(m), e = d(() => k.left ? "linear-gradient(to right, black 95%, transparent)" : k.right ? "linear-gradient(to left, black 95%, transparent)" : "linear-gradient(to right, transparent, black 5%, black 95%, transparent)");
    return (g, l) => (n(), a("div", {
      class: "tr-suggestion-pills__container",
      ref_key: "containerRef",
      ref: m
    }, [
      v(g.$slots, "default", {}, () => [
        (n(!0), a($, null, b(p.items, (t) => {
          var y, h, S, B, I, P;
          return n(), a($, {
            key: t.id
          }, [
            ((y = t.action) == null ? void 0 : y.type) === "popover" ? (n(), c(i(A), x({
              key: 0,
              class: "shrink",
              ref_for: !0
            }, t.action.props, {
              onItemClick: (h = t.action.events) == null ? void 0 : h.itemClick,
              onGroupClick: (S = t.action.events) == null ? void 0 : S.groupClick,
              onClose: (B = t.action.events) == null ? void 0 : B.close
            }), M({
              default: C(() => [
                D(i(o), {
                  item: t,
                  onClick: (f) => r("item-click", t)
                }, null, 8, ["item", "onClick"])
              ]),
              _: 2
            }, [
              b(t.action.slots, (f, G) => ({
                name: G,
                fn: C(() => [
                  (n(), c(V(f)))
                ])
              }))
            ]), 1040, ["onItemClick", "onGroupClick", "onClose"])) : ((I = t.action) == null ? void 0 : I.type) === "menu" ? (n(), c(i(q), x({
              key: 1,
              class: "shrink",
              ref_for: !0
            }, t.action.props, {
              onItemClick: (P = t.action.events) == null ? void 0 : P.itemClick
            }), {
              default: C(() => [
                D(i(o), {
                  item: t,
                  onClick: (f) => r("item-click", t)
                }, null, 8, ["item", "onClick"])
              ]),
              _: 2
            }, 1040, ["onItemClick"])) : (n(), c(i(o), {
              key: 2,
              item: t,
              onClick: (f) => r("item-click", t)
            }, null, 8, ["item", "onClick"]))
          ], 64);
        }), 128))
      ], !0)
    ], 512));
  }
}), _ = /* @__PURE__ */ w(K, [["__scopeId", "data-v-9c74797b"]]);
_.name = "TrSuggestionPills";
const O = function(s) {
  s.component(_.name, _);
};
_.install = O;
o.name = "TrSuggestionPillButton";
const Q = function(s) {
  s.component(o.name, o);
};
o.install = Q;
const tt = o;
export {
  tt as SuggestionPillButton,
  _ as default
};
