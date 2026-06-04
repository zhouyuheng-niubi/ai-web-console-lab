import { defineComponent as H, ref as p, computed as P, watch as W, watchEffect as ne, onMounted as Y, onBeforeUnmount as Z, createElementBlock as v, openBlock as g, normalizeClass as j, createElementVNode as u, withDirectives as oe, Fragment as z, renderList as M, createVNode as E, unref as w, toDisplayString as T, vShow as le, nextTick as ie, renderSlot as $, createCommentVNode as N, createBlock as L, normalizeStyle as ae, resolveComponent as ce, withCtx as O } from "vue";
import { A as Q, a as G, t as re, K as ue, U as ge } from "../tiny-robot-svgs.js";
function de(l, c = "") {
  const s = document.createElement("div");
  c && (s.className = c), s.style.visibility = "hidden", s.style.position = "absolute", s.style.whiteSpace = "nowrap", s.textContent = l, document.body.appendChild(s);
  const o = s.offsetWidth;
  return document.body.removeChild(s), o;
}
const F = /* @__PURE__ */ new Map();
function X(l, c = "") {
  const s = `${l}::${c}`;
  if (F.has(s))
    return F.get(s);
  const o = de(l, c);
  return F.set(s, o), o;
}
const ve = { class: "tr-common-suggestions_content" }, me = { class: "tr-common-suggestions_expanded-wrapper" }, pe = { class: "tr-common-suggestions_expanded-area" }, he = ["onClick"], fe = { class: "tr-common-suggestions_item_icon" }, ye = { class: "tr-common-suggestions_item_text" }, _e = { class: "tr-common-suggestions_container" }, ke = ["onClick"], Ce = { class: "tr-common-suggestions_item_icon" }, $e = { class: "tr-common-suggestions_item_text" }, xe = /* @__PURE__ */ H({
  __name: "SuggestionCapsule",
  props: {
    suggestions: {
      type: Array,
      required: !0
    },
    isExpanded: {
      type: Boolean,
      default: !1
    }
  },
  emits: ["suggestion-click", "show-expand-button"],
  setup(l, { emit: c }) {
    const s = l, o = c, n = p(null), f = p(!1), t = p(!1), m = p([]), a = p([]), h = p(0), S = p(null), R = P(() => {
      if (h.value <= 0 || a.value.length === 0) return [];
      const i = [], d = [...a.value];
      for (; d.length > 0; )
        i.push(d.splice(0, h.value));
      return i.reverse();
    }), b = async () => {
      if (await ie(), !n.value || s.suggestions.length === 0) {
        f.value = !1, o("show-expand-button", !1);
        return;
      }
      const d = n.value.clientWidth;
      m.value = [], a.value = [];
      let r = 0;
      const _ = 8;
      let k = 0;
      const B = Math.min(3, s.suggestions.length);
      for (let C = 0; C < B; C++) {
        const I = X(s.suggestions[C].text, "tr-common-suggestions_item") + _;
        k += I;
      }
      const q = k / B;
      h.value = Math.max(1, Math.floor(d / q));
      for (let C = 0; C < s.suggestions.length; C++) {
        const I = s.suggestions[C], A = X(I.text, "tr-common-suggestions_item") + _;
        r + A <= d ? (r += A, m.value.push(I)) : a.value.push(I);
      }
      f.value = a.value.length > 0, o("show-expand-button", f.value);
    }, y = (i) => {
      o("suggestion-click", i);
    };
    return W(
      () => s.isExpanded,
      (i) => {
        t.value = i;
      }
    ), ne(() => {
      n.value && s.suggestions.length && b();
    }), Y(() => {
      n.value && (S.value = new ResizeObserver(() => {
        b();
      }), S.value.observe(n.value));
    }), Z(() => {
      S.value && S.value.disconnect();
    }), (i, d) => (g(), v("div", {
      class: j(["tr-common-suggestions", { expanded: t.value }]),
      ref_key: "capsuleRef",
      ref: n
    }, [
      u("div", ve, [
        u("div", me, [
          oe(u("div", pe, [
            (g(!0), v(z, null, M(R.value, (r, _) => (g(), v("div", {
              key: `row-${_}`,
              class: "tr-common-suggestions_row"
            }, [
              (g(!0), v(z, null, M(r, (k, B) => (g(), v("div", {
                key: `hidden-${k.id}-${B}`,
                class: "tr-common-suggestions_item",
                onClick: (q) => y(k)
              }, [
                u("div", fe, [
                  E(w(Q))
                ]),
                u("div", ye, T(k.text), 1)
              ], 8, he))), 128))
            ]))), 128))
          ], 512), [
            [le, t.value && a.value.length > 0]
          ])
        ]),
        u("div", _e, [
          (g(!0), v(z, null, M(m.value, (r, _) => (g(), v("div", {
            key: `visible-${r.id}-${_}`,
            class: "tr-common-suggestions_item",
            onClick: (k) => y(r)
          }, [
            u("div", Ce, [
              E(w(Q))
            ]),
            u("div", $e, T(r.text), 1)
          ], 8, ke))), 128))
        ])
      ])
    ], 2));
  }
}), be = { class: "tr-suggestion-categories" }, we = ["onClick"], Se = {
  key: 0,
  class: "category-icon"
}, Ie = /* @__PURE__ */ H({
  __name: "CategoryNav",
  props: {
    categories: {
      type: Array,
      required: !0
    },
    activeCategory: {
      type: String,
      default: ""
    }
  },
  emits: ["category-select"],
  setup(l, { emit: c }) {
    const s = c, o = (n) => {
      s("category-select", n);
    };
    return (n, f) => (g(), v("div", be, [
      (g(!0), v(z, null, M(l.categories, (t) => (g(), v("div", {
        key: t.id,
        class: j(["tr-suggestion-categories-item", { active: l.activeCategory === t.id }]),
        onClick: (m) => o(t.id)
      }, [
        $(n.$slots, "category-label", { category: t }, () => [
          t.icon ? (g(), v("div", Se, T(t.icon), 1)) : N("", !0),
          u("span", null, T(t.label), 1)
        ])
      ], 10, we))), 128))
    ]));
  }
});
function Ee(l, c = {}) {
  const s = p(c.initialIndex || -1);
  W(l, (t) => {
    t.length > 0 && s.value === -1 ? s.value = 0 : t.length === 0 ? s.value = -1 : s.value >= t.length && (s.value = t.length - 1);
  });
  const o = (t) => {
    var m, a;
    if (l.value.length !== 0)
      switch (t.key) {
        case "ArrowUp":
          t.preventDefault(), s.value = (s.value - 1 + l.value.length) % l.value.length, n();
          break;
        case "ArrowDown":
          t.preventDefault(), s.value = (s.value + 1) % l.value.length, n();
          break;
        case "Enter":
        case "Tab":
          t.preventDefault(), s.value >= 0 && s.value < l.value.length && ((m = c.onSelect) == null || m.call(c, l.value[s.value]));
          break;
        case "Escape":
          t.preventDefault(), (a = c.onClose) == null || a.call(c);
          break;
      }
  }, n = () => {
    setTimeout(() => {
      const t = document.querySelector(`.tr-suggestion-list-item:nth-child(${s.value + 1})`), m = t == null ? void 0 : t.closest(".tr-suggestion-content");
      if (t && m) {
        const a = m.getBoundingClientRect(), h = t.getBoundingClientRect();
        h.bottom > a.bottom ? m.scrollTop += h.bottom - a.bottom : h.top < a.top && (m.scrollTop -= a.top - h.top);
      }
    }, 0);
  };
  return {
    activeIndex: s,
    handleKeyDown: o,
    scrollToActive: n,
    setActiveIndex: (t) => {
      t >= -1 && t < l.value.length && (s.value = t);
    }
  };
}
const Te = { class: "tr-suggestion-panel" }, Be = { class: "tr-suggestion-header" }, De = { class: "tr-suggestion-header-left" }, Oe = { class: "tr-suggestion-header-icon" }, Re = { class: "tr-suggestion-header-title" }, Ae = { class: "close-icon" }, Ke = {
  key: 0,
  class: "tr-suggestion-loading"
}, Ve = { key: 1 }, We = ["onClick", "onMouseenter"], ze = { class: "item-content" }, Me = { class: "item-label" }, Ne = {
  key: 0,
  class: "item-description"
}, qe = {
  key: 2,
  class: "tr-suggestion-empty"
}, Le = /* @__PURE__ */ H({
  __name: "SuggestionPanel",
  props: {
    items: {
      type: Array,
      required: !0
    },
    categories: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: !1
    },
    title: {
      type: String,
      default: "指令"
    },
    maxVisibleItems: {
      type: Number,
      default: 5
    }
  },
  emits: ["close", "select", "category-select", "item-hover"],
  setup(l, { expose: c, emit: s }) {
    const o = l, n = s, f = p(o.items), { handleKeyDown: t, activeIndex: m } = Ee(f, {
      initialIndex: 0,
      onClose: () => n("close"),
      onSelect: (i) => n("select", i)
    }), a = p(o.categories.length > 0 ? o.categories[0].id : ""), h = P(() => {
      if (o.categories.length === 0 || !a.value)
        return o.items;
      const i = o.categories.find((d) => d.id === a.value);
      return i ? i.items : [];
    }), S = (i) => {
      a.value = i;
      const d = o.categories.find((r) => r.id === i);
      d && n("category-select", d);
    }, R = (i) => {
      n("select", i);
    }, b = () => {
      n("close");
    }, y = (i) => {
      n("item-hover", i);
    };
    return c({
      handleKeyDown: t
    }), (i, d) => (g(), v("div", Te, [
      u("div", Be, [
        u("div", De, [
          u("div", Oe, [
            $(i.$slots, "title-icon", {}, () => [
              E(w(G), { style: { color: "#1476ff", "font-size": "24px" } })
            ])
          ]),
          u("div", Re, T(l.title), 1)
        ]),
        u("span", {
          class: "tr-suggestion-close-btn",
          onClick: b
        }, [
          u("span", Ae, [
            E(w(re))
          ])
        ])
      ]),
      l.categories.length > 0 ? (g(), L(Ie, {
        key: 0,
        categories: l.categories,
        "active-category": a.value,
        onCategorySelect: S
      }, null, 8, ["categories", "active-category"])) : N("", !0),
      u("div", {
        class: "tr-suggestion-content",
        style: ae({ "max-height": h.value.length > l.maxVisibleItems ? `${l.maxVisibleItems * 56}px` : "auto" })
      }, [
        l.loading ? (g(), v("div", Ke, [
          $(i.$slots, "loading-indicator", {}, () => [
            d[0] || (d[0] = u("div", { class: "tr-suggestion-loading-spinner" }, null, -1))
          ])
        ])) : h.value.length > 0 ? (g(), v("ul", Ve, [
          (g(!0), v(z, null, M(h.value, (r, _) => (g(), v("li", {
            key: r.id,
            class: j(["tr-suggestion-list-item", { "tr-suggestion-item-active": _ === w(m) }]),
            onClick: (k) => R(r),
            onMouseenter: (k) => y(_)
          }, [
            $(i.$slots, "item", {
              item: r,
              active: _ === w(m)
            }, () => [
              u("div", ze, [
                u("div", Me, T(r.text), 1),
                r.description ? (g(), v("div", Ne, T(r.description), 1)) : N("", !0)
              ])
            ])
          ], 42, We))), 128))
        ])) : (g(), v("div", qe, [
          $(i.$slots, "empty", {}, () => [
            d[1] || (d[1] = u("p", null, "无匹配结果", -1))
          ])
        ]))
      ], 4)
    ]));
  }
}), Pe = (l) => {
  const c = (o) => l.triggerKeys.includes(o);
  return {
    isTriggerKey: c,
    detectTrigger: (o, n) => {
      const t = o.target.selectionStart || 0;
      return t > 0 && c(n[t - 1]) && (t === 1 || n[t - 2] === " " || n[t - 2] === `
`) ? {
        text: n[t - 1],
        position: t - 1
      } : null;
    }
  };
}, Ue = { class: "tr-suggestion__header" }, U = /* @__PURE__ */ H({
  __name: "index",
  props: {
    triggerKeys: { default: () => ["/"] },
    items: { default: () => [] },
    categories: { default: () => [] },
    open: { type: Boolean, default: void 0 },
    className: {},
    theme: { default: "light" },
    loading: { type: Boolean, default: !1 },
    closeOnOutsideClick: { type: Boolean, default: !0 },
    title: { default: "快捷指令" },
    maxVisibleItems: { default: 5 },
    defaultExpanded: { type: Boolean, default: !1 }
  },
  emits: ["update:open", "select", "close", "trigger", "category-select", "suggestion-select", "update:expanded", "fill-template"],
  setup(l, { expose: c, emit: s }) {
    const o = l, n = s, f = p(!1), t = p([]), m = p({
      text: "",
      position: 0
    }), a = p(o.defaultExpanded), h = p(!1), S = () => {
      a.value = !a.value, n("update:expanded", a.value);
    }, R = (e) => {
      h.value = e;
    }, b = p(""), y = p(-1), i = p(null), d = p(null), r = P(() => o.open !== void 0 ? o.open : f.value), _ = P(() => {
      if (o.categories.length === 0 || !b.value)
        return t.value;
      const e = o.categories.find((x) => x.id === b.value);
      return e ? e.items : [];
    });
    W(r, (e) => {
      e ? y.value = _.value.length > 0 ? 0 : -1 : y.value = -1;
    }), W(_, (e) => {
      e.length > 0 && y.value === -1 ? y.value = 0 : e.length === 0 ? y.value = -1 : y.value >= e.length && (y.value = e.length - 1);
    }), W(
      () => o.categories,
      (e) => {
        e.length > 0 && !b.value && (b.value = e[0].id);
      },
      { immediate: !0 }
    );
    const k = () => {
      t.value = [...o.items];
    }, { detectTrigger: B } = Pe(o), q = (e) => {
      n("suggestion-select", e), n("select", e.value, {
        text: "",
        position: 0
      }), e.template && n("fill-template", e.template);
    }, C = (e) => {
      e === !1 ? K() : (typeof e == "object" && e !== null && (m.value = {
        text: e.text || "",
        position: e.position || 0
      }), k(), f.value = !0, n("update:open", !0));
    }, I = (e, x) => {
      const V = B(e, x);
      return V ? (m.value = V, C(V), !0) : r.value && x === "" ? (C(!1), !0) : !1;
    }, A = (e) => {
      if (r.value && d.value) {
        d.value.handleKeyDown(e);
        return;
      }
    }, K = () => {
      o.open === void 0 && (f.value = !1), n("update:open", !1), n("close");
    }, ee = (e) => {
      b.value = e.id, y.value = 0, n("category-select", e);
    }, te = (e, x) => {
      n("select", e.text, x), e.template && n("fill-template", e.template), K();
    }, J = (e) => {
      o.closeOnOutsideClick && r.value && i.value && !i.value.contains(e.target) && K();
    }, se = () => {
      r.value ? K() : (k(), f.value = !0, n("update:open", !0));
    };
    return Y(() => {
      o.closeOnOutsideClick && document.addEventListener("click", J);
    }), Z(() => {
      o.closeOnOutsideClick && document.removeEventListener("click", J);
    }), c({
      trigger: C,
      keyDown: A,
      input: I,
      toggleExpand: S
    }), (e, x) => {
      const V = ce("IconEdit");
      return g(), v("div", {
        ref_key: "rootRef",
        ref: i,
        class: j(["tr-suggestion", e.className, { "tr-suggestion--dark": e.theme === "dark" }])
      }, [
        u("div", Ue, [
          u("div", {
            class: "tr-suggestion__trigger",
            onClick: se
          }, [
            E(w(G), { style: { color: "#1476ff" } })
          ]),
          E(xe, {
            suggestions: e.items,
            isExpanded: a.value,
            onSuggestionClick: q,
            onShowExpandButton: R
          }, {
            "suggestion-icon": O((D) => [
              $(e.$slots, "capsule-icon", {
                suggestion: D.suggestion
              }, () => [
                E(V)
              ])
            ]),
            _: 3
          }, 8, ["suggestions", "isExpanded"]),
          h.value ? (g(), v("div", {
            key: 0,
            class: "tr-suggestion__expand-button",
            onClick: S
          }, [
            a.value ? (g(), L(w(ge), { key: 1 })) : (g(), L(w(ue), { key: 0 }))
          ])) : N("", !0)
        ]),
        $(e.$slots, "trigger", {
          onTrigger: C,
          onKeyDown: A,
          onInput: I
        }),
        r.value ? (g(), L(Le, {
          key: 0,
          ref_key: "panelRef",
          ref: d,
          class: "tr-suggestion-panel placement-top",
          items: t.value,
          categories: e.categories,
          loading: e.loading,
          title: e.title,
          maxVisibleItems: e.maxVisibleItems,
          triggerContext: m.value,
          onClose: K,
          onSelect: te,
          onCategorySelect: ee
        }, {
          "title-icon": O(() => [
            $(e.$slots, "title-icon", {}, () => [
              E(w(G), { style: { "font-size": "24px", color: "#1476ff" } })
            ])
          ]),
          "category-label": O((D) => [
            $(e.$slots, "category-label", {
              category: D.category
            })
          ]),
          item: O((D) => [
            $(e.$slots, "item", {
              item: D.item,
              active: D.active
            })
          ]),
          "loading-indicator": O(() => [
            $(e.$slots, "loading-indicator", {}, () => [
              x[0] || (x[0] = u("div", { class: "tr-suggestion__loading-spinner" }, null, -1))
            ])
          ]),
          empty: O(() => [
            $(e.$slots, "empty", {}, () => [
              x[1] || (x[1] = u("p", null, "无匹配结果", -1))
            ])
          ]),
          _: 3
        }, 8, ["items", "categories", "loading", "title", "maxVisibleItems", "triggerContext"])) : N("", !0)
      ], 2);
    };
  }
});
U.name = "TrSuggestion";
const He = function(l) {
  l.component(U.name, U);
};
U.install = He;
export {
  U as default
};
