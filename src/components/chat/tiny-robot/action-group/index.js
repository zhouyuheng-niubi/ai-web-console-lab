import { defineComponent as $, useSlots as H, computed as i, ref as f, watch as N, nextTick as W, createElementBlock as _, openBlock as n, createBlock as v, createCommentVNode as R, Fragment as G, renderList as I, unref as h, withCtx as S, createElementVNode as w, resolveDynamicComponent as x, renderSlot as L, createVNode as E, Transition as j, withDirectives as q, normalizeClass as J, withModifiers as K, toDisplayString as Q, vShow as U } from "vue";
import { o as Y } from "../tiny-robot-svgs.js";
import { T as M } from "../index4.js";
import { o as Z, b as ee } from "../index3.js";
import te from "../icon-button/index.js";
import { _ as oe } from "../_plugin-vue_export-helper.js";
const ne = { class: "tr-action-group" }, re = ["onClick"], le = ["onClick"], ae = { class: "tr-action-group__dropdown-item-text" }, ce = /* @__PURE__ */ $({
  __name: "ActionGroup",
  props: {
    maxNum: {},
    showTooltip: { type: Boolean },
    dropDownShowLabelOnly: { type: Boolean }
  },
  emits: ["item-click"],
  setup(l, { emit: k }) {
    const a = l, F = H(), O = k, p = i(() => {
      var o, t;
      const e = F.default();
      return Array.isArray(e) ? e.length === 1 && ((o = e[0].type) == null ? void 0 : o.toString()) === "Symbol(v-fgt)" ? e[0].children : e : ((t = e.type) == null ? void 0 : t.toString()) === "Symbol(v-fgt)" ? e.children : [e];
    }), b = i(() => {
      const e = a.maxNum ?? Number.MAX_SAFE_INTEGER;
      return e > 0 ? e : Number.MAX_SAFE_INTEGER;
    }), y = i(() => p.value.length > b.value), V = i(() => y.value ? p.value.slice(0, b.value) : p.value), z = i(() => y.value ? p.value.slice(b.value) : []), m = f(null), d = f(null), r = f(!1), P = () => {
      r.value = !r.value;
    };
    Z(d, (e) => {
      var o;
      (o = m.value) != null && o.contains(e.target) || (r.value = !1);
    });
    const A = (e) => {
      O("item-click", e), r.value = !1;
    }, B = f("placement-bottom"), { height: D } = ee(), T = () => {
      if (!d.value || !m.value)
        return "placement-bottom";
      const e = d.value.getBoundingClientRect(), o = m.value.getBoundingClientRect();
      B.value = o.bottom + e.height + 16 > D.value ? "placement-top" : "placement-bottom";
    };
    return N(r, (e) => {
      e && W(() => {
        T();
      });
    }), N(D, () => {
      r.value && T();
    }), (e, o) => (n(), _("div", ne, [
      (n(!0), _(G, null, I(V.value, (t, C) => {
        var c;
        return n(), v(h(M), {
          key: C,
          content: (c = t.props) == null ? void 0 : c.label,
          effect: "dark",
          placement: "top",
          "open-delay": 500,
          disabled: !a.showTooltip
        }, {
          default: S(() => [
            w("span", {
              class: "tr-action-group__btn-wrapper",
              onClick: (X) => {
                var s;
                return A((s = t.props) == null ? void 0 : s.name);
              }
            }, [
              (n(), v(x(t)))
            ], 8, re)
          ]),
          _: 2
        }, 1032, ["content", "disabled"]);
      }), 128)),
      y.value ? (n(), v(h(M), {
        key: 0,
        content: "更多",
        effect: "dark",
        placement: "top",
        "open-delay": 500,
        disabled: !a.showTooltip
      }, {
        default: S(() => [
          w("span", {
            ref_key: "moreBtnRef",
            ref: m,
            class: "tr-action-group__btn-wrapper",
            onClick: P
          }, [
            L(e.$slots, "moreBtn", {}, () => [
              E(h(te), { icon: h(Y) }, null, 8, ["icon"])
            ], !0),
            E(j, { name: "tr-action-group-dropdown" }, {
              default: S(() => [
                q(w("ul", {
                  ref_key: "dropDownRef",
                  ref: d,
                  class: J(["tr-action-group__dropdown", B.value])
                }, [
                  (n(!0), _(G, null, I(z.value, (t, C) => {
                    var c;
                    return n(), _("li", {
                      class: "tr-action-group__dropdown-item",
                      key: C,
                      onClick: K((X) => {
                        var s;
                        return A((s = t.props) == null ? void 0 : s.name);
                      }, ["stop"])
                    }, [
                      a.dropDownShowLabelOnly ? R("", !0) : (n(), v(x(t), { key: 0 })),
                      w("span", ae, Q((c = t.props) == null ? void 0 : c.label), 1)
                    ], 8, le);
                  }), 128))
                ], 2), [
                  [U, r.value]
                ])
              ]),
              _: 1
            })
          ], 512)
        ]),
        _: 3
      }, 8, ["disabled"])) : R("", !0)
    ]));
  }
}), g = /* @__PURE__ */ oe(ce, [["__scopeId", "data-v-afd2130f"]]), u = /* @__PURE__ */ $({
  __name: "ActionGroupItem",
  props: {
    name: {},
    label: {}
  },
  setup(l) {
    return (k, a) => L(k.$slots, "default");
  }
});
g.name = "TrActionGroup";
const se = function(l) {
  l.component(g.name, g);
};
g.install = se;
u.name = "TrActionGroupItem";
const ie = function(l) {
  l.component(u.name, u);
};
u.install = ie;
const ve = u;
export {
  ve as ActionGroupItem,
  g as default
};
