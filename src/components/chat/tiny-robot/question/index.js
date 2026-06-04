import { ref as m, computed as H, watch as D, defineComponent as K, onMounted as Z, onBeforeUnmount as ne, createElementBlock as d, openBlock as i, normalizeClass as V, createElementVNode as t, withDirectives as le, Fragment as L, renderList as R, createVNode as T, unref as q, toDisplayString as O, vShow as ie, nextTick as ae, createCommentVNode as Y, withModifiers as ce, normalizeStyle as ue, renderSlot as B, createTextVNode as ee, createBlock as J, withCtx as N } from "vue";
import { A as X, a as te, O as se, K as de, U as re } from "../tiny-robot-svgs.js";
import { i as me } from "../close.js";
import { B as ve } from "../index5.js";
function he(v = m([])) {
  const w = m(""), y = m(!1), a = m(!1), r = m("light"), k = H(() => {
    if (!w.value && v.value.length > 0)
      return v.value[0].questions;
    const s = v.value.find((l) => l.id === w.value);
    return s ? s.questions : [];
  }), x = (s) => {
    w.value = s;
  }, p = () => {
    a.value = !0;
  }, _ = () => {
    a.value = !1;
  }, c = () => {
    y.value = !y.value;
  }, b = (s) => {
    const l = document.body;
    if (s) {
      const Q = window.scrollY || document.documentElement.scrollTop;
      l.style.position = "fixed", l.style.width = "100%", l.style.top = `-${Q}px`, l.style.overflowY = "scroll", l.classList.add("tr-modal-open");
    } else
      l.style.position = "", l.style.width = "", l.style.top = "", l.style.overflowY = "", l.classList.remove("tr-modal-open");
  };
  return D(a, (s) => {
    b(s);
  }), {
    activeCategory: w,
    isFloatingExpanded: y,
    modalVisible: a,
    currentTheme: r,
    activeQuestions: k,
    setActiveCategory: x,
    openModal: p,
    closeModal: _,
    toggleFloating: c,
    toggleTheme: () => {
      r.value = r.value === "light" ? "dark" : "light", document.documentElement.setAttribute("data-theme", r.value);
    },
    setTheme: (s) => {
      r.value = s, document.documentElement.setAttribute("data-theme", s);
    },
    refreshData: async () => Promise.resolve(),
    toggleBodyScroll: b
  };
}
const pe = { class: "tr-common-questions_content" }, fe = { class: "tr-common-questions_expanded-wrapper" }, ge = { class: "tr-common-questions_expanded-area" }, ye = ["onClick"], ke = { class: "tr-common-questions_item_icon" }, _e = { class: "tr-common-questions_item_text" }, Ce = { class: "tr-common-questions_container" }, qe = ["onClick"], $e = { class: "tr-common-questions_item_icon" }, we = { class: "tr-common-questions_item_text" }, xe = /* @__PURE__ */ K({
  __name: "CommonQuestions",
  props: {
    questions: {
      type: Array,
      required: !0
    },
    isExpanded: {
      type: Boolean,
      default: !1
    }
  },
  emits: ["question-click", "toggle-expand", "hover-change"],
  setup(v, { emit: w }) {
    const y = v, a = w, r = m(null), k = m(!1), x = m(!1), p = m(!1), _ = m([]), c = m([]), b = m(0), f = m(null), o = H(() => c.value.length > 0), u = H(() => {
      if (b.value <= 0 || c.value.length === 0) return [];
      const e = [], h = [...c.value];
      for (; h.length > 0; )
        e.push(h.splice(0, b.value));
      return e.reverse();
    }), s = (e, h, $ = 40) => {
      if (h.length === 0) return 0;
      const E = e.clientWidth, W = 8, g = document.createElement("div");
      g.className = "tr-common-questions_item", g.style.visibility = "hidden", g.style.position = "absolute", e.appendChild(g);
      let S = 0;
      const z = Math.min(3, h.length);
      for (let A = 0; A < z; A++) {
        g.innerHTML = `<span class="icon-placeholder"></span>${h[A].text}`;
        const j = g.offsetWidth + W + 24;
        S += j;
      }
      const M = S / z;
      return e.removeChild(g), {
        maxItemsCount: Math.max(1, Math.floor((E - $) / M))
      };
    }, l = (e, h, $, E = 40) => {
      const g = [], S = [];
      let z = 0;
      if (h.length === 0)
        return { visible: g, hidden: S };
      const M = document.createElement("div");
      M.className = "tr-common-questions_item", M.style.visibility = "hidden", M.style.position = "absolute", e.appendChild(M);
      for (let A = 0; A < h.length; A++) {
        const I = h[A];
        M.innerHTML = `<span class="icon-placeholder"></span>${I.text}`;
        const G = M.offsetWidth + 8 + 24, oe = $ - E;
        z + G <= oe ? (z += G, g.push(I)) : S.push(I);
      }
      return e.removeChild(M), { visible: g, hidden: S };
    };
    D(
      () => y.isExpanded,
      (e) => {
        p.value = e, e ? _.value.pop() : _.value.push(c.value[0]);
      }
    );
    const Q = async () => {
      if (await ae(), r.value) {
        const e = r.value, h = e.clientWidth, $ = 40;
        if (_.value = [], c.value = [], y.questions.length === 0) {
          x.value = !1;
          return;
        }
        const { maxItemsCount: E } = s(e, y.questions, $);
        b.value = E;
        const { visible: W, hidden: g } = l(e, y.questions, h, $);
        _.value = W, c.value = g, c.value.length > 0 && _.value.push(c.value[0]), x.value = c.value.length > 0, y.isExpanded || (p.value = !1);
      }
    }, P = () => {
      f.value && (clearTimeout(f.value), f.value = null), k.value = !0, a("hover-change", !0);
    }, U = () => {
      f.value = setTimeout(() => {
        k.value = !1, a("hover-change", !1), f.value = null;
      }, 500);
    }, n = (e) => {
      a("question-click", e);
    };
    D(
      () => y.questions,
      () => {
        Q();
      },
      { deep: !0 }
    );
    const C = () => {
      Q();
    };
    return Z(() => {
      Q(), window.addEventListener("resize", C);
    }), ne(() => {
      window.removeEventListener("resize", C), f.value && (window.clearTimeout(f.value), f.value = null);
    }), (e, h) => (i(), d("div", {
      class: V(["tr-common-questions", { expanded: p.value }]),
      ref_key: "commonQuestionsRef",
      ref: r,
      onMouseenter: P,
      onMouseleave: U
    }, [
      t("div", pe, [
        t("div", fe, [
          le(t("div", ge, [
            (i(!0), d(L, null, R(u.value, ($, E) => (i(), d("div", {
              key: `row-${E}`,
              class: "tr-common-questions_row"
            }, [
              (i(!0), d(L, null, R($, (W, g) => (i(), d("div", {
                key: `hidden-${W.id}-${g}`,
                class: "tr-common-questions_item",
                onClick: (S) => n(W)
              }, [
                t("div", ke, [
                  T(q(X))
                ]),
                t("div", _e, O(W.text), 1)
              ], 8, ye))), 128))
            ]))), 128))
          ], 512), [
            [ie, p.value && c.value.length > 0]
          ])
        ]),
        t("div", Ce, [
          (i(!0), d(L, null, R(_.value, ($, E) => (i(), d("div", {
            key: `visible-${$.id}-${E}`,
            class: V(["tr-common-questions_item", { "last-item": !p.value && E === _.value.length - 1 && o.value }]),
            onClick: (W) => n($)
          }, [
            t("div", $e, [
              T(q(X))
            ]),
            t("div", we, O($.text), 1)
          ], 10, qe))), 128))
        ])
      ])
    ], 34));
  }
}), be = { class: "tr-question-header" }, Ee = { style: { display: "flex", "align-items": "center", gap: "12px", "font-size": "36px" } }, Qe = {
  key: 0,
  class: "tr-question-categories"
}, We = ["onClick"], Me = { class: "category-icon" }, Te = { class: "tr-question-content" }, Be = {
  key: 0,
  class: "tr-question-loading"
}, Oe = { key: 1 }, Se = ["onClick"], Ae = {
  key: 2,
  class: "tr-question-empty"
}, ze = /* @__PURE__ */ K({
  __name: "HotQuestions",
  props: {
    visible: {
      type: Boolean,
      default: !1
    },
    categories: {
      type: Array,
      default: () => []
    },
    modalWidth: {
      type: String,
      default: "640px"
    },
    loading: {
      type: Boolean,
      default: !1
    },
    closeOnClickOutside: {
      type: Boolean,
      default: !0
    }
  },
  emits: ["update:visible", "close", "select-category", "question-click"],
  setup(v, { emit: w }) {
    const y = me(), a = v, r = w, k = m(""), x = H(() => {
      if (!k.value && a.categories.length > 0)
        return a.categories[0].questions || [];
      const o = a.categories.find((u) => u.id === k.value);
      return o ? o.questions : [];
    });
    D(
      () => a.categories,
      (o) => {
        o.length > 0 && !k.value && (k.value = o[0].id);
      },
      { immediate: !0 }
    );
    const p = () => {
      r("update:visible", !1), r("close");
    }, _ = (o) => {
      k.value = o, r(
        "select-category",
        a.categories.find((u) => u.id === o)
      );
    }, c = (o) => {
      r("question-click", o);
    }, b = (o) => {
      a.closeOnClickOutside && !o.composedPath().includes(f.value) && p();
    }, f = m(null);
    return (o, u) => v.visible ? (i(), d("div", {
      key: 0,
      class: "tr-question-modal-backdrop",
      onMousedown: b
    }, [
      t("div", {
        ref_key: "modalRef",
        ref: f,
        class: "tr-question-panel",
        style: ue({ width: v.modalWidth }),
        onMousedown: u[0] || (u[0] = ce(() => {
        }, ["stop"]))
      }, [
        t("div", be, [
          t("div", Ee, [
            t("div", null, [
              T(q(te), { style: { color: "#1476ff", "font-size": "24px" } })
            ]),
            u[1] || (u[1] = t("div", { class: "tr-question-header-title" }, "热门问题", -1))
          ]),
          t("span", {
            class: "tr-question-close-btn",
            onClick: p
          }, [
            T(q(ve), {
              icon: q(y),
              type: "text"
            }, null, 8, ["icon"])
          ])
        ]),
        v.categories.length > 0 ? (i(), d("div", Qe, [
          (i(!0), d(L, null, R(v.categories, (s) => (i(), d("div", {
            key: s.id,
            class: V(["tr-question-categories-item", { active: k.value === s.id }]),
            onClick: (l) => _(s.id)
          }, [
            B(o.$slots, "category-label", { category: s }, () => [
              t("div", Me, [
                T(q(se))
              ]),
              t("span", null, O(s.label), 1)
            ])
          ], 10, We))), 128))
        ])) : Y("", !0),
        t("div", Te, [
          v.loading ? (i(), d("div", Be, [
            B(o.$slots, "loading-indicator", {}, () => [
              u[2] || (u[2] = t("div", { class: "tr-question-loading-spinner" }, null, -1))
            ])
          ])) : x.value.length > 0 ? (i(), d("ul", Oe, [
            (i(!0), d(L, null, R(x.value, (s, l) => (i(), d("li", {
              key: s.id,
              class: "tr-question-list-item",
              onClick: (Q) => c(s)
            }, [
              B(o.$slots, "question-item", {
                question: s,
                index: l
              }, () => [
                t("span", null, O(l + 1) + ".", 1),
                ee(" " + O(s.text), 1)
              ])
            ], 8, Se))), 128))
          ])) : (i(), d("div", Ae, [
            B(o.$slots, "empty-state", {}, () => [
              u[3] || (u[3] = t("p", null, "暂无相关问题", -1))
            ])
          ]))
        ])
      ], 36)
    ], 32)) : Y("", !0);
  }
}), Le = ["data-theme"], Re = { class: "tr-question__header" }, He = { class: "category-icon" }, F = /* @__PURE__ */ K({
  __name: "index",
  props: {
    categories: { default: () => [] },
    commonQuestions: { default: () => [] },
    initialExpanded: { type: Boolean, default: !1 },
    modalWidth: { default: "640px" },
    theme: { default: "light" },
    closeOnClickOutside: { type: Boolean, default: !0 },
    loading: { type: Boolean, default: !1 }
  },
  emits: ["question-click", "select-category"],
  setup(v, { expose: w, emit: y }) {
    const a = v, r = () => {
      p.value = !p.value;
    }, k = y, x = H(() => a.categories), p = m(a.initialExpanded), _ = m(!1), { modalVisible: c, currentTheme: b, setActiveCategory: f, openModal: o, closeModal: u, setTheme: s, refreshData: l } = he(x);
    D(
      () => a.theme,
      (n) => {
        s(n);
      }
    );
    const Q = (n) => {
      u(), k("question-click", n);
    }, P = (n) => {
      _.value = n;
    }, U = (n) => {
      n && (f(n.id), k("select-category", n));
    };
    return Z(() => {
      document.documentElement.setAttribute("data-theme", b.value);
    }), w({
      openModal: o,
      closeModal: u,
      toggleFloating: r,
      setActiveCategory: f,
      refreshData: l
    }), (n, C) => (i(), d("div", {
      class: V(["tr-question-container", [`theme-${n.theme}`]]),
      "data-theme": n.theme
    }, [
      t("div", Re, [
        t("div", {
          class: "tr-question__trigger",
          onClick: C[0] || (C[0] = //@ts-ignore
          (...e) => q(o) && q(o)(...e))
        }, [
          T(q(te), { style: { color: "#1476ff" } })
        ]),
        T(xe, {
          questions: n.commonQuestions,
          isExpanded: p.value,
          onQuestionClick: Q,
          onHoverChange: P
        }, null, 8, ["questions", "isExpanded"]),
        _.value ? (i(), d("div", {
          key: 0,
          class: "tr-question__expand-button",
          onClick: r
        }, [
          p.value ? (i(), J(q(re), { key: 1 })) : (i(), J(q(de), { key: 0 }))
        ])) : Y("", !0)
      ]),
      T(ze, {
        visible: q(c),
        categories: x.value,
        "modal-width": n.modalWidth,
        loading: n.loading,
        "close-on-click-outside": n.closeOnClickOutside,
        "onUpdate:visible": C[1] || (C[1] = (e) => c.value = e),
        onClose: C[2] || (C[2] = (e) => c.value = !1),
        onQuestionClick: Q,
        onSelectCategory: U
      }, {
        "category-label": N(({ category: e }) => [
          B(n.$slots, "category-label", { category: e }, () => [
            t("div", He, [
              T(q(se))
            ]),
            t("span", null, O(e.label), 1)
          ])
        ]),
        "question-item": N(({ question: e, index: h }) => [
          B(n.$slots, "question-item", {
            question: e,
            index: h
          }, () => [
            t("span", null, O(h + 1) + ".", 1),
            ee(" " + O(e.text), 1)
          ])
        ]),
        "loading-indicator": N(() => [
          B(n.$slots, "loading-indicator", {}, () => [
            C[3] || (C[3] = t("div", { class: "tr-question-loading-spinner" }, null, -1))
          ])
        ]),
        "empty-state": N(() => [
          B(n.$slots, "empty-state", {}, () => [
            C[4] || (C[4] = t("p", null, "暂无相关问题", -1))
          ])
        ]),
        _: 3
      }, 8, ["visible", "categories", "modal-width", "loading", "close-on-click-outside"])
    ], 10, Le));
  }
});
F.name = "TrQuestion";
const De = function(v) {
  v.component(F.name, F);
};
F.install = De;
export {
  F as default
};
