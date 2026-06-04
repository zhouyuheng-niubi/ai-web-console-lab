import { defineComponent as V, createElementBlock as u, openBlock as n, normalizeStyle as X, normalizeClass as D, createElementVNode as p, toDisplayString as k, createVNode as m, unref as e, ref as G, watchEffect as Y, nextTick as Z, mergeModels as N, useCssVars as q, computed as h, useModel as P, createCommentVNode as E, Fragment as T, renderList as $, createBlock as R, withDirectives as ee, mergeProps as te, withCtx as z, withModifiers as H, vModelText as re } from "vue";
import { f as oe, z as se, r as ae, n as ne, t as ie } from "../tiny-robot-svgs.js";
import { I as le } from "../index6.js";
import { T as S } from "../index4.js";
import B from "../icon-button/index.js";
import { o as ce } from "../index3.js";
import { _ as M } from "../_plugin-vue_export-helper.js";
const ue = /* @__PURE__ */ V({
  __name: "item-tag",
  props: {
    text: {},
    type: { default: "default" },
    style: {}
  },
  setup(i) {
    const t = i;
    return (a, _) => (n(), u("div", {
      class: D(["tr-history__item-tag", t.type]),
      style: X(t.style)
    }, [
      p("span", null, k(t.text), 1)
    ], 6));
  }
}), de = /* @__PURE__ */ M(ue, [["__scopeId", "data-v-346767bb"]]), _e = { class: "tr-history__empty" }, pe = { class: "tr-history__empty-icon" }, he = { class: "tr-history__empty-text" }, me = /* @__PURE__ */ V({
  __name: "search-empty",
  props: {
    text: { default: "暂无内容" }
  },
  setup(i) {
    const t = i;
    return (a, _) => (n(), u("div", _e, [
      p("span", pe, [
        m(e(oe))
      ]),
      p("span", he, k(t.text), 1)
    ]));
  }
}), fe = /* @__PURE__ */ M(me, [["__scopeId", "data-v-b21f5bc0"]]), ve = (i) => {
  const t = G(), a = (l) => {
    t.value = {
      id: l.id,
      title: l.title,
      rawData: l
    };
  }, _ = G(null), f = (l) => {
    l && Z(() => {
      _.value = l, _.value.focus();
    });
  };
  let r;
  const v = () => {
    if (t.value) {
      if (t.value.title !== t.value.rawData.title) {
        const { title: l, rawData: I } = t.value;
        i("item-title-change", l, I);
      }
      t.value = void 0;
    }
    r == null || r(), r = void 0;
  }, g = () => {
    t.value = void 0, r == null || r(), r = void 0;
  }, b = (l) => {
    l.key === "Enter" ? v() : l.key === "Escape" && g();
  };
  return Y(() => {
    _.value && (r == null || r(), r = ce(_, () => {
      v();
    }));
  }), {
    editingItem: t,
    handleEdit: a,
    handleEditorInputRef: f,
    handleKeyDown: b
  };
}, ye = { class: "tr-history" }, ke = { class: "tr-history__tabs" }, ge = ["onClick"], be = {
  key: 0,
  class: "tr-history__search"
}, xe = { class: "tr-history__content" }, Ce = {
  key: 0,
  class: "tr-history__group-title"
}, Te = ["onClick"], Ie = { class: "tr-history__item-title" }, we = { class: "tr-history__item-actions" }, Ee = { class: "tr-history__close" }, $e = /* @__PURE__ */ V({
  __name: "index",
  props: /* @__PURE__ */ N({
    tabTitle: {},
    data: {},
    activeTab: {},
    searchBar: { type: Boolean },
    searchQuery: {},
    searchPlaceholder: {},
    searchFn: { type: Function, default: (i, { title: t }) => i ? t.toLowerCase().includes(i.toLowerCase()) : !0 },
    selected: {},
    tabs: {}
  }, {
    activeTab: {},
    activeTabModifiers: {},
    searchQuery: {},
    searchQueryModifiers: {}
  }),
  emits: /* @__PURE__ */ N(["close", "item-click", "item-title-change", "item-delete"], ["update:activeTab", "update:searchQuery"]),
  setup(i, { emit: t }) {
    q((c) => ({
      d4b77bae: b.value ? "1px solid rgb(240, 240, 240)" : "none",
      "659130e6": b.value ? "2px solid rgb(25, 25, 25)" : "none"
    }));
    const a = i, _ = P(i, "activeTab"), f = P(i, "searchQuery"), r = t, v = h(() => Array.isArray(a.tabs) ? a.tabs : [{ title: a.tabTitle, id: "0" }]), g = h(() => _.value || v.value[0].id), b = h(() => v.value.length > 1), l = (c) => {
      var s;
      const o = typeof ((s = c[0]) == null ? void 0 : s.group);
      return o === "string" || o === "symbol";
    }, I = h(() => Array.isArray(a.data) ? a.data || [] : a.data[g.value] || []), w = Symbol("NO_GROUP"), O = h(() => {
      const c = I.value;
      return l(c) ? c : [{ group: w, items: c }];
    }), x = h(() => a.searchBar ? O.value.map((o) => ({
      ...o,
      items: o.items.filter((s) => a.searchFn(f.value || "", s))
    })).filter((o) => o.items.length > 0) : O.value), K = h(() => x.value.length === 0 ? !1 : x.value[0].group === w ? x.value[0].items.length > 0 : !0), L = (c) => {
      var o;
      c.id !== ((o = C.value) == null ? void 0 : o.id) && r("item-click", c);
    }, W = () => {
      r("close");
    }, F = (c) => {
      r("item-delete", c);
    }, { editingItem: C, handleEdit: j, handleEditorInputRef: J, handleKeyDown: Q } = ve(r);
    return (c, o) => (n(), u("div", ye, [
      p("div", ke, [
        (n(!0), u(T, null, $(v.value, (s) => (n(), u("div", {
          key: s.id,
          class: D(["tr-history__tab", { active: g.value === s.id }]),
          onClick: (d) => _.value = s.id
        }, k(s.title), 11, ge))), 128))
      ]),
      a.searchBar ? (n(), u("div", be, [
        m(e(le), {
          modelValue: f.value,
          "onUpdate:modelValue": o[0] || (o[0] = (s) => f.value = s),
          placeholder: a.searchPlaceholder || "搜索对话名称",
          "prefix-icon": e(se),
          clearable: ""
        }, null, 8, ["modelValue", "placeholder", "prefix-icon"])
      ])) : E("", !0),
      p("div", xe, [
        K.value ? (n(!0), u(T, { key: 0 }, $(x.value, (s) => (n(), u("div", {
          key: s.group,
          class: "tr-history__group"
        }, [
          s.group !== e(w) ? (n(), u("div", Ce, [
            p("span", null, k(s.group), 1)
          ])) : E("", !0),
          (n(!0), u(T, null, $(s.items, (d) => {
            var A;
            return n(), u("div", {
              key: `${d.id}-${d.title}`,
              class: D(["tr-history__item", { selected: a.selected === d.id }]),
              onClick: (y) => L(d)
            }, [
              ((A = e(C)) == null ? void 0 : A.id) !== d.id ? (n(), u(T, { key: 0 }, [
                p("span", Ie, k(d.title), 1),
                d.tag ? (n(), R(e(de), te({
                  key: 0,
                  class: "tr-history__item-tag",
                  ref_for: !0
                }, d.tag), null, 16)) : E("", !0),
                p("div", we, [
                  m(e(S), {
                    content: "编辑",
                    effect: "dark",
                    placement: "top",
                    "open-delay": 500
                  }, {
                    default: z(() => [
                      m(e(B), {
                        icon: e(ae),
                        onClick: H((y) => e(j)(d), ["stop"])
                      }, null, 8, ["icon", "onClick"])
                    ]),
                    _: 2
                  }, 1024),
                  m(e(S), {
                    content: "删除",
                    effect: "dark",
                    placement: "top",
                    "open-delay": 500
                  }, {
                    default: z(() => [
                      m(e(B), {
                        icon: e(ne),
                        onClick: H((y) => F(d), ["stop"])
                      }, null, 8, ["icon", "onClick"])
                    ]),
                    _: 2
                  }, 1024)
                ])
              ], 64)) : ee((n(), u("input", {
                key: 1,
                "onUpdate:modelValue": o[1] || (o[1] = (y) => e(C).title = y),
                class: "tr-history__item-edit",
                ref_for: !0,
                ref: e(J),
                onKeydown: o[2] || (o[2] = //@ts-ignore
                (...y) => e(Q) && e(Q)(...y))
              }, null, 544)), [
                [re, e(C).title]
              ])
            ], 10, Te);
          }), 128))
        ]))), 128)) : (n(), R(e(fe), {
          key: 1,
          text: f.value ? "暂无搜索结果" : "暂无内容"
        }, null, 8, ["text"]))
      ]),
      p("div", Ee, [
        m(e(B), {
          icon: e(ie),
          rounded: "",
          onClick: W
        }, null, 8, ["icon"])
      ])
    ]));
  }
}), U = /* @__PURE__ */ M($e, [["__scopeId", "data-v-8aa5fd59"]]), Be = function(i) {
  i.component("TrHistory", U);
}, Ne = {
  ...U,
  install: Be,
  name: "TrHistory"
};
export {
  Ne as default
};
