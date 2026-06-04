import { defineComponent as X, ref as E, computed as z, onMounted as D, watch as K, createElementBlock as a, openBlock as t, createCommentVNode as k, Fragment as I, renderList as S, toDisplayString as y, createVNode as b, unref as l, nextTick as O, createElementVNode as p, createBlock as d, withCtx as f, createTextVNode as U, resolveDynamicComponent as C } from "vue";
import { K as T, U as N, d as q, s as j, p as H, e as J } from "../tiny-robot-svgs.js";
import { B as R } from "../index5.js";
import $, { ActionGroupItem as V } from "../action-group/index.js";
import Q from "../icon-button/index.js";
import { _ as P } from "../_plugin-vue_export-helper.js";
const W = { class: "tr-feedback__source-list" }, Y = ["href"], Z = /* @__PURE__ */ X({
  __name: "SourceList",
  props: {
    sources: {},
    linesLimit: { default: Number.MAX_SAFE_INTEGER }
  },
  setup(h) {
    const _ = h, e = E(!1), L = E([]), c = E(null), g = () => {
      O(() => {
        const u = L.value.map((o) => (o == null ? void 0 : o.offsetTop) || 0), n = Array.from(new Set(u));
        if (n.length > _.linesLimit) {
          const o = n[_.linesLimit - 1], s = u.lastIndexOf(o);
          c.value = s;
        } else
          c.value = null;
      });
    }, A = z(() => _.sources.length - (c.value || 0));
    D(g), K(() => _.sources, g);
    const m = (u, n) => {
      u && (L.value[n] = u);
    };
    return (u, n) => (t(), a("div", W, [
      (t(!0), a(I, null, S(_.sources, (o, s) => (t(), a(I, { key: s }, [
        !c.value || e.value || s < c.value ? (t(), a("a", {
          key: 0,
          class: "pill",
          href: o.link,
          target: "_blank",
          ref_for: !0,
          ref: (r) => m(r, s)
        }, y(o.label), 9, Y)) : k("", !0),
        c.value && !e.value && s === c.value ? (t(), a("span", {
          key: 1,
          class: "pill",
          onClick: n[0] || (n[0] = (r) => e.value = !0)
        }, y(A.value) + "+ ", 1)) : k("", !0)
      ], 64))), 128)),
      e.value ? (t(), a("span", {
        key: 0,
        class: "pill collapse-pill",
        onClick: n[1] || (n[1] = (o) => e.value = !1)
      }, [
        b(l(T))
      ])) : k("", !0)
    ]));
  }
}), ee = /* @__PURE__ */ P(Z, [["__scopeId", "data-v-5817f518"]]), te = { class: "tr-feedback" }, se = { class: "tr-feedback__operations" }, oe = { class: "tr-feedback__operations-left" }, ne = { key: 1 }, le = { class: "tr-feedback__operations-right" }, ae = {
  key: 0,
  class: "tr-feedback__footer"
}, re = { key: 0 }, ie = /* @__PURE__ */ X({
  __name: "index",
  props: {
    operations: {},
    operationsLimit: { default: Number.MAX_SAFE_INTEGER },
    actions: {},
    actionsLimit: { default: Number.MAX_SAFE_INTEGER },
    sources: {},
    sourcesLinesLimit: { default: Number.MAX_SAFE_INTEGER }
  },
  emits: ["operation", "action"],
  setup(h, { emit: _ }) {
    const e = h, L = {
      copy: J,
      refresh: H,
      like: j,
      dislike: q
    }, c = _, g = (n) => {
      var o, s, r;
      (r = (s = (o = e.operations) == null ? void 0 : o.find((v) => v.name === n)) == null ? void 0 : s.onClick) == null || r.call(s), c("operation", n);
    }, A = (n) => {
      var o, s, r;
      (r = (s = (o = e.actions) == null ? void 0 : o.find((v) => v.name === n)) == null ? void 0 : s.onClick) == null || r.call(s), c("action", n);
    }, m = E(!1), u = () => {
      m.value = !m.value;
    };
    return (n, o) => {
      var s, r, v, w, B, F, M, G;
      return t(), a("div", te, [
        p("div", se, [
          p("div", oe, [
            (s = e.operations) != null && s.length ? (t(), d(l($), {
              key: 0,
              "max-num": e.operationsLimit,
              "drop-down-show-label-only": !0,
              onItemClick: g,
              class: "tr-feedback__operations-left-action-group"
            }, {
              moreBtn: f(() => [
                b(l(R), {
                  round: "",
                  size: "mini",
                  "reset-time": 0,
                  class: "tr-feedback__operations-more-btn"
                }, {
                  default: f(() => [
                    o[0] || (o[0] = p("span", null, "更多", -1)),
                    b(l(N))
                  ]),
                  _: 1
                })
              ]),
              default: f(() => [
                (t(!0), a(I, null, S(e.operations, (i) => (t(), d(l(V), {
                  key: i.name,
                  name: i.name,
                  label: i.label
                }, {
                  default: f(() => [
                    b(l(R), {
                      round: "",
                      "reset-time": 0,
                      size: "mini"
                    }, {
                      default: f(() => [
                        U(y(i.label), 1)
                      ]),
                      _: 2
                    }, 1024)
                  ]),
                  _: 2
                }, 1032, ["name", "label"]))), 128))
              ]),
              _: 1
            }, 8, ["max-num"])) : (r = e.sources) != null && r.length ? (t(), a("div", ne, [
              p("span", {
                class: "tr-feedback__source",
                onClick: u
              }, [
                p("span", null, y((v = e.sources) == null ? void 0 : v.length) + "条来源", 1),
                (t(), d(C(m.value ? l(T) : l(N))))
              ])
            ])) : k("", !0)
          ]),
          p("div", le, [
            b(l($), {
              "max-num": e.actionsLimit,
              "show-tooltip": !0,
              onItemClick: A
            }, {
              default: f(() => [
                (t(!0), a(I, null, S(e.actions, (i) => (t(), d(l(V), {
                  key: i.name,
                  name: i.name,
                  label: i.label
                }, {
                  default: f(() => [
                    typeof i.icon == "string" ? (t(), d(l(Q), {
                      key: 0,
                      icon: L[i.icon]
                    }, null, 8, ["icon"])) : (t(), d(C(i.icon), { key: 1 }))
                  ]),
                  _: 2
                }, 1032, ["name", "label"]))), 128))
              ]),
              _: 1
            }, 8, ["max-num"])
          ])
        ]),
        (w = e.operations) != null && w.length && ((B = e.sources) != null && B.length) || m.value && e.sources ? (t(), a("div", ae, [
          (F = e.operations) != null && F.length && ((M = e.sources) != null && M.length) ? (t(), a("div", re, [
            p("span", {
              class: "tr-feedback__source",
              onClick: u
            }, [
              p("span", null, y((G = e.sources) == null ? void 0 : G.length) + "条来源", 1),
              (t(), d(C(m.value ? l(T) : l(N))))
            ])
          ])) : k("", !0),
          m.value && e.sources ? (t(), d(l(ee), {
            key: 1,
            sources: e.sources,
            "lines-limit": e.sourcesLinesLimit
          }, null, 8, ["sources", "lines-limit"])) : k("", !0)
        ])) : k("", !0)
      ]);
    };
  }
}), x = /* @__PURE__ */ P(ie, [["__scopeId", "data-v-cc6ef316"]]);
x.name = "TrFeedback";
const ce = function(h) {
  h.component(x.name, x);
};
x.install = ce;
export {
  x as default
};
