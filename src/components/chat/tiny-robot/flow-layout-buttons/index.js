import { defineComponent as V, mergeModels as E, useModel as q, watch as g, ref as i, computed as $, createElementBlock as a, openBlock as l, createElementVNode as C, Fragment as I, renderList as S, createCommentVNode as _, normalizeClass as x, createBlock as B, resolveDynamicComponent as b, toDisplayString as D, nextTick as G } from "vue";
import { U as H } from "../tiny-robot-svgs.js";
import { a as X, o as j } from "../index3.js";
import { _ as J } from "../_plugin-vue_export-helper.js";
const K = ["onClick"], P = {
  key: 0,
  class: "tr-flow-layout__item-label"
}, Q = { class: "tr-flow-layout__dropdown-wrapper" }, Y = ["onClick"], Z = { class: "tr-flow-layout__item-label" }, ee = /* @__PURE__ */ V({
  __name: "index",
  props: /* @__PURE__ */ E({
    items: {},
    selected: {},
    linesLimit: { default: Number.MAX_SAFE_INTEGER },
    moreIcon: { default: H },
    showMoreTrigger: { default: "click" }
  }, {
    selected: {},
    selectedModifiers: {}
  }),
  emits: /* @__PURE__ */ E(["item-click"], ["update:selected"]),
  setup(d, { emit: F }) {
    const n = d, u = q(d, "selected");
    g(
      () => n.items,
      (t) => {
        !t.find((o) => o.id === u.value) && t.length && (u.value = t[0].id);
      },
      { immediate: !0 }
    );
    const N = F, y = i(null), w = i(null), k = i(null), M = i([]), s = i(null), m = i(!1), c = i(!1), A = (t, o) => {
      t && (M.value[o] = t);
    }, L = () => {
      s.value = null, m.value = !1, G(() => {
        const t = y.value, o = w.value;
        if (!t || !o)
          return;
        const e = M.value.slice(0, n.items.length).filter((r) => !!r).map((r) => r.offsetTop), f = Array.from(new Set(e));
        if (f.length > n.linesLimit) {
          const r = f[n.linesLimit - 1], h = e.lastIndexOf(r), T = M.value[h];
          t.clientWidth - T.offsetLeft - T.offsetWidth - 8 < o.offsetWidth ? s.value = h : s.value = h + 1, m.value = !1;
        } else
          s.value = null, m.value = !0;
      });
    };
    g(() => n.items, L);
    const { width: W } = X(y);
    g(W, (t) => {
      t > 0 && L();
    });
    const z = $(() => s.value !== null ? n.items.slice(s.value) : []), O = $(() => s.value === null ? !1 : n.items.findIndex((o) => o.id === u.value) >= s.value), R = (t) => {
      u.value = t, c.value = !1, N("item-click", t);
    }, U = () => {
      n.showMoreTrigger === "click" && (c.value = !c.value);
    }, v = (t) => {
      n.showMoreTrigger === "hover" && (c.value = t);
    };
    return j(k, (t) => {
      var o, e;
      (o = k.value) != null && o.contains(t.target) || (e = w.value) != null && e.contains(t.target) || (c.value = !1);
    }), (t, o) => (l(), a("div", {
      class: "tr-flow-layout",
      ref_key: "containerRef",
      ref: y
    }, [
      (l(!0), a(I, null, S(n.items, (e, f) => (l(), a(I, {
        key: e.id
      }, [
        s.value === null || f < s.value ? (l(), a("button", {
          key: 0,
          class: x(["tr-flow-layout__item", { "icon-only": !e.label }, { selected: e.id === u.value }]),
          ref_for: !0,
          ref: (r) => A(r, f),
          onClick: (r) => R(e.id)
        }, [
          (l(), B(b(e.icon), { class: "tr-flow-layout__item-icon" })),
          e.label ? (l(), a("span", P, D(e.label), 1)) : _("", !0)
        ], 10, K)) : _("", !0)
      ], 64))), 128)),
      C("div", Q, [
        m.value ? _("", !0) : (l(), a("button", {
          key: 0,
          class: x(["tr-flow-layout__item", "icon-only", { selected: O.value }]),
          ref_key: "moreButtonRef",
          ref: w,
          onClick: U,
          onMouseenter: o[0] || (o[0] = (e) => v(!0)),
          onMouseleave: o[1] || (o[1] = (e) => v(!1))
        }, [
          (l(), B(b(n.moreIcon), { class: "tr-flow-layout__item-icon" }))
        ], 34)),
        C("div", {
          class: "tr-flow-layout__dropdown-container",
          onMouseenter: o[2] || (o[2] = (e) => v(!0)),
          onMouseleave: o[3] || (o[3] = (e) => v(!1))
        }, [
          c.value ? (l(), a("div", {
            key: 0,
            class: "tr-flow-layout__dropdown",
            ref_key: "dropDownRef",
            ref: k
          }, [
            (l(!0), a(I, null, S(z.value, (e) => (l(), a("button", {
              class: x(["tr-flow-layout__dropdown_item", { selected: e.id === u.value }]),
              key: e.id,
              onClick: (f) => R(e.id)
            }, [
              (l(), B(b(e.icon), { class: "tr-flow-layout__item-icon" })),
              C("span", Z, D(e.label), 1)
            ], 10, Y))), 128))
          ], 512)) : _("", !0)
        ], 32)
      ])
    ], 512));
  }
}), p = /* @__PURE__ */ J(ee, [["__scopeId", "data-v-5a28ac75"]]);
p.name = "TrFlowLayout";
const te = function(d) {
  d.component(p.name, p);
};
p.install = te;
export {
  p as default
};
