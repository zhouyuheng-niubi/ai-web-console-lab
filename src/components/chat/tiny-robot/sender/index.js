import { ref as x, watch as G, reactive as Se, computed as L, nextTick as P, defineComponent as ce, createElementBlock as D, openBlock as N, createCommentVNode as B, createBlock as H, unref as _, withCtx as j, createVNode as K, normalizeClass as Q, resolveDynamicComponent as Me, createElementVNode as M, onMounted as $e, useSlots as Ae, Transition as re, renderSlot as X, isRef as We, createTextVNode as be, toDisplayString as J, normalizeStyle as Ke, Fragment as we, renderList as _e, withModifiers as Pe } from "vue";
import { I as He } from "../index6.js";
import { B as ne } from "../index5.js";
import { T as ue } from "../index4.js";
import { i as je } from "../close.js";
import { I as qe, L as ze, u as Ue, w as Xe, P as Ge, _ as Je } from "../tiny-robot-svgs.js";
function Qe(n, b) {
  const d = x(n.modelValue || n.defaultValue || ""), t = x(null);
  G(
    () => n.modelValue,
    (g) => {
      g !== void 0 && g !== d.value && (d.value = g);
    }
  ), G(
    () => d.value,
    (g) => {
      b("update:modelValue", g);
    }
  );
  const m = (g) => {
    d.value = g, b("update:modelValue", g);
  }, s = (g) => {
    g == null || g.preventDefault();
    const S = d.value;
    !n.disabled && !n.loading && S.trim() && b("submit", S);
  }, u = () => {
    d.value = "", b("update:modelValue", ""), b("clear");
  }, o = x(!1);
  return {
    inputValue: d,
    inputWrapper: t,
    isComposing: o,
    handleChange: m,
    handleSubmit: s,
    handleClear: u,
    clearInput: () => {
      u();
    }
  };
}
function Ye(n, b, d, t, m, s, u, o, e, g, S, a, C) {
  const f = (v) => !n.disabled && !n.loading && v.trim().length > 0, r = () => {
    f(d.value) && b("submit", d.value.trim());
  }, p = (v, A) => {
    if (!(v.key === "Enter")) return !1;
    switch (A) {
      case "enter":
        return !v.shiftKey && !v.ctrlKey && !v.metaKey;
      case "ctrlEnter":
        return (v.ctrlKey || v.metaKey) && !v.shiftKey;
      case "shiftEnter":
        return v.shiftKey && !v.ctrlKey && !v.metaKey;
      default:
        return !1;
    }
  };
  return {
    handleKeyPress: (v) => {
      if (t.value) return;
      if (v.key === "Enter" && v.shiftKey && (a == null ? void 0 : a.value) === "single" && C) {
        v.preventDefault(), C();
        const k = v.target, V = k.selectionStart, l = d.value;
        d.value = l.substring(0, V) + `
` + l.substring(V), setTimeout(() => {
          k.selectionStart = k.selectionEnd = V + 1;
        }, 0);
        return;
      }
      if (v.key === "Tab" && s.value && u.value) {
        v.preventDefault(), o();
        return;
      }
      if (s.value) {
        if (v.key === "ArrowDown") {
          v.preventDefault(), g("down");
          return;
        }
        if (v.key === "ArrowUp") {
          v.preventDefault(), g("up");
          return;
        }
        if (v.key === "Enter" && u.value) {
          v.preventDefault(), o();
          return;
        }
      }
      if (v.key === "Escape") {
        s.value ? (e(), v.preventDefault()) : m.isRecording && (S(), v.preventDefault()), b("escape-press");
        return;
      }
      p(v, n.submitType) && f(d.value) && (v.preventDefault(), r());
    },
    triggerSubmit: r
  };
}
function Ze(n) {
  const b = (s, u, o) => {
    var f;
    const { startContainer: e, startOffset: g, collapsed: S } = u;
    if (!S) return !1;
    const a = e.nodeType === Node.TEXT_NODE && g === 0 && s.key === "ArrowLeft", C = e.nodeType === Node.TEXT_NODE && g === (((f = e.textContent) == null ? void 0 : f.length) || 0) && s.key === "ArrowRight";
    if (a || C) {
      let r = null, p = "inside";
      if (a)
        if (e.parentNode && e.parentNode.classList.contains("template-field"))
          r = e.parentNode, p = "before";
        else {
          let T = e.previousSibling;
          !T && e.parentNode && e.parentNode !== o && (T = e.parentNode.previousSibling), T && T.nodeType === Node.ELEMENT_NODE && T.classList.contains("template-field") && (r = T, p = "inside");
        }
      else if (C)
        if (e.parentNode && e.parentNode.classList.contains("template-field"))
          r = e.parentNode, p = "after";
        else {
          let T = e.nextSibling;
          !T && e.parentNode && e.parentNode !== o && (T = e.parentNode.nextSibling), T && T.nodeType === Node.ELEMENT_NODE && T.classList.contains("template-field") && (r = T, p = "inside");
        }
      if (r) {
        s.preventDefault();
        const T = document.createRange(), v = window.getSelection();
        return v && (p === "before" ? T.setStartBefore(r) : p === "after" ? T.setStartAfter(r) : (T.selectNodeContents(r), T.collapse(s.key === "ArrowLeft")), v.removeAllRanges(), v.addRange(T)), !0;
      }
    }
    if (e.nodeType === Node.ELEMENT_NODE && e.classList.contains("template-field") && !e.textContent) {
      s.preventDefault();
      const r = document.createRange(), p = window.getSelection();
      return p && (s.key === "ArrowLeft" ? r.setStartBefore(e) : r.setStartAfter(e), r.collapse(!0), p.removeAllRanges(), p.addRange(r)), !0;
    }
    return !1;
  }, d = (s, u, o) => {
    if (!u.collapsed) return !1;
    const { startContainer: e, startOffset: g } = u;
    if (e.nodeType === Node.TEXT_NODE && e.parentNode && e.parentNode.classList.contains("template-field") && e.textContent && e.textContent.length === 1 && g === 1) {
      s.preventDefault(), e.textContent = "";
      const C = e.parentNode, f = window.getSelection();
      if (f) {
        const r = document.createRange();
        r.selectNodeContents(C), r.collapse(!0), f.removeAllRanges(), f.addRange(r);
      }
      return n.handleInput(), !0;
    }
    if (g === 0) {
      let C = null;
      if (e.nodeType === Node.ELEMENT_NODE && e.classList.contains("template-field") ? C = e : e.nodeType === Node.TEXT_NODE && e.parentNode && e.parentNode.classList.contains("template-field") && (C = e.parentNode), C) {
        s.preventDefault();
        const f = window.getSelection();
        return f && (u.setStartBefore(C), u.collapse(!0), f.removeAllRanges(), f.addRange(u)), !0;
      }
    }
    let a = null;
    return e === o && g > 0 ? a = o.childNodes[g - 1] : e.nodeType === Node.TEXT_NODE && g === 0 && (a = e.previousSibling), a && a.nodeType === Node.ELEMENT_NODE && a.classList.contains("template-field") && a.textContent === "" ? (s.preventDefault(), a.parentNode && a.parentNode.removeChild(a), n.handleInput(), !0) : !1;
  }, t = (s, u, o) => {
    var C;
    if (!u.collapsed) return !1;
    const { startContainer: e, startOffset: g } = u;
    if (e.nodeType === Node.TEXT_NODE && e.parentNode && e.parentNode.classList.contains("template-field") && e.textContent && g === e.textContent.length && e.textContent.length === 1) {
      s.preventDefault(), e.textContent = "";
      const f = e.parentNode, r = window.getSelection();
      if (r) {
        const p = document.createRange();
        p.selectNodeContents(f), p.collapse(!0), r.removeAllRanges(), r.addRange(p);
      }
      return n.handleInput(), !0;
    }
    let a = null;
    return e === o && g < o.childNodes.length ? a = o.childNodes[g] : e.nodeType === Node.TEXT_NODE && g === (((C = e.textContent) == null ? void 0 : C.length) || 0) && (a = e.nextSibling), a && a.nodeType === Node.ELEMENT_NODE && a.classList.contains("template-field") && a.textContent === "" ? (s.preventDefault(), a.parentNode && a.parentNode.removeChild(a), n.handleInput(), !0) : !1;
  };
  return {
    handleTemplateKeyDown: (s) => {
      if (n.isComposing.value) return;
      const u = n.editor.value;
      if (!u) return;
      const o = window.getSelection();
      if (!o || o.rangeCount === 0) return;
      const e = o.getRangeAt(0);
      if (s.key === "Enter") {
        s.preventDefault(), n.onSubmit(n.getValueFromDOM());
        return;
      }
      (s.key === "ArrowLeft" || s.key === "ArrowRight") && !s.shiftKey && b(s, e, u) || s.key === "Backspace" && d(s, e, u) || s.key === "Delete" && t(s, e, u);
    }
  };
}
function et(n) {
  const b = Se({
    isRecording: !1,
    isSupported: typeof window < "u" && "webkitSpeechRecognition" in window || "SpeechRecognition" in window,
    error: void 0
  }), d = b.isSupported ? new (window.webkitSpeechRecognition || window.SpeechRecognition)() : void 0;
  d !== void 0 && (d.continuous = n.continuous ?? !1, d.interimResults = n.interimResults ?? !0, d.lang = n.lang ?? navigator.language, d.onstart = () => {
    var u;
    b.isRecording = !0, b.error = void 0, (u = n.onStart) == null || u.call(n);
  }, d.onend = () => {
    var u;
    b.isRecording = !1, (u = n.onEnd) == null || u.call(n);
  }, d.onresult = (u) => {
    var e, g;
    const o = Array.from(u.results).map((S) => S[0].transcript).join("");
    u.results[0].isFinal ? (e = n.onFinal) == null || e.call(n, o) : (g = n.onInterim) == null || g.call(n, o);
  }, d.onerror = (u) => {
    var o;
    b.error = new Error(u.error), b.isRecording = !1, (o = n.onError) == null || o.call(n, b.error);
  });
  const t = () => {
    var u;
    if (!d) {
      const o = new Error("浏览器不支持语音识别");
      b.error = o, (u = n.onError) == null || u.call(n, o);
      return;
    }
    if (b.isRecording) {
      try {
        d.stop(), setTimeout(() => {
          try {
            d.start();
          } catch (o) {
            s(o);
          }
        }, 100);
      } catch (o) {
        s(o);
      }
      return;
    }
    try {
      d.start();
    } catch (o) {
      s(o);
    }
  }, m = () => {
    if (d && b.isRecording)
      try {
        d.stop();
      } catch (u) {
        s(u);
      }
  }, s = (u) => {
    var o;
    b.error = u instanceof Error ? u : new Error("语音识别操作失败"), b.isRecording = !1, (o = n.onError) == null || o.call(n, b.error);
  };
  return {
    speechState: b,
    start: t,
    stop: m
  };
}
const tt = (n, b) => {
  if (!b || !n)
    return [{ text: n, isMatch: !1 }];
  const d = n.toLowerCase(), t = b.toLowerCase(), m = d.indexOf(t);
  if (m === -1)
    return [{ text: n, isMatch: !1 }];
  const s = [];
  return m > 0 && s.push({
    text: n.substring(0, m),
    isMatch: !1
  }), s.push({
    text: n.substring(m, m + b.length),
    isMatch: !0
  }), m + b.length < n.length && s.push({
    text: n.substring(m + b.length),
    isMatch: !1
  }), s;
};
function nt(n, b, d, t) {
  const m = x(!1), s = x(-1), u = x(""), o = x(!1), e = x(null), g = x(!1), S = L(() => {
    if (!n.suggestions || !d.value || n.template) return [];
    const k = d.value.toLowerCase();
    return n.suggestions.filter((V) => V.toLowerCase().includes(k));
  }), a = L(() => S.value[s.value] || null), C = (k) => {
    const V = k || (S.value.length > 0 ? S.value[0] : null);
    V && d.value && V.toLowerCase().startsWith(d.value.toLowerCase()) ? u.value = V.substring(d.value.length) : u.value = "";
  };
  G(d, (k) => {
    t.value || g.value || (k && n.suggestions && n.suggestions.length > 0 && !n.template ? (m.value = S.value.length > 0, m.value ? (s.value = 0, C(), o.value = !0) : (s.value = -1, u.value = "", o.value = !1)) : (m.value = !1, s.value = -1, u.value = "", o.value = !1));
  });
  const f = (k) => {
    g.value = !0, d.value = k, b("update:modelValue", k), b("suggestion-select", k), p(), P(() => {
      g.value = !1;
    });
  }, r = () => {
    a.value && f(a.value);
  }, p = () => {
    m.value = !1, o.value = !1, u.value = "", s.value = -1;
  };
  return {
    showSuggestionsPopup: m,
    highlightedIndex: s,
    completionPlaceholder: u,
    showTabHint: o,
    suggestionsListRef: e,
    filteredSuggestions: S,
    activeSuggestion: a,
    updateCompletionPlaceholder: C,
    selectSuggestion: f,
    acceptCurrentSuggestion: r,
    closeSuggestionsPopup: p,
    navigateSuggestions: (k) => {
      if (!m.value || S.value.length === 0) return;
      k === "down" ? s.value = (s.value + 1) % S.value.length : s.value = (s.value - 1 + S.value.length) % S.value.length, a.value && C(a.value);
      const V = e.value;
      if (V) {
        const l = V.children[s.value];
        l && l.scrollIntoView({ block: "nearest" });
      }
    },
    handleSuggestionItemHover: (k) => {
      s.value = k, C(S.value[k]);
    },
    handleClickOutside: () => {
      p();
    },
    highlightSuggestionText: tt
  };
}
const st = { class: "action-buttons" }, lt = {
  key: 0,
  class: "action-buttons__utility"
}, ot = { class: "action-buttons__submit-content" }, at = { class: "action-buttons__cancel" }, Ce = /* @__PURE__ */ ce({
  __name: "ActionButtons",
  props: {
    loading: { type: Boolean, default: !1 },
    disabled: { type: Boolean, default: !1 },
    showClear: { type: Boolean, default: !0 },
    hasContent: { type: Boolean, default: !1 },
    allowSpeech: { type: Boolean, default: !1 },
    speechStatus: { default: () => ({
      isRecording: !1,
      isSupported: !1
    }) },
    allowFiles: { type: Boolean, default: !1 },
    submitType: { default: "enter" },
    showShortcuts: { type: Boolean },
    isOverLimit: { type: Boolean, default: !1 }
  },
  emits: ["clear", "toggle-speech", "submit", "cancel"],
  setup(n, { emit: b }) {
    const d = je(), t = n, m = b, s = L(() => t.allowSpeech), u = L(() => t.speechStatus.isRecording), o = L(() => t.disabled), e = L(() => o.value || t.isOverLimit), g = L(() => t.allowFiles || t.allowSpeech || t.showClear), S = () => {
      o.value || m("clear");
    }, a = () => {
      if (!o.value) {
        const r = !t.speechStatus.isRecording;
        m("toggle-speech", r);
      }
    }, C = () => {
      e.value || m("submit");
    }, f = () => {
      o.value || m("cancel");
    };
    return (r, p) => (N(), D("div", st, [
      g.value ? (N(), D("div", lt, [
        r.allowFiles && !r.loading ? (N(), H(_(ue), {
          key: 0,
          content: "上传文件",
          placement: "top"
        }, {
          default: j(() => [
            K(_(ne), {
              class: "action-buttons__button action-buttons__file-button",
              type: "text",
              disabled: o.value
            }, {
              default: j(() => [
                K(_(qe), {
                  class: "action-buttons__icon",
                  alt: "上传文件"
                })
              ]),
              _: 1
            }, 8, ["disabled"])
          ]),
          _: 1
        })) : B("", !0),
        s.value && !r.loading ? (N(), H(_(ne), {
          key: 1,
          class: Q(["action-buttons__button action-buttons__speech-button", { "is-recording": u.value }]),
          type: "text",
          disabled: o.value,
          onClick: a
        }, {
          default: j(() => [
            u.value ? (N(), H(_(Ue), {
              key: 1,
              class: "action-buttons__icon action-buttons__icon--recording",
              alt: "语音中"
            })) : (N(), H(_(ze), {
              key: 0,
              class: "action-buttons__icon",
              alt: "录音"
            }))
          ]),
          _: 1
        }, 8, ["disabled", "class"])) : B("", !0),
        r.showClear ? (N(), H(_(ue), {
          key: 2,
          content: "清空内容",
          placement: "top"
        }, {
          default: j(() => [
            K(_(ne), {
              class: "action-buttons__button action-buttons__clear-button",
              type: "text",
              disabled: o.value || !r.hasContent,
              onClick: S
            }, {
              default: j(() => [
                (N(), H(Me(_(d)), { class: "action-buttons__icon action-buttons__icon--close" }))
              ]),
              _: 1
            }, 8, ["disabled"])
          ]),
          _: 1
        })) : B("", !0)
      ])) : B("", !0),
      r.hasContent || r.loading ? (N(), H(_(ne), {
        key: 1,
        type: "text",
        class: "action-buttons__button action-buttons__submit",
        disabled: r.loading ? o.value : e.value,
        onClick: p[0] || (p[0] = (T) => r.loading ? f() : C())
      }, {
        default: j(() => [
          M("div", ot, [
            r.loading ? (N(), H(_(ue), {
              key: 1,
              content: "停止生成",
              placement: "top"
            }, {
              default: j(() => [
                M("div", at, [
                  K(_(Ge), {
                    class: "action-buttons__icon action-buttons__icon--stop",
                    alt: "加载中"
                  }),
                  p[1] || (p[1] = M("span", { class: "action-buttons__cancel-text" }, "停止回答", -1))
                ])
              ]),
              _: 1
            })) : (N(), H(_(Xe), {
              key: 0,
              class: "action-buttons__icon action-buttons__icon--send",
              alt: "发送"
            }))
          ])
        ]),
        _: 1
      }, 8, ["disabled"])) : B("", !0)
    ]));
  }
});
function it(n, b) {
  const d = x(!1), t = Se({ ...b }), m = (l) => {
    Object.assign(t, l);
  }, s = (l) => {
    const c = [];
    let h = 0;
    const y = /\[(.*?)\]/g;
    let w;
    for (; (w = y.exec(l)) !== null; )
      w.index > h && c.push({ type: "text", content: l.substring(h, w.index) }), c.push({ type: "field", content: w[1] }), h = w.index + w[0].length;
    return h < l.length && c.push({ type: "text", content: l.substring(h) }), c;
  }, u = () => {
    if (!n.value) return "";
    let l = "";
    return n.value.childNodes.forEach((c) => {
      (c.nodeType === Node.TEXT_NODE || c.nodeType === Node.ELEMENT_NODE && c.classList.contains("template-field")) && (l += c.textContent || "");
    }), l;
  }, o = (l) => t.initialValues && typeof t.initialValues[l] == "string" ? t.initialValues[l] : "", e = (l, c) => {
    const h = document.createElement("span");
    return h.className = "template-field", h.setAttribute("data-placeholder", l), c && (h.textContent = c), P(() => {
      g(h, c || "");
    }), h;
  }, g = (l, c) => {
    if (!c || c.trim() === "") {
      const h = l.getAttribute("data-placeholder") || "";
      h ? S(l, h, !0) : (l.style.minWidth = "", l.style.width = "");
      return;
    }
    S(l, c, !1);
  }, S = (l, c, h) => {
    const y = document.createElement("span");
    y.className = "template-field", y.style.visibility = "hidden", y.style.position = "absolute", y.style.top = "-9999px", y.style.left = "-9999px", y.style.whiteSpace = "nowrap", y.style.padding = "3px 8px", y.style.margin = "0 2px", y.style.boxSizing = "border-box", y.textContent = c, document.body.appendChild(y);
    const w = getComputedStyle(y), F = y.offsetWidth, O = parseFloat(w.fontSize);
    document.body.removeChild(y);
    const I = h ? 1.5 : 2, W = F / O, $ = Math.max(I, Math.ceil(W));
    l.style.setProperty("min-width", `${$}em`, "important");
    const q = 20;
    $ > q ? (l.style.setProperty("max-width", `${q}em`, "important"), l.style.setProperty("white-space", "normal", "important"), l.style.setProperty("word-break", "break-word", "important")) : l.style.removeProperty("max-width");
  }, a = (l) => {
    const h = (l === void 0 ? u() : l).trim().length > 0;
    d.value !== h && (d.value = h, t.onContentStatusChange(h));
  }, C = (l, c = "inside", h = !1) => {
    P(() => {
      const y = window.getSelection();
      if (!y) return;
      const w = document.createRange();
      switch (c) {
        case "before":
          w.setStartBefore(l);
          break;
        case "after":
          w.setStartAfter(l);
          break;
        case "inside":
        default:
          w.selectNodeContents(l), w.collapse(h);
          break;
      }
      y.removeAllRanges(), y.addRange(w), l.focus && l.focus();
    });
  }, f = () => {
    P(() => {
      const l = n.value;
      if (l) {
        const c = document.createRange(), h = window.getSelection();
        c.selectNodeContents(l), c.collapse(!1), h && (h.removeAllRanges(), h.addRange(c)), l.focus();
      }
    });
  }, r = (l, c) => {
    const h = n.value;
    if (!h) return null;
    h.innerHTML = "";
    let y = null;
    if (!c || c === t.template)
      l.forEach((w) => {
        if (w.type === "field") {
          const F = o(w.content), O = e(w.content, F);
          h.appendChild(O), y || (y = O);
        } else
          h.appendChild(document.createTextNode(w.content));
      }), t.initialValues && Object.keys(t.initialValues).length > 0 && P(() => {
        const w = u();
        w !== t.value && (t.onValueChange(w), t.onInput(w));
      });
    else {
      const w = p(l, c);
      w.success ? w.elements.forEach((F) => {
        h.appendChild(F.node), F.isField && !y && (y = F.node);
      }) : (h.appendChild(document.createTextNode(c)), y = null);
    }
    return y;
  }, p = (l, c) => {
    const h = [];
    let y = 0, w = 0, F = !0;
    for (; w < l.length && y <= c.length && F; ) {
      const O = l[w];
      if (O.type === "text")
        c.substring(y).startsWith(O.content) ? (h.push({
          node: document.createTextNode(O.content),
          isField: !1
        }), y += O.content.length, w++) : F = !1;
      else {
        let I = "";
        const W = l.find(($, q) => q > w && $.type === "text");
        if (W) {
          const $ = c.substring(y), q = $.indexOf(W.content);
          q !== -1 ? (I = $.substring(0, q), y += I.length) : F = !1;
        } else
          I = c.substring(y), y = c.length;
        if (F) {
          const $ = e(O.content, I);
          h.push({ node: $, isField: !0 }), w++;
        }
      }
    }
    if (F && w < l.length)
      for (let O = w; O < l.length; O++) {
        const I = l[O];
        if (I.type === "field") {
          const W = !t.value || t.value === "" ? o(I.content) : "", $ = e(I.content, W);
          h.push({ node: $, isField: !0 });
        } else
          h.push({
            node: document.createTextNode(I.content),
            isField: !1
          });
      }
    return { success: F, elements: h };
  }, T = () => {
    if (!n.value) return;
    t.isInternalUpdate = !0;
    const l = s(t.template), c = r(l, t.value);
    a(), P(() => {
      A(), c && c.textContent ? C(c, "inside", !1) : c ? C(c, "inside", !0) : f(), t.isInternalUpdate = !1;
    });
  }, v = () => {
    if (t.isInternalUpdate || t.isComposing) return;
    A();
    const l = u();
    l !== t.value && (t.onValueChange(l), t.onInput(l)), a(l);
  }, A = () => {
    if (!n.value) return;
    n.value.querySelectorAll(".template-field").forEach((c) => {
      const h = c.textContent || "";
      g(c, h);
    });
  };
  return {
    // 状态
    hasContent: d,
    // 解析和DOM操作
    parseTemplateToParts: s,
    getValueFromDOM: u,
    getInitialContentForField: o,
    createFieldElement: e,
    // 光标操作
    setCursorTo: C,
    setCursorToEnd: f,
    // DOM更新
    updateEditorDOM: T,
    renderTemplateToDOM: r,
    // 事件处理
    handleInput: v,
    checkHasContent: a,
    // 方法
    resetFields: () => {
      if (!n.value) return;
      t.isInternalUpdate = !0;
      const l = n.value;
      l.innerHTML = "";
      const c = s(t.template);
      let h = "";
      c.forEach((y) => {
        if (y.type === "field") {
          const w = o(y.content), F = e(y.content, w);
          w && (h += w), l.appendChild(F);
        } else
          l.appendChild(document.createTextNode(y.content)), h += y.content;
      }), t.onValueChange(h), f(), a(h), P(() => {
        t.isInternalUpdate = !1;
      });
    },
    activateFirstField: () => {
      var c;
      const l = (c = n.value) == null ? void 0 : c.querySelector(".template-field");
      l ? C(l, "inside", !1) : f();
    },
    // 选项更新
    updateOptions: m
  };
}
const rt = /* @__PURE__ */ ce({
  __name: "TemplateEditor",
  props: {
    template: {},
    value: {},
    autofocus: { type: Boolean },
    initialValues: {}
  },
  emits: ["update:value", "input", "content-status", "submit", "focus", "blur"],
  setup(n, { expose: b, emit: d }) {
    const t = n, m = d, s = x(null), u = x(!1), o = x(!1), e = it(s, {
      template: t.template,
      value: t.value,
      initialValues: t.initialValues,
      isInternalUpdate: u,
      isComposing: o,
      onValueChange: (f) => m("update:value", f),
      onInput: (f) => m("input", f),
      onContentStatusChange: (f) => m("content-status", f),
      onSubmit: (f) => m("submit", f)
    }), g = Ze({
      editor: s,
      isComposing: o,
      getValueFromDOM: e.getValueFromDOM,
      handleInput: e.handleInput,
      onSubmit: (f) => m("submit", f)
    }), S = () => {
      o.value = !0;
    }, a = () => {
      o.value = !1, e.handleInput();
    }, C = (f) => {
      var T;
      if (!s.value) return;
      const r = f.target;
      let p = null;
      if (r.classList.contains("template-field") ? p = r : (T = r.parentElement) != null && T.classList.contains("template-field") && (p = r.parentElement), p && (!p.textContent || p.textContent.trim() === "")) {
        const v = window.getSelection(), A = document.createRange();
        v && (A.selectNodeContents(p), A.collapse(!0), v.removeAllRanges(), v.addRange(A), p.focus(), f.preventDefault(), f.stopPropagation());
      }
    };
    return $e(() => {
      e.updateEditorDOM(), t.autofocus && s.value && e.setCursorToEnd();
    }), G(
      () => t.template,
      () => {
        u.value || (e.updateOptions({
          template: t.template,
          value: t.value,
          initialValues: t.initialValues
        }), e.updateEditorDOM());
      }
    ), G(
      () => t.value,
      (f) => {
        !u.value && f !== e.getValueFromDOM() && (e.updateOptions({
          template: t.template,
          value: f,
          initialValues: t.initialValues
        }), e.updateEditorDOM());
      },
      { deep: !1 }
    ), b({
      focus: () => {
        var f;
        (f = s.value) == null || f.focus(), e.setCursorToEnd();
      },
      resetFields: e.resetFields,
      activateFirstField: e.activateFirstField
    }), (f, r) => (N(), D("div", {
      class: "template-editor",
      ref_key: "contentEditableRef",
      ref: s,
      contenteditable: "true",
      onInput: r[0] || (r[0] = //@ts-ignore
      (...p) => _(e).handleInput && _(e).handleInput(...p)),
      onKeydown: r[1] || (r[1] = //@ts-ignore
      (...p) => _(g).handleTemplateKeyDown && _(g).handleTemplateKeyDown(...p)),
      onClick: C,
      onCompositionstart: S,
      onCompositionend: a,
      onFocus: r[2] || (r[2] = (p) => f.$emit("focus", p)),
      onBlur: r[3] || (r[3] = (p) => f.$emit("blur", p))
    }, null, 544));
  }
}), ut = ["data-theme"], ct = { class: "tiny-sender__container" }, dt = {
  key: 0,
  class: "tiny-sender__header-slot"
}, ft = {
  key: 0,
  class: "tiny-sender__prefix-slot"
}, pt = { class: "tiny-sender__content-area" }, ht = {
  key: 0,
  class: "tiny-sender__decorative-content"
}, mt = {
  key: 2,
  class: "tiny-sender__input-field-wrapper"
}, gt = {
  key: 0,
  class: "tiny-sender__completion-placeholder"
}, vt = { class: "user-input-mirror" }, yt = {
  key: 0,
  class: "tiny-sender__tab-hint"
}, bt = {
  key: 1,
  class: "tiny-sender__actions-slot"
}, wt = { class: "tiny-sender__footer-left" }, _t = { class: "tiny-sender__footer-right" }, Ct = { class: "real-word-length" }, St = {
  key: 1,
  class: "tiny-sender__toolbar"
}, Et = { class: "tiny-sender__buttons-container" }, Nt = {
  key: 1,
  class: "tiny-sender__footer-slot"
}, Tt = ["onMouseenter", "onMousedown"], kt = { class: "suggestion-item__icon" }, Rt = { class: "suggestion-item__text" }, It = {
  key: 0,
  class: "tiny-sender__error"
}, se = /* @__PURE__ */ ce({
  __name: "index",
  props: {
    autofocus: { type: Boolean, default: !1 },
    autoSize: { type: [Boolean, Object], default: () => ({ minRows: 1, maxRows: 3 }) },
    allowSpeech: { type: Boolean, default: !0 },
    allowFiles: { type: Boolean, default: !1 },
    clearable: { type: Boolean, default: !1 },
    disabled: { type: Boolean, default: !1 },
    defaultValue: {},
    loading: { type: Boolean, default: !1 },
    modelValue: { default: "" },
    mode: { default: "single" },
    maxLength: { default: 1 / 0 },
    submitType: { default: "enter" },
    speech: { type: [Boolean, Object] },
    placeholder: { default: "请输入内容..." },
    showWordLimit: { type: Boolean, default: !1 },
    suggestions: { default: () => [] },
    theme: { default: "light" },
    template: { default: "" },
    hasContent: { type: Boolean, default: void 0 },
    templateInitialValues: { default: () => ({}) }
  },
  emits: ["update:modelValue", "submit", "clear", "speech-start", "speech-end", "speech-interim", "speech-error", "suggestion-select", "focus", "blur", "escape-press", "cancel", "reset-template"],
  setup(n, { expose: b, emit: d }) {
    const t = n, m = d, s = x(null), u = x(null), o = x(null), e = x(null), g = x(null), S = L(() => !!t.template), { inputValue: a, isComposing: C, clearInput: f } = Qe(t, m), {
      showSuggestionsPopup: r,
      highlightedIndex: p,
      completionPlaceholder: T,
      showTabHint: v,
      suggestionsListRef: A,
      filteredSuggestions: k,
      activeSuggestion: V,
      updateCompletionPlaceholder: l,
      selectSuggestion: c,
      acceptCurrentSuggestion: h,
      closeSuggestionsPopup: y,
      navigateSuggestions: w,
      handleSuggestionItemHover: F,
      highlightSuggestionText: O
    } = nt(t, m, a, C), I = x(t.mode), W = x(!1), $ = () => {
      I.value === "single" && (I.value = "multiple", P(() => {
        setTimeout(() => {
          const i = document.querySelector(".tiny-textarea__inner");
          if (i) {
            i.style.whiteSpace = "pre-wrap";
            const E = a.value.length;
            i.focus(), i.setSelectionRange(E, E);
          }
        }, 50);
      }));
    }, q = (i, E) => {
      const R = document.createElement("span");
      R.style.visibility = "hidden", R.style.position = "absolute", R.style.whiteSpace = "nowrap", R.style.font = E, R.textContent = i, document.body.appendChild(R);
      const z = R.offsetWidth;
      return document.body.removeChild(R), z;
    }, Ee = () => {
      if (t.mode !== "single" || !s.value || W.value) return;
      const E = document.querySelector(".tiny-sender__content-area").querySelector(".tiny-input__inner"), R = g.value || document.querySelector(".tiny-sender__buttons-container");
      if (!E) return;
      const z = window.getComputedStyle(E).font, U = q(a.value, z), Be = E.offsetWidth - ((R == null ? void 0 : R.offsetWidth) || 0) - 20;
      U > Be && I.value === "single" && (W.value = !0, I.value = "multiple", P(() => {
        s.value ? setTimeout(() => {
          const te = document.querySelector(".tiny-textarea__inner");
          if (te) {
            te.style.whiteSpace = "pre-wrap";
            const ye = a.value.length;
            te.focus(), te.setSelectionRange(ye, ye);
          }
          W.value = !1;
        }, 300) : W.value = !1;
      }));
    }, le = () => {
      f(), t.template && m("reset-template"), P(() => {
        a.value === "" && (I.value = t.mode || "single");
      }), y();
    }, de = (i) => {
      a.value = i, m("update:modelValue", i);
    }, fe = () => {
      o.value && o.value.activateFirstField();
    }, Ne = L(() => {
      const i = typeof t.speech == "object" ? t.speech : {};
      return {
        ...i,
        onStart: () => m("speech-start"),
        onEnd: (E) => m("speech-end", E),
        onInterim: (E) => m("speech-interim", E),
        onFinal: (E) => {
          if (i.autoReplace)
            a.value = E;
          else {
            const R = a.value;
            R && E && !R.endsWith(" ") && !E.startsWith(" ") && R.length > 0 ? a.value = R + " " + E : a.value = R + E;
          }
          m("speech-end", E);
        },
        onError: (E) => {
          Ve(E.message), m("speech-error", E);
        }
      };
    }), { speechState: Z, start: pe, stop: he } = et(Ne.value), oe = () => {
      Z.isRecording ? he() : pe();
    }, { handleKeyPress: Te, triggerSubmit: ae } = Ye(
      t,
      m,
      a,
      C,
      Z,
      r,
      V,
      h,
      y,
      w,
      oe,
      I,
      $
    ), ke = (i) => {
      m("focus", i), a.value && k.value.length > 0 && !t.template && (r.value = !0, v.value = !0, p.value === -1 && (p.value = 0), l(V.value || k.value[0]));
    }, Re = (i) => {
      m("blur", i);
    }, Ie = L(() => I.value === "multiple" ? "textarea" : "text"), De = L(
      () => ({
        display: "flex",
        justifyContent: t.showWordLimit && t.maxLength !== 1 / 0 ? "space-between" : "flex-end",
        alignItems: "center"
      })
    ), xe = Ae(), Fe = L(() => !!xe.decorativeContent), ee = L(() => t.disabled || Fe.value), me = L(() => t.loading), ge = L(() => t.hasContent !== void 0 ? t.hasContent : !!a.value), Le = L(() => ({
      "is-disabled": ee.value,
      "is-loading": me.value,
      "has-error": !!Y.value,
      "is-auto-switching": W.value
    })), Y = x(""), Ve = (i) => {
      Y.value = i, setTimeout(() => Y.value = "", 5e3);
    }, Oe = () => {
      C.value = !1, setTimeout(() => {
        C.value = !1, a.value && t.suggestions && t.suggestions.length > 0 && !t.template && (r.value = k.value.length > 0, r.value && (p.value = 0, l(), v.value = !0));
      }, 50);
    }, ie = L(() => t.maxLength !== 1 / 0 && a.value.length > t.maxLength);
    return G(a, () => {
      P(Ee), a.value === "" && t.mode === "single" && (I.value = "single");
    }), G(
      () => S.value,
      (i) => {
        i && (I.value = "multiple");
      }
    ), b({
      focus: () => {
        if (S.value && o.value)
          fe();
        else if (s.value)
          s.value.focus();
        else {
          const i = document.querySelector(".tiny-input__inner");
          i == null || i.focus();
        }
      },
      blur: () => {
        if (s.value)
          s.value.blur();
        else {
          const i = document.querySelector(".tiny-input__inner");
          i == null || i.blur();
        }
      },
      clear: le,
      submit: ae,
      startSpeech: pe,
      stopSpeech: he,
      activateTemplateFirstField: fe
    }), (i, E) => (N(), D("div", {
      ref_key: "senderRef",
      ref: u,
      class: Q(["tiny-sender", [Le.value, `theme-${i.theme}`, `mode-${I.value}`]]),
      "data-theme": i.theme
    }, [
      M("div", ct, [
        M("div", {
          class: "tiny-sender__input-wrapper",
          ref_key: "inputWrapperRef",
          ref: e
        }, [
          K(re, { name: "tiny-sender-slide-down" }, {
            default: j(() => [
              i.$slots.header ? (N(), D("div", dt, [
                X(i.$slots, "header")
              ])) : B("", !0)
            ]),
            _: 3
          }),
          M("div", {
            class: Q(["tiny-sender__input-row", { "has-prefix": i.$slots.prefix, "has-header": i.$slots.header }])
          }, [
            i.$slots.prefix ? (N(), D("div", ft, [
              X(i.$slots, "prefix")
            ])) : B("", !0),
            M("div", pt, [
              i.$slots.decorativeContent ? (N(), D("div", ht, [
                X(i.$slots, "decorativeContent")
              ])) : B("", !0),
              S.value ? (N(), H(rt, {
                key: 1,
                ref_key: "templateEditorRef",
                ref: o,
                template: i.template,
                value: _(a),
                initialValues: i.templateInitialValues,
                "onUpdate:value": de,
                onInput: de
              }, null, 8, ["template", "value", "initialValues"])) : (N(), D("div", mt, [
                K(_(He), {
                  ref_key: "inputRef",
                  ref: s,
                  autosize: i.autoSize,
                  type: Ie.value,
                  readonly: me.value,
                  resize: "none",
                  modelValue: _(a),
                  "onUpdate:modelValue": E[0] || (E[0] = (R) => We(a) ? a.value = R : null),
                  disabled: ee.value,
                  placeholder: i.placeholder,
                  autofocus: i.autofocus,
                  onKeydown: _(Te),
                  onCompositionstart: E[1] || (E[1] = (R) => C.value = !0),
                  onCompositionend: Oe,
                  onFocus: ke,
                  onBlur: Re
                }, null, 8, ["autosize", "type", "readonly", "modelValue", "disabled", "placeholder", "autofocus", "onKeydown"]),
                _(T) && !_(C) ? (N(), D("div", gt, [
                  M("span", vt, J(_(a)), 1),
                  be(J(_(T)) + " ", 1),
                  _(v) ? (N(), D("div", yt, "TAB")) : B("", !0)
                ])) : B("", !0)
              ]))
            ]),
            I.value === "single" ? (N(), D("div", bt, [
              M("div", {
                class: "tiny-sender__buttons-container",
                ref_key: "buttonsContainerRef",
                ref: g
              }, [
                X(i.$slots, "actions"),
                K(Ce, {
                  "allow-speech": i.allowSpeech,
                  "allow-files": i.allowFiles,
                  loading: i.loading,
                  disabled: ee.value,
                  "show-clear": i.clearable,
                  "has-content": ge.value,
                  "speech-status": _(Z),
                  "submit-type": i.submitType,
                  "is-over-limit": ie.value,
                  onClear: le,
                  onToggleSpeech: oe,
                  onSubmit: _(ae),
                  onCancel: E[2] || (E[2] = (R) => i.$emit("cancel"))
                }, null, 8, ["allow-speech", "allow-files", "loading", "disabled", "show-clear", "has-content", "speech-status", "submit-type", "is-over-limit", "onSubmit"])
              ], 512)
            ])) : B("", !0)
          ], 2),
          K(re, { name: "tiny-sender-slide-up" }, {
            default: j(() => [
              I.value === "multiple" ? (N(), D("div", {
                key: 0,
                style: Ke(De.value),
                class: "tiny-sender__footer-slot tiny-sender__bottom-row"
              }, [
                M("div", wt, [
                  X(i.$slots, "footer-left")
                ]),
                M("div", _t, [
                  X(i.$slots, "footer-right"),
                  i.showWordLimit && i.maxLength !== 1 / 0 ? (N(), D("div", {
                    key: 0,
                    class: Q(["tiny-sender__word-limit", { "is-over-limit": ie.value }])
                  }, [
                    M("span", Ct, J(_(a).length), 1),
                    be("/" + J(i.maxLength), 1)
                  ], 2)) : B("", !0),
                  I.value === "multiple" ? (N(), D("div", St, [
                    M("div", Et, [
                      K(Ce, {
                        "allow-speech": i.allowSpeech,
                        "allow-files": i.allowFiles,
                        loading: i.loading,
                        disabled: ee.value,
                        "show-clear": i.clearable,
                        "has-content": ge.value,
                        "speech-status": _(Z),
                        "submit-type": i.submitType,
                        "is-over-limit": ie.value,
                        onClear: le,
                        onToggleSpeech: oe,
                        onSubmit: _(ae),
                        onCancel: E[3] || (E[3] = (R) => i.$emit("cancel"))
                      }, null, 8, ["allow-speech", "allow-files", "loading", "disabled", "show-clear", "has-content", "speech-status", "submit-type", "is-over-limit", "onSubmit"])
                    ])
                  ])) : B("", !0)
                ])
              ], 4)) : i.$slots.footer ? (N(), D("div", Nt, [
                X(i.$slots, "footer")
              ])) : B("", !0)
            ]),
            _: 3
          })
        ], 512)
      ]),
      K(re, { name: "tiny-sender-slide-up" }, {
        default: j(() => [
          _(r) && _(k).length ? (N(), D("div", {
            key: 0,
            ref_key: "suggestionsListRef",
            ref: A,
            class: "tiny-sender__suggestions"
          }, [
            (N(!0), D(we, null, _e(_(k), (R, z) => (N(), D("div", {
              key: z,
              class: Q(["suggestion-item", { highlighted: z === _(p) }]),
              onMouseenter: (U) => _(F)(z),
              onMousedown: Pe((U) => _(c)(R), ["prevent"])
            }, [
              M("span", kt, [
                K(_(Je))
              ]),
              M("span", Rt, [
                (N(!0), D(we, null, _e(_(O)(R, _(a)), (U, ve) => (N(), D("span", {
                  key: ve,
                  class: Q({ "suggestion-item__text--match": U.isMatch, "suggestion-item__text--normal": !U.isMatch })
                }, J(U.text), 3))), 128))
              ])
            ], 42, Tt))), 128))
          ], 512)) : B("", !0)
        ]),
        _: 1
      }),
      Y.value ? (N(), D("div", It, J(Y.value), 1)) : B("", !0)
    ], 10, ut));
  }
});
se.name = "TrSender";
const Dt = function(n) {
  n.component(se.name, se);
};
se.install = Dt;
export {
  se as default
};
