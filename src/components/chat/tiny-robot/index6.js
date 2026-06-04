import { s as oe, o as ot, a as I, b as D, d as nt, c as R, r as J, i as je, t as rt, e as Ue, g as lt, f as U, h as it, j as ce, k as st, l as at, m as pe, $ as j, p as ut, n as pt, q as de, u as Te, v as dt, w as ft, x as Je, B as ct, y as mt } from "./index5.js";
import * as xe from "vue";
import { createElementBlock as b, openBlock as h, createElementVNode as _, withDirectives as ue, createVNode as H, vShow as ve, resolveComponent as z, createBlock as k, Transition as we, withCtx as F, withModifiers as Se, normalizeClass as te, createCommentVNode as O, normalizeStyle as ht, renderSlot as L, toDisplayString as x, resolveDirective as yt, mergeProps as me, Fragment as Ce, resolveDynamicComponent as Y, createTextVNode as De, withKeys as gt, renderList as bt } from "vue";
var vt = Object.defineProperty, wt = Object.defineProperties, St = Object.getOwnPropertyDescriptors, ke = Object.getOwnPropertySymbols, Ct = Object.prototype.hasOwnProperty, Ot = Object.prototype.propertyIsEnumerable, Pe = (e, t, o) => t in e ? vt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: o }) : e[t] = o, V = (e, t) => {
  for (var o in t || (t = {}))
    Ct.call(t, o) && Pe(e, o, t[o]);
  if (ke)
    for (var o of ke(t))
      Ot.call(t, o) && Pe(e, o, t[o]);
  return e;
}, Ge = (e, t) => wt(e, St(t));
const ie = {
  Escape: 27,
  ArrowUp: 38,
  ArrowDown: 40,
  NumpadEnter: 13
};
var _t = {
  viewBox: "0 0 16 16",
  xmlns: "http://www.w3.org/2000/svg"
}, Mt = /* @__PURE__ */ _(
  "path",
  {
    d: "M12.49 3.3a.5.5 0 0 1 .05.62L8.58 7.89l3.91 3.88c.21.19.23.48.05.71-.17.19-.49.24-.71.06L7.88 8.58 4 12.49c-.18.17-.5.18-.68.01a.496.496 0 0 1-.08-.67l3.93-3.94L3.29 4a.524.524 0 0 1 .04-.71c.17-.14.42-.16.58-.05l3.97 3.93 3.9-3.87c.18-.22.51-.22.71 0Z",
    "fill-rule": "evenodd"
  },
  null,
  -1
  /* HOISTED */
), Et = [Mt];
function Bt(e, t) {
  return h(), b("svg", _t, [].concat(Et));
}
var It = {
  render: Bt
}, Ke = function() {
  return oe({
    name: "IconClose",
    component: It
  })();
}, Tt = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 16 16",
  style: {
    "enable-background": "new 0 0 16 16"
  },
  "xml:space": "preserve"
}, $t = /* @__PURE__ */ _(
  "rect",
  {
    style: {
      fill: "none"
    }
  },
  null,
  -1
  /* HOISTED */
), xt = /* @__PURE__ */ _(
  "path",
  {
    d: "m3.49 5.21.72.72-.23.18c-.16.13-.3.27-.46.4l-.25.23c-.39.39-.75.79-1.05 1.2L2.16 8l-.05.06-.17.24.28.38.19.24c.33.4.7.8 1.1 1.19l.18.16c1.32 1.18 2.78 1.87 4.32 1.87h.23c.61-.02 1.21-.17 1.78-.4l.76.76-.22.1c-.81.35-1.67.55-2.56.55h-.22c-1.81-.06-3.47-.92-4.95-2.29l-.27-.25c-.42-.42-.81-.86-1.15-1.3l-.04-.09-.05-.06-.17-.24-.14-.19-.1-.16-.04-.07a.5.5 0 0 1 0-.38l.04-.08.1-.16.13-.19.17-.24.1-.13.21-.27c.35-.44.76-.87 1.2-1.28.22-.19.44-.39.67-.56zm.27-2.35h.07c.1.01.19.06.28.15l1.12 1.12c.88-.42 1.8-.65 2.77-.65h.23c1.81.06 3.47.92 4.95 2.29l.27.25c.42.42.81.86 1.15 1.3l.05.07.05.06.17.24.13.19.1.16.04.07c.05.12.05.25.01.38l-.05.09-.1.16-.13.19-.17.25-.1.13-.2.27c-.35.44-.76.87-1.2 1.28l-.24.22c-.13.12-.28.24-.42.35l.79.79.05.06c.15.19.13.47-.05.65l-.06.05c-.19.15-.47.13-.65-.05l-.94-.93-.73-.73-1.33-1.33-.21-.22-6-6.01-.05-.06c-.15-.2-.14-.47.05-.66a.52.52 0 0 1 .35-.13zM5.3 7.02l.78.78-.03.12c-.03.13-.04.25-.04.38v.12c.05 1.06.92 1.88 1.99 1.88h.13c.13-.01.25-.04.39-.06l.78.78-.15.06c-.35.15-.74.23-1.14.23h-.14a2.993 2.993 0 0 1-2.86-2.99c-.02-.48.09-.91.29-1.3zM8 4.47h-.22c-.62.03-1.21.16-1.79.4l.73.73c.39-.18.82-.29 1.3-.29h.15c1.59.07 2.86 1.38 2.86 2.99v.17c-.02.4-.12.79-.29 1.13l1.09 1.09c.23-.18.46-.38.69-.59l.24-.23c.39-.39.75-.79 1.05-1.2l.05-.06.05-.06.18-.25-.28-.38-.19-.24c-.33-.4-.7-.8-1.1-1.19l-.18-.16C10.98 5.16 9.54 4.47 8 4.47zM8 6.3h-.13c-.14.02-.26.03-.38.06l2.45 2.45c.05-.17.07-.34.07-.52v-.12A2.02 2.02 0 0 0 8 6.3z"
  },
  null,
  -1
  /* HOISTED */
), Dt = [$t, xt];
function kt(e, t) {
  return h(), b("svg", Tt, [].concat(Dt));
}
var Pt = {
  render: kt
}, Vt = function() {
  return oe({
    name: "IconEyeclose",
    component: Pt
  })();
}, At = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 16 16",
  style: {
    "enable-background": "new 0 0 16 16"
  },
  "xml:space": "preserve"
}, Lt = /* @__PURE__ */ _(
  "rect",
  {
    style: {
      fill: "none"
    }
  },
  null,
  -1
  /* HOISTED */
), Nt = /* @__PURE__ */ _(
  "path",
  {
    class: "eyeopen_svg__st1",
    d: "M8 3.16c1.89 0 3.63.87 5.17 2.3.53.5 1 1.02 1.41 1.55.03.05.07.09.1.14l.17.23.14.2.1.15c.1.16.1.37 0 .53l-.1.15-.14.2-.17.23-.1.14c-.41.52-.88 1.05-1.41 1.55-1.54 1.43-3.28 2.3-5.17 2.3-1.9 0-3.64-.87-5.18-2.3-.53-.5-1-1.03-1.41-1.55-.03-.05-.07-.09-.1-.14l-.17-.23-.14-.2-.1-.15c-.1-.16-.1-.37 0-.53l.1-.15.14-.2.17-.23.1-.14c.41-.53.88-1.05 1.41-1.55C4.36 4.03 6.1 3.16 8 3.16zm0 1c-1.61 0-3.12.76-4.5 2.03-.49.46-.92.95-1.3 1.43l-.09.12-.18.25.27.38c.38.48.81.97 1.3 1.42 1.38 1.28 2.89 2.04 4.5 2.04 1.6 0 3.11-.76 4.49-2.04.49-.45.92-.94 1.3-1.42l.09-.12.18-.26-.27-.37c-.38-.48-.81-.97-1.3-1.43C11.11 4.92 9.6 4.16 8 4.16zM8 5c1.65 0 3 1.34 3 3 0 1.65-1.35 3-3 3-1.66 0-3-1.35-3-3 0-1.66 1.34-3 3-3zm0 1c-1.11 0-2 .89-2 2a2 2 0 1 0 2-2z"
  },
  null,
  -1
  /* HOISTED */
), Ft = [Lt, Nt];
function zt(e, t) {
  return h(), b("svg", At, [].concat(Ft));
}
var Ht = {
  render: zt
}, Wt = function() {
  return oe({
    name: "IconEyeopen",
    component: Ht
  })();
}, Rt = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  "xml:space": "preserve"
}, jt = /* @__PURE__ */ _(
  "path",
  {
    class: "fullscreen_svg__st0",
    d: "M8 3H4.5l5.2 5.3c.4.4.4 1 0 1.4-.4.4-1 .4-1.4 0L3 4.3V8c0 .6-.4 1-1 1s-1-.4-1-1V2c0-.6.4-1 1-1h6c.5 0 1 .4 1 1s-.4 1-1 1zM8 21H4.5l5.2-5.3c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0L3 19.7V16c0-.6-.4-1-1-1s-1 .4-1 1v6c0 .6.4 1 1 1h6c.5 0 1-.4 1-1s-.4-1-1-1zM16 3h3.5l-5.2 5.3c-.4.4-.4 1 0 1.4.4.4 1 .4 1.4 0L21 4.3V8c0 .6.4 1 1 1s1-.4 1-1V2c0-.6-.4-1-1-1h-6c-.5 0-1 .4-1 1s.4 1 1 1zM16 21h3.5l-5.2-5.3c-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0l5.3 5.4V16c0-.6.4-1 1-1s1 .4 1 1v6c0 .6-.4 1-1 1h-6c-.5 0-1-.4-1-1s.4-1 1-1z"
  },
  null,
  -1
  /* HOISTED */
), Ut = [jt];
function Jt(e, t) {
  return h(), b("svg", Rt, [].concat(Ut));
}
var Gt = {
  render: Jt
}, Kt = function() {
  return oe({
    name: "IconFullscreen",
    component: Gt
  })();
}, Yt = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  "xml:space": "preserve"
}, Xt = /* @__PURE__ */ _(
  "path",
  {
    class: "minscreen_svg__st0",
    d: "M3 8h3.5L1.3 2.7c-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0L8 6.7V3c0-.6.4-1 1-1s1 .4 1 1v6c0 .6-.4 1-1 1H3c-.5 0-1-.4-1-1s.4-1 1-1zM3 16h3.5l-5.2 5.3c-.4.4-.4 1 0 1.4.4.4 1 .4 1.4 0L8 17.3V21c0 .6.4 1 1 1s1-.4 1-1v-6c0-.6-.4-1-1-1H3c-.5 0-1 .4-1 1s.4 1 1 1zM21 8h-3.5l5.2-5.3c.4-.4.4-1 0-1.4s-1-.4-1.4 0L16 6.7V3c0-.6-.4-1-1-1s-1 .4-1 1v6c0 .6.4 1 1 1h6c.5 0 1-.4 1-1s-.4-1-1-1zM21 16h-3.5l5.2 5.3c.4.4.4 1 0 1.4-.4.4-1 .4-1.4 0L16 17.3V21c0 .6-.4 1-1 1s-1-.4-1-1v-6c0-.6.4-1 1-1h6c.5 0 1 .4 1 1s-.4 1-1 1z"
  },
  null,
  -1
  /* HOISTED */
), Zt = [Xt];
function qt(e, t) {
  return h(), b("svg", Yt, [].concat(Zt));
}
var Qt = {
  render: qt
}, eo = function() {
  return oe({
    name: "IconMinscreen",
    component: Qt
  })();
};
const to = `
height:0 !important;visibility:hidden !important;overflow:hidden !important;
position:absolute !important;z-index:-1000 !important;top:0 !important;right:0 !important
`, oo = [
  "width",
  "line-height",
  "padding-top",
  "padding-bottom",
  "padding-left",
  "padding-right",
  "border-width",
  "box-sizing",
  "letter-spacing",
  "font-family",
  "font-weight",
  "font-size",
  "text-rendering",
  "text-transform",
  "text-indent"
], N = {
  BoxSizing: "box-sizing",
  BorderBox: "border-box",
  ContentBox: "content-box",
  PaddingTop: "padding-top",
  PaddingBottom: "padding-bottom",
  BorderTopWidth: "border-top-width",
  BorderBottomWidth: "border-bottom-width"
}, no = typeof window > "u", ro = (e) => /([(\uAC00-\uD7AF)|(\u3130-\u318F)])+/gi.test(e), lo = (e) => () => {
  if (e.inputDisabled)
    return !1;
  e.boxVisibility = !0;
}, io = ({ props: e }) => () => ({
  textAlign: e.textAlign
}), so = () => (e) => {
  const t = window.getComputedStyle(e), o = t.getPropertyValue(N.BoxSizing), n = parseFloat(t.getPropertyValue(N.PaddingBottom)) + parseFloat(t.getPropertyValue(N.PaddingTop)), r = parseFloat(t.getPropertyValue(N.BorderBottomWidth)) + parseFloat(t.getPropertyValue(N.BorderTopWidth));
  return { contextStyle: oo.map((l) => `${l}:${t.getPropertyValue(l)}`).join(";"), paddingSize: n, borderSize: r, boxSizing: o };
}, ao = ({
  api: e,
  hiddenTextarea: t,
  props: o,
  state: n,
  mode: r,
  constants: i
}) => (l, a = 1, s = null) => {
  if (!l)
    return {
      minHeight: "",
      height: ""
    };
  t || (t = document.createElement("textarea"), document.body.appendChild(t));
  const { paddingSize: u, borderSize: f, boxSizing: c, contextStyle: p } = e.calculateNodeStyling(l);
  t.setAttribute("style", `${p};${to}`), t.value = l.value || l.placeholder || "";
  let d = t.scrollHeight;
  const m = {};
  r === "mobile" && (d = Math.max(t.scrollHeight, i.TEXTAREA_HEIGHT_MOBILE)), c === N.BorderBox ? d = d + f * 2 + u : c === N.ContentBox && (d = d - u), t.value = "";
  const v = t.scrollHeight - u;
  if (a !== null) {
    let y = v * a;
    c === N.BorderBox && (y = y + u + f), o.size && (y = o.size === "mini" ? y * 0.67 : o.size === "small" ? y : y * 1.17), o.height && (y = o.height), n.isDisplayOnly ? m.minHeight = "0px" : (d = Math.max(y, d), m.minHeight = `${y}px`);
  }
  if (s !== null) {
    let y = v * s;
    c === N.BorderBox && (y += f + u), d = Math.min(y, d);
  }
  return m.height = `${d}px`, t.parentNode && t.parentNode.removeChild(t), t = null, m;
}, uo = (e) => () => e.$refs.input || e.$refs.textarea, po = (e) => () => e.getInput().blur(), fo = (e) => () => e.getInput().focus(), co = (e) => () => e.getInput().select(), mo = ({
  api: e,
  componentName: t,
  eventName: o,
  emit: n,
  props: r,
  state: i,
  vm: l
}) => (a) => {
  i.focused = !1, n("blur", a), e.isMemoryStorage.value = !1, r.validateEvent && e.dispatch(t, o, [r.modelValue]), r.hoverExpand && (l.$refs.textarea.scrollTop = 0);
}, ho = ({ api: e, emit: t, state: o }) => (n) => {
  o.focused = !0, t("focus", n), e.searchMemory(n.target.value);
}, yo = ({ api: e, emit: t, nextTick: o, state: n }) => (r) => {
  n.isComposing || r.target.value !== n.nativeInputValue && (t("update:modelValue", r.target.value), t("input", r), e.searchMemory(r.target.value), o(e.setNativeInputValue));
}, go = (e) => (t) => e("change", t.target.value), bo = ({ api: e, parent: t, vm: o, state: n, props: r }) => () => {
  if (no)
    return;
  const { autosize: i, type: l } = t;
  if (l !== "textarea" || !o.$refs.textarea)
    return;
  if (r.hoverExpand && !n.enteredTextarea) {
    n.textareaCalcStyle = {
      minHeight: n.textareaHeight,
      height: n.textareaHeight
    };
    return;
  }
  if (!i || n.isDisplayOnly) {
    n.textareaCalcStyle = {
      minHeight: e.calcTextareaHeight(o.$refs.textarea).minHeight
    };
    return;
  }
  const a = i.minRows, s = i.maxRows;
  n.textareaCalcStyle = e.calcTextareaHeight(o.$refs.textarea, a, s);
}, vo = ({ api: e, state: t }) => () => {
  const o = e.getInput();
  o && o.value !== t.nativeInputValue && (o.value = t.nativeInputValue);
}, wo = (e) => () => e.isComposing = !0, So = (e) => (t) => {
  const o = t.target.value, n = o[o.length - 1] || "";
  e.isComposing = !ro(n);
}, Co = ({ api: e, state: t }) => (o) => {
  t.isComposing && (t.isComposing = !1, e.handleInput(o));
}, Oo = ({ vm: e, parent: t }) => (o) => {
  const n = e.$refs[o] ? [e.$refs[o]] : [];
  if (!n.length)
    return;
  let r = null;
  for (let a = 0, s = n.length; a < s; a++)
    if (n[a].parentNode === t.$el) {
      r = n[a];
      break;
    }
  if (!r)
    return;
  const l = { suffix: "append", prefix: "prepend" }[o];
  if (t.$slots[l]) {
    const a = e.$refs[l];
    let s;
    o === "suffix" ? s = `translateX(-${a.offsetWidth}px) translateY(-50%)` : o === "prefix" && (s = `translate(${a.offsetWidth}px, -50%)`), r.style.transform = s;
  } else
    r.removeAttribute("style");
}, _o = (e) => () => {
  e.calcIconOffset("prefix"), e.calcIconOffset("suffix");
}, Mo = (e) => () => {
  e("update:modelValue", ""), e("change", ""), e("clear");
}, Eo = ({ api: e, nextTick: t, state: o }) => () => {
  o.passwordVisible = !o.passwordVisible, t(e.focus);
}, Bo = ({ parent: e, props: t, state: o }) => () => e.$slots.suffix || t.suffixIcon || o.showClear || t.showPassword || o.isWordLimitVisible || o.validateState && o.needStatusIcon || t.mask && o.inputDisabled, Io = (e) => typeof e == "number" ? String(e).length : (e || "").length, To = ({ emit: e, props: t, state: o }) => (n) => {
  if (t.isSelect) {
    e("update:modelValue", n), e("change", n);
    const r = t.selectMenu.length && t.selectMenu.filter((i) => i.id === n).shift();
    o.checkedLabel = r ? r.label : "";
  }
}, $o = (e) => () => {
  const t = e.getInput();
  return t && t.selectionStart !== t.selectionEnd;
}, xo = ({ state: e, props: t }) => (o, n) => {
  if (n === "textarea" && t.popupMore)
    return;
  const r = n === "textarea" ? o.target.querySelector(".text-box") : o.target;
  if (e.displayOnlyTooltip = "", !r)
    return;
  if (r.scrollWidth > r.offsetWidth || n === "textarea" && r.scrollHeight > r.offsetHeight)
    e.displayOnlyTooltip = t.displayOnlyContent || e.nativeInputValue;
  else {
    let l = !1;
    if (t.mask && e.maskValueVisible) {
      const a = r.textContent, s = window.getComputedStyle(r).font, u = r.getBoundingClientRect(), f = 31, c = (a == null ? void 0 : a.trim()) || "";
      l = ot(c, s, u.width - f).o;
    }
    l && (e.displayOnlyTooltip = t.displayOnlyContent || e.nativeInputValue);
  }
}, Do = ({ state: e, props: t }) => () => {
  let o = "";
  const n = t.displayOnlyContent || e.nativeInputValue;
  for (let r = 0; r < n.length; r++)
    o += "*";
  return o;
}, ko = ({ state: e }) => () => e.maskValueVisible ? e.nativeInputValue : e.nativeInputValue && e.maskSymbol, Po = ({ state: e, props: t, nextTick: o, vm: n }) => (r) => {
  o(() => {
    const i = n.$refs.input;
    t.mask && e.nativeInputValue && i && (i.value = e.maskValueVisible || !e.inputDisabled ? e.nativeInputValue : e.maskSymbol), r === "mask" && !t.mask && i && (i.value = e.nativeInputValue);
  });
}, Vo = ({ api: e, state: t, props: o, nextTick: n }) => () => {
  t.isDragging || o.hoverExpand && !t.isDisplayOnly && (t.enteredTextarea = !0, n(e.resizeTextarea));
}, Ao = ({ api: e, state: t, props: o, nextTick: n, vm: r }) => () => {
  t.isDragging || o.hoverExpand && !t.isDisplayOnly && (t.enteredTextarea = !1, n(() => {
    e.resizeTextarea(), r.$refs.textarea.scrollTop = 0;
  }));
}, Lo = ({ parent: e, state: t, props: o }) => () => {
  const n = o.displayOnlyContent || t.nativeInputValue;
  return (typeof o.showEmptyValue == "boolean" ? o.showEmptyValue : (e.tinyForm || {}).showEmptyValue) ? n : n || "-";
}, No = ({ state: e, vm: t }) => (o) => {
  e.timer && clearTimeout(e.timer), e.timer = setTimeout(() => {
    const n = t.$refs && t.$refs.textBox;
    if (n)
      if (o && n.offsetHeight === 0) {
        let r = n.cloneNode(!0);
        r.style.visibility = "hidden", r.style.position = "absolute", r.style.left = "-9999px", document.body.appendChild(r), r.scrollHeight > r.offsetHeight && (e.showMoreBtn = !0), document.body.removeChild(r), r = null;
      } else n.scrollHeight > n.offsetHeight ? e.showMoreBtn = !0 : e.showMoreBtn = !1;
  }, 100);
}, Fo = ({ state: e }) => () => e.isDragging = !0, zo = ({ state: e, api: t }) => (o) => {
  e.isDragging = !1, o && t.handleLeaveTextarea();
}, Ho = (e) => (e && e.preventDefault ? e.preventDefault() : window.event.returnValue = !1, !1), Wo = ({ emit: e, state: t }) => (o) => {
  t.hoverValue = "", e("selected", o);
}, Ro = ({ emit: e, props: t, state: o }) => () => {
  const n = window.event.keyCode, r = t.localstorageData.indexOf(o.hoverValue), i = t.localstorageData.length - 1;
  if (n === ie.ArrowUp && t.isMemoryStorage)
    return r > 0 && r <= i ? o.hoverValue = t.localstorageData[r - 1] : o.hoverValue = t.localstorageData[i], !1;
  if (n === ie.ArrowDown && t.isMemoryStorage)
    return r >= 0 && r < i ? o.hoverValue = t.localstorageData[r + 1] : o.hoverValue = t.localstorageData[0], !1;
  n === ie.NumpadEnter && t.isMemoryStorage && o.hoverValue && o.hoverValue.length > 0 && e("selected", o.hoverValue);
}, jo = (e, t = 5) => {
  const o = e.length;
  let n = [], r = {};
  for (let i = 0, l = 1; l <= t && !(i < 0 || i >= o || (r[e[i]] ? l = l - 1 : (r[e[i]] = !0, n.push(e[i])), l === o)); l++)
    i++;
  return n;
}, Ye = (e, t) => {
  if (typeof e == "string")
    try {
      const o = JSON.parse(e);
      return !!(typeof o == "object" && o && (!t || o.constructor === t));
    } catch {
      return !1;
    }
}, Uo = (e, t, o = 5) => {
  if (typeof t == "string") {
    const n = localStorage.getItem(e), r = Ye(n, Array);
    let i = "";
    if (n && r) {
      let l = JSON.parse(localStorage.getItem(e));
      l.unshift(t), l = jo(l, o), i = JSON.stringify(l);
    } else n === null || n === t ? i = JSON.stringify([t]) : i = JSON.stringify([t, n]);
    localStorage.setItem(e, i);
  }
}, Jo = (e) => (t) => {
  e.name && (t != null && t.trim()) && Uo(e.name, t, e.memorySpace);
}, Go = ({ props: e, state: t }) => (o) => {
  if (!e.name)
    return;
  const n = localStorage.getItem(e.name);
  let r = [], i = !0;
  if (Ye(n)) {
    const l = JSON.parse(n);
    if (!o)
      r = JSON.parse(n);
    else
      for (let a = 0, s = l.length; a < s; a++)
        l[a].includes(o) && r.push(l[a]);
    r.length === 0 && (i = !1);
  } else
    n === null ? i = !1 : r.push(n);
  t.storageData = r, t.isMemoryStorage = i;
}, Ko = ({ api: e, state: t }) => (o) => {
  e.getInput().value = o, e.handleInput({ target: { value: o } }), e.handleChange({ target: { value: o } }), t.isMemoryStorage = !1;
};
var Yo = ({ api: e, props: t, reactive: o, toRefs: n }) => {
  const r = o({
    storageData: [],
    isMemoryStorage: !1
  });
  return Ge(V({}, n(r)), {
    addMemory: Jo(t),
    searchMemory: Go({ props: t, state: r }),
    selectedMemory: Ko({ api: e, state: r })
  });
};
const Xo = [
  "blur",
  "showBox",
  "clear",
  "focus",
  "state",
  "select",
  "getInput",
  "handleBlur",
  "handleInput",
  "handleFocus",
  "handleChange",
  "calcIconOffset",
  "resizeTextarea",
  "getSuffixVisible",
  "updateIconOffset",
  "calcTextareaHeight",
  "setNativeInputValue",
  "calculateNodeStyling",
  "handleCompositionEnd",
  "handlePasswordVisible",
  "handleCompositionStart",
  "handleCompositionUpdate",
  "addMemory",
  "searchMemory",
  "selectedMemory",
  "storageData",
  "isMemoryStorage",
  "hasSelection",
  "handleEnterDisplayOnlyContent",
  "hiddenPassword",
  "inputStyle",
  "handleEnterTextarea",
  "handleLeaveTextarea",
  "handleTextareaMouseDown",
  "handleTextareaMouseUp"
], Zo = ({
  reactive: e,
  computed: t,
  mode: o,
  props: n,
  parent: r,
  constants: i,
  api: l,
  vm: a,
  designConfig: s
}) => {
  const u = e({
    mode: o,
    maskSymbol: i.MASKSYMBOL,
    focused: !1,
    hovering: !1,
    isComposing: !1,
    passwordVisible: !1,
    maskValueVisible: !1,
    boxVisibility: !1,
    textareaCalcStyle: {},
    checkedLabel: "",
    enteredTextarea: !1,
    sheetvalue: n.modelValue,
    inputSize: t(() => n.size || u.formItemSize || (r.tinyForm || {}).size),
    inputSizeMf: t(() => n.size || u.formItemSize || (r.tinyForm || {}).size),
    showClear: t(
      () => {
        var f;
        return n.clearable && !u.inputDisabled && !n.readonly && u.nativeInputValue && (!((f = s == null ? void 0 : s.options) != null && f.isCloseIconHide) || u.focused || u.hovering);
      }
    ),
    textareaHeight: a.theme === "saas" ? "28px" : "30px",
    upperLimit: t(() => r.$attrs.maxlength),
    textLength: t(() => Io(n.modelValue)),
    inputExceed: t(() => u.isWordLimitVisible && u.textLength > u.upperLimit),
    formItemSize: t(() => (r.formItem || {}).formItemSize),
    validateIcon: t(() => i.VALIDATE_ICON[u.validateState]),
    showWordLimit: t(() => n.showWordLimit && r.$attrs.maxlength),
    inputDisabled: t(
      () => n.disabled || (r.tinyForm || {}).disabled || u.isDisplayOnly || (r.tinyForm || {}).displayOnly
    ),
    validateState: t(() => r.formItem ? r.formItem.validateState : ""),
    inputStyle: t(() => l.inputStyle()),
    textareaStyle: t(() => Ge(V({}, u.textareaCalcStyle), {
      resize: n.resize,
      textAlign: n.textAlign
    })),
    needStatusIcon: t(() => r.tinyForm ? r.tinyForm.statusIcon : !1),
    showPwdVisible: t(
      () => n.showPassword && !u.inputDisabled && !n.readonly && (!!u.nativeInputValue || u.focused)
    ),
    nativeInputValue: t(
      () => n.modelValue === null || n.modelValue === void 0 ? "" : String(n.modelValue)
    ),
    tooltipConfig: t(() => r.tinyForm ? r.tinyForm.tooltipConfig : {}),
    isWordLimitVisible: t(
      () => (n.showWordLimit && r.$attrs.maxlength || n.counter) && (r.type === "text" || r.type === "textarea") && !u.inputDisabled && !n.readonly && !n.showPassword
    ),
    isDisplayOnly: t(
      () => (n.displayOnly || (r.tinyForm || {}).displayOnly) && ["text", "textarea", "password", "number"].includes(n.type)
    ),
    displayOnlyTooltip: "",
    showMoreBtn: !1,
    showDisplayOnlyBox: !1,
    timer: null,
    hiddenPassword: t(() => l.hiddenPassword()),
    displayedMaskValue: t(() => l.getDisplayedMaskValue()),
    displayOnlyText: t(() => l.getDisplayOnlyText()),
    isDragging: !1
  });
  return u;
}, qo = ({
  api: e,
  state: t,
  dispatch: o,
  broadcast: n,
  emit: r,
  vm: i,
  props: l,
  parent: a,
  nextTick: s
}) => {
  Object.assign(e, {
    state: t,
    dispatch: o,
    broadcast: n,
    showBox: lo(t),
    clear: Mo(r),
    getInput: uo(i),
    setShowMoreBtn: No({ state: t, vm: i }),
    handleChange: go(r),
    watchFormSelect: To({ emit: r, props: l, state: t }),
    calcIconOffset: Oo({ vm: i, parent: a }),
    getSuffixVisible: Bo({ parent: a, props: l, state: t }),
    calculateNodeStyling: so(),
    handleCompositionStart: wo(t),
    handleCompositionUpdate: So(t),
    setInputDomValue: Po({ state: t, props: l, nextTick: s, vm: i }),
    getDisplayOnlyText: Lo({ parent: a, props: l, state: t }),
    handleEnterTextarea: Vo({ api: e, state: t, props: l, nextTick: s }),
    handleLeaveTextarea: Ao({ api: e, state: t, props: l, nextTick: s, vm: i }),
    inputStyle: io({ props: l }),
    handleTextareaMouseDown: Fo({ state: t }),
    handleTextareaMouseUp: zo({ state: t, api: e })
  });
}, Qo = ({
  storages: e,
  api: t,
  componentName: o,
  props: n,
  emit: r,
  eventName: i,
  nextTick: l,
  parent: a,
  state: s,
  vm: u,
  mode: f,
  constants: c
}) => {
  const { storageData: p, isMemoryStorage: d, addMemory: m, searchMemory: v, selectedMemory: y } = e;
  return Object.assign(t, {
    addMemory: m,
    storageData: p,
    searchMemory: v,
    selectedMemory: y,
    isMemoryStorage: d,
    blur: po(t),
    focus: fo(t),
    select: co(t),
    handleBlur: mo({
      api: t,
      componentName: o,
      emit: r,
      eventName: i.blur,
      props: n,
      state: s,
      vm: u
    }),
    handleFocus: ho({ api: t, emit: r, state: s }),
    handleInput: yo({ api: t, emit: r, nextTick: l, state: s }),
    resizeTextarea: bo({ api: t, parent: a, vm: u, state: s, props: n }),
    updateIconOffset: _o(t),
    calcTextareaHeight: ao({
      api: t,
      hiddenTextarea: null,
      props: n,
      state: s,
      mode: f,
      constants: c
    }),
    setNativeInputValue: vo({ api: t, state: s }),
    handleCompositionEnd: Co({ api: t, state: s }),
    handlePasswordVisible: Eo({ api: t, nextTick: l, state: s }),
    hasSelection: $o(t),
    handleEnterDisplayOnlyContent: xo({ state: s, props: n }),
    hiddenPassword: Do({ state: s, props: n }),
    getDisplayedMaskValue: ko({ state: s })
  });
}, en = ({
  watch: e,
  state: t,
  api: o,
  props: n,
  nextTick: r,
  emit: i,
  componentName: l,
  eventName: a
}) => {
  e(
    () => n.modelValue,
    (s) => {
      t.mode === "mobile" && (t.sheetvalue = s, i("update:modelValue", s)), r(o.resizeTextarea), n.validateEvent && o.dispatch(l, a.change, [s]), n.type === "textarea" && n.popupMore && t.isDisplayOnly && o.setShowMoreBtn(), o.setInputDomValue();
    }
  ), e(() => t.maskValueVisible, o.setInputDomValue), e(() => t.inputDisabled, o.setInputDomValue), e(
    () => n.mask,
    () => {
      o.setInputDomValue("mask");
    }
  ), e(
    () => n.size,
    () => r(o.resizeTextarea),
    { immediate: !0 }
  ), e(
    () => t.nativeInputValue,
    () => {
      o.setNativeInputValue();
    }
  ), e(
    () => n.type,
    () => {
      r(() => {
        o.setNativeInputValue(), o.resizeTextarea(), o.updateIconOffset();
      });
    }
  ), e(
    () => t.isDisplayOnly,
    () => {
      r(() => {
        o.setNativeInputValue(), o.resizeTextarea(), o.updateIconOffset();
      });
    }
  ), e(
    () => t.sheetvalue,
    (s) => o.watchFormSelect(s),
    { immediate: !0 }
  );
}, tn = (e, { computed: t, onMounted: o, onBeforeUnmount: n, onUpdated: r, reactive: i, toRefs: l, watch: a, inject: s }, { vm: u, refs: f, parent: c, emit: p, constants: d, nextTick: m, broadcast: v, dispatch: y, mode: w, designConfig: B }) => {
  const g = {}, P = d.COMPONENT_NAME.FormItem, C = { change: "form.change", blur: "form.blur" }, S = Zo({ reactive: i, computed: t, mode: w, props: e, parent: c, constants: d, api: g, vm: u, designConfig: B });
  qo({ api: g, state: S, dispatch: y, broadcast: v, emit: p, props: e, parent: c, vm: u, nextTick: m });
  const A = Yo({ api: g, props: e, reactive: i, toRefs: l });
  return c.tinyForm = c.tinyForm || s("form", null), Qo({ api: g, storages: A, componentName: P, emit: p, eventName: C, props: e, state: S, nextTick: m, parent: c, vm: u, mode: w, constants: d }), en({ watch: a, state: S, api: g, props: e, nextTick: m, emit: p, componentName: P, eventName: C }), o(() => {
    g.setNativeInputValue(), g.resizeTextarea(), g.updateIconOffset(), g.setInputDomValue(), y("Select", "input-mounted", u.$el), y("Tooltip", "tooltip-update", u.$el), e.type === "textarea" && e.popupMore && S.isDisplayOnly && (g.setShowMoreBtn(!0), I(window, "resize", g.setShowMoreBtn)), u.$attrs.autofocus && g.focus();
  }), n(() => {
    e.type === "textarea" && e.popupMore && S.isDisplayOnly && D(window, "resize", g.setShowMoreBtn);
  }), r(() => {
    m(g.updateIconOffset);
  }), g;
}, on = typeof window > "u", W = [], E = "@@clickoutsideContext";
let G, nn = 0;
on || (I(document, "mousedown", (e) => {
  G = e, W.filter((t) => t[E].mousedownTrigger).forEach((t) => t[E].documentHandler(e, G));
}), I(document, "mouseup", (e) => {
  W.filter((t) => !t[E].mousedownTrigger).forEach((t) => {
    var o;
    return t[E].documentHandler(e, (o = t[E]) != null && o.mouseupTrigger ? e : G);
  }), G = null;
}));
const Ve = (e, t, o) => function(n = {}, r = {}) {
  let i = o.context.popperElm || o.context.state && o.context.state.popperElm;
  !(n != null && n.target) || !(r != null && r.target) || e.contains(n.target) || e.contains(r.target) || e === n.target || i && (i.contains(n.target) || i.contains(r.target)) || (t.expression && e[E].methodName && o.context[e[E].methodName] ? o.context[e[E].methodName]() : e[E].bindingFn && e[E].bindingFn());
};
var rn = {
  bind: (e, t, o) => {
    W.push(e);
    const n = nn++, { modifiers: r, expression: i, value: l } = t, { mousedown: a = !1, mouseup: s = !1 } = r || {};
    e[E] = {
      id: n,
      documentHandler: Ve(e, t, o),
      methodName: i,
      bindingFn: l,
      mousedownTrigger: a,
      mouseupTrigger: s
    };
  },
  update: (e, t, o) => {
    const { modifiers: n, expression: r, value: i } = t, { mousedown: l = !1, mouseup: a = !1 } = n || {};
    e[E].documentHandler = Ve(e, t, o), e[E].methodName = r, e[E].bindingFn = i, e[E].mousedownTrigger = l, e[E].mouseupTrigger = a;
  },
  unbind: (e) => {
    if (e.nodeType !== Node.ELEMENT_NODE)
      return;
    let t = W.length;
    for (let o = 0; o < t; o++)
      if (W[o][E].id === e[E].id) {
        W.splice(o, 1);
        break;
      }
    W.length === 0 && G && (G = null), delete e[E];
  }
};
const ln = ["state", "mousedown", "selectItem"], sn = (e, { onUnmounted: t, reactive: o, watch: n }, { emit: r }) => {
  const i = o({
    hoverValue: ""
  }), l = {
    state: i,
    mousedown: Ho,
    selectItem: Wo({ emit: r, state: i }),
    keydown: Ro({ emit: r, props: e, state: i })
  };
  return n(
    () => e.isMemoryStorage,
    (a) => !a && (i.hoverValue = ""),
    { immediate: !0 }
  ), t(() => {
    i.hoverValue = "", D(document, "keydown", l.keydown);
  }), I(document, "keydown", l.keydown), l;
}, an = ({ api: e, state: t, props: o }) => (n) => {
  const i = n && n.type === "mouseenter" ? 200 : 0;
  if (o.visible === "auto") {
    const { clientWidth: l, scrollWidth: a } = t.referenceElm;
    if (a <= l)
      return;
  }
  e.setExpectedState(!0), e.handleShowPopper(i);
}, un = (e) => () => {
  e.setExpectedState(!1), e.debounceClose();
}, pn = ({ api: e, state: t }) => () => {
  t.focusing = !0, e.show();
}, dn = ({ api: e, state: t }) => () => {
  t.focusing = !1, e.hide();
}, fn = ({ api: e, state: t }) => () => {
  t.focusing = !1, e.show();
}, cn = ({ props: e, state: t }) => (o) => {
  !t.expectedState || e.manual || (clearTimeout(t.timeout), t.timeout = window.setTimeout(() => {
    t.showPopper = !0;
  }, e.openDelay || o), e.hideAfter > 0 && (t.timeoutPending = window.setTimeout(() => {
    t.showPopper = !1;
  }, e.hideAfter)));
}, mn = ({ api: e, props: t, state: o }) => () => {
  t.enterable && o.expectedState || t.manual || (clearTimeout(o.timeout), o.timeoutPending && clearTimeout(o.timeoutPending), o.showPopper = !1, t.disabled && e.doDestroy());
}, hn = ({ props: e, api: t, state: o, popperVmRef: n }) => (r) => {
  if (e.manual)
    return;
  const i = o.referenceElm, l = n.popper;
  !l || !i || l.contains(r.target) || i.contains(r.target) || o.showPopper && (t.setExpectedState(!1), t.debounceClose());
}, yn = ({ state: e }) => (t) => {
  e.expectedState === !1 && clearTimeout(e.timeoutPending), e.expectedState = t;
}, gn = ({ state: e, api: t, vm: o }) => () => {
  const n = e.referenceElm;
  e.showPopper = !1, n && n.nodeType === 1 && (D(document, "click", t.handleDocumentClick), D(n, "mouseenter", t.show), D(n, "mouseleave", t.hide), D(n, "focus", t.focusHandler), D(n, "blur", t.handleBlur), D(n, "click", t.removeFocusing)), o.popperVM && (typeof o.popperVM.$destroy == "function" && o.popperVM.$destroy(), o.popperVM = null);
}, bn = ({ api: e, props: t }) => nt(t.closeDelay, () => {
  e.handleClosePopper();
}), vn = (e) => (t) => {
  t ? R(e.referenceElm, "focusing") : J(e.referenceElm, "focusing");
}, wn = ({ slots: e, api: t }) => () => {
  if (!e.default || !e.default().length) {
    t.handleFocus();
    return;
  }
  let o = e.default()[0];
  o = o.elm || o.el, o && o.focus ? o.focus() : t.handleFocus();
}, Sn = ({ api: e, state: t, vm: o }) => (n) => {
  let r = null;
  o.$el.nodeType === 8 ? r = n : o.$el.nodeType === 1 && (r = o.$el), !(!r || r.nodeType === 8 || t.referenceElm) && (t.referenceElm = r, r.setAttribute("aria-describedby", t.tooltipId), r.setAttribute("tabindex", t.tabindex.toString()), I(document, "click", e.handleDocumentClick), I(r, "mouseenter", e.show), I(r, "mouseleave", e.hide), I(r, "focus", e.focusHandler), I(r, "blur", e.handleBlur), I(r, "click", e.removeFocusing));
}, Cn = ({ state: e, popperVmRef: t }) => (o) => {
  for (let n of o)
    n.type === "attributes" && n.attributeName === "x-placement" && (e.xPlacement = t.popper.getAttribute("x-placement") || "bottom");
}, On = ({ vm: e, nextTick: t, popperVmRef: o }) => (n) => {
  t(() => e.bindEvent(n));
  let r = e.popperVM;
  e.$refs.popper ? o.popper = e.$refs.popper : o.popper = r.$el, t(() => {
    e.modelValue && e.updatePopper();
  });
}, $e = typeof window > "u", ne = {}, X = {
  leave: "v-modal-leave",
  enter: "v-modal-enter",
  modal: "v-modal"
}, _n = (e, t) => {
  for (let o = e.length - 1; o >= 0; o--)
    if (e[o].id === t) {
      e.splice(o, 1);
      break;
    }
};
let Oe;
const $ = {
  step: 2,
  zIndex: 2e3,
  globalScroll: !1,
  // 是否打开全局滚动监听
  modalFade: !0,
  modalStack: [],
  modalDom: null,
  // 当前model挂载的div.
  hasModal: !1,
  // 当前是否有Modal
  popLockClass: "popup-parent--hidden",
  oldBodyBorder: "",
  viewportWindow: null,
  fixBodyBorder() {
    const e = window.innerWidth - document.documentElement.clientWidth;
    e && (this.oldBodyBorder = document.documentElement.style.borderRight, document.body.style.borderRight = `${e}px solid transparent`);
  },
  resetBodyBorder() {
    document.body.style.borderRight = this.oldBodyBorder, this.oldBodyBorder = "";
  },
  /** 全局反注册 */
  deregister: (e) => {
    e && (ne[e] = null, delete ne[e]);
  },
  /** 返回全局实例 */
  getInstance: (e) => ne[e],
  /** 全局注册   仅vue-popup.ts中使用，instance就是vm, 把vm注册到 vm._popupId 这个键值上 */
  register: (e, t) => {
    e && t && (ne[e] = t);
  },
  nextZIndex: () => {
    const e = $.zIndex;
    return $.zIndex += $.step, e;
  },
  /** 打开遮罩层， 仅vue-popup.ts中使用。 dom = vm.$el 或者 undefined (appendtoBody时)  */
  openModal(e, t, o, n, r) {
    if ($e || !e || t === void 0)
      return;
    this.modalFade = r;
    for (let a = 0, s = this.modalStack.length; a < s; a++)
      if (this.modalStack[a].id === e)
        return;
    const i = Oe();
    R(i, X.modal), this.modalFade && !$.hasModal && R(i, X.enter), n && n.trim().split(/\s+/).forEach((s) => R(i, s)), setTimeout(() => {
      J(i, X.enter);
    }, 200), t && (i.style.zIndex = t.toString()), i.style.display = "", i.tabIndex = 0;
    let l;
    o && o.parentNode && o.parentNode.nodeType !== 11 ? l = o.parentNode : l = document.body, l.appendChild(i), this.modalStack.push({ id: e, zIndex: t, modalClass: n });
  },
  /** 点击背景遮罩层时，调用栈顶的popup，调用它的close() */
  doOnModalClick: () => {
    const e = $.modalStack, t = e[e.length - 1];
    if (!t)
      return;
    const o = $.getInstance(t.id);
    o && o.closeOnClickModal && typeof o.close == "function" && o.close();
  },
  closeModal(e) {
    const t = this.modalStack, o = Oe();
    if (t.length > 0) {
      const n = t[t.length - 1];
      if (n.id === e) {
        n.modalClass && n.modalClass.trim().split(/\s+/).forEach((l) => J(o, l)), t.pop();
        const r = t.length;
        r > 0 && (o.style.zIndex = t[r - 1].zIndex.toString());
      } else
        _n(t, e);
    }
    t.length === 0 && (this.modalFade && R(o, X.leave), J(document.body, this.popLockClass), this.resetBodyBorder(), setTimeout(() => {
      t.length === 0 && (o.parentNode && o.parentNode.removeChild(o), o.style.display = "none", $.modalDom = null), J(o, X.leave);
    }, 200));
  }
};
Oe = () => {
  if ($e)
    return null;
  let e = $.modalDom;
  return e ? $.hasModal = !0 : ($.hasModal = !1, e = document.createElement("div"), $.modalDom = e, e.addEventListener(
    "touchmove",
    (t) => {
      t.preventDefault(), t.stopPropagation();
    },
    { passive: !0 }
  ), I(e, "click", () => {
    $.doOnModalClick();
  })), e;
};
$e || I(window, "keydown", (e) => {
  if (e.keyCode === ie.Escape) {
    const t = $.modalStack;
    if (t.length > 0) {
      const o = t[t.length - 1];
      if (!o)
        return;
      const n = $.getInstance(o.id);
      n && n.closeOnPressEscape && (n.handleClose ? n.handleClose("esc") : n.handleAction ? n.handleAction("cancel") : n.close());
    }
  }
});
var T = $;
const Mn = ["left", "right", "top", "bottom"], Xe = ["shift", "offset", "preventOverflow", "keepTogether", "arrow", "flip", "applyStyle"], En = {
  arrowOffset: 0,
  arrowElement: "[x-arrow]",
  boundariesElement: "viewport",
  boundariesPadding: 5,
  flipBehavior: "flip",
  // 全局没有修改过它，所以它一直是flip
  forceAbsolute: !1,
  gpuAcceleration: !0,
  offset: 0,
  placement: "bottom",
  preventOverflowOrder: Mn,
  modifiers: Xe,
  // 此处是string数组， 构造函数调用之后转为函数数组
  updateHiddenPopperOnScroll: !1
  // 滚动过程中是否更新隐藏的弹出层位置
}, se = (e, t) => {
  const o = (n) => n !== "" && !isNaN(parseFloat(n)) && isFinite(n);
  Object.keys(t).forEach((n) => {
    let r = "";
    ~["width", "height", "top", "right", "bottom", "left"].indexOf(n) && o(t[n]) && (r = "px"), e.style[n] = t[n] + r;
  });
}, he = (e) => {
  let t = e.offsetParent;
  return t === window.document.body || !t ? window.document.documentElement : t;
}, q = (e, t) => !e || e.nodeType !== 1 ? void 0 : window.getComputedStyle(e, null)[t], Ze = (e) => e === window.document.body ? !1 : q(e, "position") === "fixed" ? !0 : (e.host && (e = e.host), e.parentNode ? Ze(e.parentNode) : !1), _e = (e) => {
  let t = e.getBoundingClientRect();
  return {
    left: t.left,
    top: t.top,
    right: t.right,
    bottom: t.bottom,
    width: t.right - t.left,
    height: t.bottom - t.top
  };
}, qe = (e) => {
  const t = ["scroll", "auto"];
  return t.includes(q(e, "overflow")) || t.includes(q(e, "overflow-x")) || t.includes(q(e, "overflow-y"));
}, Bn = (e) => {
  const t = document.createElement("div");
  se(t, {
    opacity: 0,
    position: "fixed",
    width: 1,
    height: 1,
    top: 0,
    left: 0,
    "z-index": "-99"
  }), e.appendChild(t);
  const o = _e(t);
  return e.removeChild(t), o;
}, ae = (e) => {
  let t = e.parentNode;
  return t ? t === window.document ? window.document.body.scrollTop || window.document.body.scrollLeft ? window.document.body : window.document.documentElement : qe(t) ? t : ae(t) : e;
}, In = (e, t, o, n) => {
  let { top: r, left: i, width: l, height: a } = _e(e);
  if (o) {
    if (n.parentElement) {
      const { top: f, left: c } = Bn(n.parentElement);
      r -= f, i -= c;
    }
    return {
      top: r,
      left: i,
      bottom: r + a,
      right: i + l,
      width: l,
      height: a
    };
  }
  let s = _e(t);
  return {
    top: r - s.top,
    left: i - s.left,
    bottom: r - s.top + a,
    right: i - s.left + l,
    width: l,
    height: a
  };
}, Tn = (e) => e === document.body ? Math.max(document.documentElement.scrollTop, document.body.scrollTop) : e.scrollTop, $n = (e) => e === document.body ? Math.max(document.documentElement.scrollLeft, document.body.scrollLeft) : e.scrollLeft, xn = (e, t) => {
  const o = Math.max(e.scrollHeight, e.offsetHeight, t.clientHeight, t.scrollHeight, t.offsetHeight);
  return { width: Math.max(e.scrollWidth, e.offsetWidth, t.clientWidth, t.scrollWidth, t.offsetWidth), height: o };
}, ye = (e) => {
  let t = e.style.display, o = e.style.visibility;
  e.style.display = "block", e.style.visibility = "hidden";
  let n = window.getComputedStyle(e), r = parseFloat(n.marginTop) + parseFloat(n.marginBottom), i = parseFloat(n.marginLeft) + parseFloat(n.marginRight), l = { width: e.offsetWidth + i, height: e.offsetHeight + r };
  return e.style.display = t, e.style.visibility = o, l;
}, Ae = (e) => {
  let t = { left: "right", right: "left", bottom: "top", top: "bottom" };
  return e.replace(/left|right|bottom|top/g, (o) => t[o]);
}, Z = (e) => {
  let t = V({}, e);
  return t.right = t.left + t.width, t.bottom = t.top + t.height, t;
}, Qe = (e, t = []) => {
  const o = e.parentNode;
  return o ? (qe(o) && t.push(o), q(o, "position") === "fixed" ? t : Qe(o, t)) : t;
}, Le = (e) => {
  const t = {
    width: e.offsetWidth,
    height: e.offsetHeight,
    left: e.offsetLeft,
    top: e.offsetTop,
    right: 0,
    bottom: 0
  };
  return t.right = t.left + t.width, t.bottom = t.top + t.height, t;
}, Ne = (e) => {
  e.stopPropagation();
}, Fe = je && typeof ResizeObserver == "function" ? new ResizeObserver((e) => {
  e.forEach((t) => {
    t.target.popperVm && t.contentRect.height > 50 && t.target.popperVm.update();
  });
}) : null;
class Dn {
  constructor(t, o, n) {
    this.modifiers = {}, this.popperOuterSize = null, this._reference = t, this._popper = o, this.state = {}, this._options = V(V({}, En), n), this._options.modifierFns = Xe.map((r) => this[r]), je && (this._popper.setAttribute("x-placement", this._options.placement), this.state.position = this._getPopperPositionByRefernce(this._reference), se(this._popper, { position: this.state.position, top: 0 }), this._popper && (this._popper.popperVm = this, Fe && Fe.observe(this._popper)), this.update(), this._setupEventListeners());
  }
  destroy() {
    return this._popper.removeAttribute("x-placement"), this._popper.style.display = "none", this._removeEventListeners(), this._options.removeOnDestroy && this._popper.remove(), this;
  }
  onUpdate(t) {
    return this.state.updateCallback = t, this;
  }
  update() {
    let t = { instance: this, styles: {} };
    this.stopEventBubble(), this.popperOuterSize = null, t.placement = t._originalPlacement = this._options.placement, t.offsets = this._getRefPopOffsets(this._popper, this._reference, t.placement), t.boundaries = this._getBoundaries(t, this._options.boundariesPadding, this._options.boundariesElement), t = this.runModifiers(t, this._options.modifierFns), typeof this.state.updateCallback == "function" && this.state.updateCallback(t);
  }
  // 阻止popper的mousewheel等事件冒泡。 通过 onxxx 绑定，是为了避免重复绑定事件
  stopEventBubble() {
    this._popper && (this._popper.onmousewheel || (this._popper.onmousewheel = Ne), this._popper.onwheel || (this._popper.onwheel = Ne));
  }
  /** 按顺序执行Modifiers， 如果传入终点modifier,则执行到指定位置 */
  runModifiers(t, o, n) {
    let r = o.slice();
    const i = this._options;
    return n !== void 0 && (r = this._options.modifierFns.slice(
      0,
      i.modifierFns.findIndex((l) => l === n)
    )), r.forEach((l) => {
      rt(l) === "function" && (t = l.call(this, t));
    }), t;
  }
  // 此时才把offsets.popper 赋值给popper dom,  offsets.array赋值给array dom
  applyStyle(t) {
    let o = { position: t.offsets.popper.position }, n = Math.round(t.offsets.popper.left), r = Math.round(t.offsets.popper.top);
    return this._options.gpuAcceleration ? (o.transform = `translate3d(${n}px, ${r}px, 0)`, Object.assign(o, { top: 0, left: 0 })) : Object.assign(o, { top: r, left: n }), Object.assign(o, t.styles), se(this._popper, o), this._popper.setAttribute("x-placement", t.placement), t.offsets.arrow && se(t.arrowElement, t.offsets.arrow), t;
  }
  // 判断 placement是不是2段式的，是则处理一下偏移。 修改data.offsets.popper的值
  shift(t) {
    let o = t.placement, n = o.split("-")[0], r = o.split("-")[1];
    if (r) {
      let { top: i, left: l, height: a, width: s } = t.offsets.reference, u = Z(t.offsets.popper), f = {
        y: {
          start: { top: i },
          end: { top: i + a - u.height }
        },
        x: {
          start: { left: l },
          end: { left: l + s - u.width }
        }
      }, c = ~["bottom", "top"].indexOf(n) ? "x" : "y";
      t.offsets.popper = Object.assign(u, f[c][r]);
    }
    return t;
  }
  // 校正popper的位置在boundaries 的内部
  preventOverflow(t) {
    if (this._options.ignoreBoundaries)
      return t;
    let o = this._options.preventOverflowOrder, n = Z(t.offsets.popper), r = {
      top: () => {
        let { top: i } = n;
        return i < t.boundaries.top && (i = Math.max(i, t.boundaries.top)), { top: i };
      },
      right: () => {
        let { left: i } = n;
        return n.right > t.boundaries.right && (i = Math.min(i, t.boundaries.right - n.width)), { left: i };
      },
      bottom: () => {
        let { top: i } = n;
        return n.bottom > t.boundaries.bottom && (i = Math.min(i, t.boundaries.bottom - n.height)), { top: i };
      },
      left: () => {
        let { left: i } = n;
        return n.left < t.boundaries.left && (i = Math.max(i, t.boundaries.left)), { left: i };
      }
    };
    return o.forEach((i) => {
      t.offsets.popper = Object.assign(n, r[i]());
    }), t;
  }
  // 校正popper的位置在reference的边上。 如果2个分离了，重新调整popper的位置。 可能是担心 modifiers.offset 带来的副作用吧
  keepTogether(t) {
    let o = Z(t.offsets.popper), n = t.offsets.reference;
    return o.right < Math.floor(n.left) && (t.offsets.popper.left = Math.floor(n.left) - o.width), o.left > Math.floor(n.right) && (t.offsets.popper.left = Math.floor(n.right)), o.bottom < Math.floor(n.top) && (t.offsets.popper.top = Math.floor(n.top) - o.height), o.top > Math.floor(n.bottom) && (t.offsets.popper.top = Math.floor(n.bottom)), t;
  }
  // 根据flip的策略，计算当前应该显示的位置。 空间不够要计算出flip的位置。 可能是担心preventOverflow 时，造成pop, reference会重叠。 重叠了就要flip一下
  flip(t) {
    if (t.flipped && t.placement === t._originalPlacement)
      return t;
    const o = t.placement.split("-");
    let n = o[0], r = Ae(n), i = o[1] || "", l = [n, r];
    return l.forEach((a, s) => {
      if (n !== a || l.length === s + 1)
        return;
      n = t.placement.split("-")[0], r = Ae(n);
      let u = Z(t.offsets.popper), f = ~["right", "bottom"].indexOf(n), c = Math.floor(t.offsets.reference[n]), p = Math.floor(u[r]);
      (f && c > p || !f && c < p) && (t.flipped = !0, t.placement = l[s + 1], i && (t.placement += `-${i}`), t.offsets.popper = this._getRefPopOffsets(this._popper, this._reference, t.placement).popper, t = this.runModifiers(t, this._options.modifierFns, this.flip));
    }), t;
  }
  // 根据入参option上的offset, 给data.offset.popper进行校正
  offset(t) {
    let o = this._options.offset, n = t.offsets.popper;
    return ~t.placement.indexOf("left") ? n.top -= o : ~t.placement.indexOf("right") ? n.top += o : ~t.placement.indexOf("top") ? n.left -= o : ~t.placement.indexOf("bottom") && (n.left += o), t;
  }
  // 计算arrow的位置,保存在data.offsets.arrow ={top,left}
  arrow(t) {
    let o = this._options.arrowElement, n = this._options.arrowOffset;
    if (typeof o == "string" && (o = this._popper.querySelector(o)), !o || !this._popper.contains(o))
      return t;
    let r = {}, i = t.placement.split("-")[0], l = Z(t.offsets.popper), a = t.offsets.reference, s = ~["left", "right"].indexOf(i), u = s ? "height" : "width", f = s ? "bottom" : "right", c = s ? "left" : "top", p = s ? "top" : "left", d = this.popperOuterSize ? this.popperOuterSize : this.popperOuterSize = ye(this._popper), m = ye(o), v = m[u];
    a[f] - v < l[p] && (t.offsets.popper[p] -= l[p] - (a[f] - v)), a[p] + v > l[f] && (t.offsets.popper[p] += a[p] + v - l[f]);
    let w = a[p] + (n || a[u] / 2 - v / 2) - l[p];
    w = Math.max(Math.min(l[u] - v - 8, w), 8), r[p] = w, r[c] = "";
    const B = this._options.placement.split("-");
    return this._options.adjustArrow && ~["top", "bottom"].indexOf(B[0]) && p === "left" && (B[1] === "start" ? r.left = 8 : B[1] || (r.left = (d.width - m.width) / 2)), t.offsets.arrow = r, t.arrowElement = o, t;
  }
  /** 判断 reference 的 offsetParent 元素是fix还是abs, 这个值会赋值给popper 的dom */
  _getPopperPositionByRefernce(t) {
    return this._options.forceAbsolute ? "absolute" : Ze(t) ? "fixed" : "absolute";
  }
  /** 实时计算一下popper, reference的 位置信息， 用于 */
  _getRefPopOffsets(t, o, n) {
    n = n.split("-")[0];
    let r = { position: this.state.position }, i = r.position === "fixed", l = In(
      o,
      he(t),
      i,
      t
    );
    const { width: a, height: s } = this.popperOuterSize ? this.popperOuterSize : this.popperOuterSize = ye(t);
    return ~["right", "left"].indexOf(n) ? (r.top = l.top + l.height / 2 - s / 2, n === "left" ? r.left = l.left - a : r.left = l.right) : (r.left = l.left + l.width / 2 - a / 2, n === "top" ? r.top = l.top - s : r.top = l.bottom), r.width = a, r.height = s, {
      popper: r,
      reference: l
    };
  }
  _setupEventListeners() {
    var t, o;
    if (this.state.updateBoundFn = this.update.bind(this), this.state.scrollUpdate = () => {
      if (this._options.updateHiddenPopperOnScroll)
        this.state.updateBoundFn();
      else {
        if (Ue(this._reference))
          return;
        this.state.updateBoundFn();
      }
    }, I(window, "resize", this.state.updateBoundFn), this._options.boundariesElement !== "window") {
      let n = this._options.scrollParent || ae(this._reference);
      const r = [];
      if ((o = (t = n == null ? void 0 : n.dataset) == null ? void 0 : t.tag) != null && o.includes("-form")) {
        r.push(n);
        let i = ae(n);
        (i === window.document.body || i === window.document.documentElement) && (i = window), r.push(i);
      }
      if ((n === window.document.body || n === window.document.documentElement) && (n = window), this.state.scrollTarget = n, this._options.bubbling || T.globalScroll) {
        let i = Qe(this._reference);
        this.state.scrollTargets = i || [], i.forEach((l) => {
          I(l, "scroll", this.state.scrollUpdate);
        });
      } else
        r.length ? (this.state.scrollTargets = r, r.forEach((i) => {
          I(i, "scroll", this.state.scrollUpdate);
        })) : I(n, "scroll", this.state.scrollUpdate);
    }
  }
  _removeEventListeners() {
    D(window, "resize", this.state.updateBoundFn), this._options.boundariesElement !== "window" && this.state.scrollTarget && (D(this.state.scrollTarget, "scroll", this.state.scrollUpdate), this.state.scrollTarget = null, (this._options.bubbling || T.globalScroll) && ((this.state.scrollTargets || []).forEach((o) => {
      D(o, "scroll", this.state.scrollUpdate);
    }), this.state.scrollTargets = null)), this.state.updateBoundFn = null, this.state.scrollUpdate = null;
  }
  /** 实时计算一下Boundary的位置 */
  _getBoundaries(t, o, n) {
    let r = { right: 0, left: 0, top: 0, bottom: 0 };
    if (n === "window" || n === "body") {
      let i = window.document.body, l = window.document.documentElement, { width: a, height: s } = xn(i, l);
      r = { top: 0, right: a, bottom: s, left: 0 };
    } else if (n === "viewport") {
      let i = he(this._popper), l = ae(this._popper), a = Le(i);
      const u = t.offsets.popper.position === "fixed" || !this._options.appendToBody && ["right", "left"].includes(this._options.placement);
      let f = u ? 0 : Tn(l), c = u ? 0 : $n(l);
      const p = T.viewportWindow || window;
      r = {
        top: 0 - (a.top - f),
        right: p.document.documentElement.clientWidth - (a.left - c),
        bottom: p.document.documentElement.clientHeight - (a.top - f),
        left: 0 - (a.left - c)
      };
    } else if (he(this._popper) === n) {
      const { clientWidth: i, clientHeight: l } = n;
      r = {
        right: i,
        bottom: l,
        top: 0,
        left: 0
      };
    } else
      r = Le(n);
    return r.right -= o, r.left += o, r.bottom = r.bottom - o, r.top = r.top + o, r;
  }
}
var kn = Dn;
const ze = (e) => e.stopPropagation(), Pn = typeof window > "u", He = ({ state: e, props: t, vm: o, slots: n }) => {
  let r = e.referenceElm || t.reference || o.$refs.reference && o.$refs.reference.$el || o.$refs.reference;
  return !r && n.reference && n.reference()[0] && (e.referenceElm = n.reference()[0].elm || n.reference()[0].el, r = e.referenceElm), r;
}, Vn = (e) => {
  if (!e || !e.nodeType)
    return;
  let t = (r) => parseInt(window.getComputedStyle(r).zIndex, 10) || 0, o = t(e), n;
  do {
    if (e = e.parentNode, e && e instanceof ShadowRoot && e.host && (e = e.host), e)
      n = t(e);
    else
      break;
    o = n > o ? n : o;
  } while (e !== document.body);
  return o + 1 + "";
};
var An = (e) => {
  const {
    parent: t,
    emit: o,
    nextTick: n,
    onBeforeUnmount: r,
    onDeactivated: i,
    props: l,
    watch: a,
    reactive: s,
    vm: u,
    slots: f,
    toRefs: c,
    popperVmRef: p
  } = e, d = s({
    popperJS: null,
    appended: !1,
    // arrow 是否添加
    popperElm: null,
    showPopper: l.manual ? !!l.modelValue : !1,
    referenceElm: null,
    currentPlacement: ""
  }), m = (C) => {
    if (d.appended)
      return;
    d.appended = !0;
    const S = document.createElement("div");
    S.setAttribute("x-arrow", ""), S.className = "popper__arrow", C.appendChild(S);
  }, v = (C) => {
    const { followReferenceHide: S = !0 } = (l == null ? void 0 : l.popperOptions) || {}, { _popper: A, _reference: M } = C;
    S && Ue(M) && (A.style.display = "none");
  }, y = (C) => l.zIndex === "relative" ? Vn(C) : T.nextZIndex(), w = (C) => {
    if (Pn || (d.currentPlacement = d.currentPlacement || l.placement, !/^(top|bottom|left|right)(-start|-end)?$/g.test(d.currentPlacement)))
      return;
    const S = l.popperOptions || { gpuAcceleration: !1 };
    d.popperElm = d.popperElm || l.popper || u.$refs.popper || p.popper || C;
    const A = d.popperElm;
    let M = He({ state: d, props: l, vm: u, slots: f });
    !A || !M || M.nodeType !== Node.ELEMENT_NODE || (l.visibleArrow && m(A), l.appendToBody || l.popperAppendToBody ? document.body.appendChild(d.popperElm) : (t && t.$el && t.$el.appendChild(d.popperElm), S.forceAbsolute = !0), S.placement = d.currentPlacement, S.offset = l.offset || 0, S.arrowOffset = l.arrowOffset || 0, S.adjustArrow = l.adjustArrow || !1, S.appendToBody = l.appendToBody || l.popperAppendToBody, d.popperJS = new kn(M, A, S), o("created", d), typeof S.onUpdate == "function" && d.popperJS.onUpdate(S.onUpdate), d.popperJS._popper.style.zIndex = y(d.popperJS._reference), v(d.popperJS), I(d.popperElm, "click", ze));
  }, B = (C) => {
    C && C !== !0 && (d.popperElm = C);
    const S = d.popperJS;
    S ? (S._reference = He({ state: d, props: l, vm: u, slots: f }), S.update(), S._popper && C !== !0 && (S._popper.style.zIndex = y(S._reference), v(d.popperJS))) : w(C && C !== !0 ? C : void 0);
  }, g = (C) => {
    !d.popperJS || d.showPopper && !C || (d.popperJS.destroy(), d.popperJS = null);
  }, P = (C) => {
    C && d.popperElm && d.popperElm.parentNode === document.body && (D(d.popperElm, "click", ze), d.popperElm.remove());
  };
  return a(
    () => d.showPopper,
    (C) => {
      l.disabled || (C && n(B), l.trigger === "manual" && o("update:modelValue", C));
    }
  ), r(() => {
    n(() => {
      g(!0), (l.appendToBody || l.popperAppendToBody) && P("remove");
    });
  }), i(() => {
    g(!0), (l.appendToBody || l.popperAppendToBody) && P("remove");
  }), V({ updatePopper: B, destroyPopper: P, doDestroy: g }, c(d));
};
const Ln = [
  "state",
  "bindEvent",
  "hide",
  "show",
  "doDestroy",
  "handleFocus",
  "debounceClose",
  "handleShowPopper",
  "handleClosePopper",
  "setExpectedState",
  "updatePopper",
  "focusHandler"
], Nn = ({ reactive: e, showPopper: t, popperElm: o, referenceElm: n, props: r, inject: i, popperJS: l, currentPlacement: a }) => e({
  popperJS: l,
  showPopper: t,
  popperElm: o,
  referenceElm: n,
  currentPlacement: a,
  timeout: null,
  focusing: !1,
  expectedState: void 0,
  tooltipId: lt("tiny-tooltip-", 4),
  tabindex: r.tabindex,
  xPlacement: "bottom",
  showContent: i("showContent", null),
  tipsMaxWidth: i("tips-max-width", null)
}), Fn = (e, {
  watch: t,
  toRefs: o,
  reactive: n,
  onBeforeUnmount: r,
  onDeactivated: i,
  onMounted: l,
  onUnmounted: a,
  inject: s
}, { vm: u, emit: f, slots: c, nextTick: p, parent: d }) => {
  const m = {}, v = {}, y = { emit: f, props: e, nextTick: p, toRefs: o, reactive: n, parent: d.$parent, vm: u, popperVmRef: v };
  Object.assign(y, { slots: c, onBeforeUnmount: r, onDeactivated: i, watch: t });
  const { showPopper: w, updatePopper: B, popperElm: g, referenceElm: P, doDestroy: C, popperJS: S, currentPlacement: A } = An(
    y
  ), M = Nn({
    reactive: n,
    showPopper: w,
    popperElm: g,
    referenceElm: P,
    props: e,
    inject: s,
    popperJS: S,
    currentPlacement: A
  });
  return Object.assign(m, {
    state: M,
    doDestroy: C,
    updatePopper: B,
    show: an({ api: m, state: M, props: e }),
    hide: un(m),
    destroyed: gn({ state: M, api: m, vm: u }),
    bindPopper: On({ vm: u, nextTick: p, popperVmRef: v }),
    watchFocusing: vn(M),
    removeFocusing: fn({ api: m, state: M }),
    handleBlur: dn({ api: m, state: M }),
    handleFocus: pn({ api: m, state: M }),
    debounceClose: bn({ api: m, props: e }),
    setExpectedState: yn({ state: M }),
    handleShowPopper: cn({ props: e, state: M }),
    handleClosePopper: mn({ api: m, props: e, state: M }),
    bindEvent: Sn({ api: m, state: M, vm: u }),
    focusHandler: wn({ slots: c, api: m }),
    handleDocumentClick: hn({ props: e, api: m, state: M, popperVmRef: v }),
    observeCallback: Cn({ state: M, popperVmRef: v })
  }), t(() => M.focusing, m.watchFocusing), t(
    () => e.modelValue,
    (fe) => p(() => e.manual && (M.showPopper = fe))
  ), l(() => {
    if (m.bindPopper(), e.genArrowByHtml) {
      const fe = { attributes: !0, childList: !1, subtree: !1 };
      m.observer = new MutationObserver(m.observeCallback), m.observer.observe(v.popper, fe);
    }
  }), u.$on("tooltip-update", m.bindPopper), a(() => {
    m.destroyed(), m.observer && m.observer.disconnect(), u.$off("tooltip-update");
  }), m;
};
function Me() {
  return Me = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var o = arguments[t];
      for (var n in o) ({}).hasOwnProperty.call(o, n) && (e[n] = o[n]);
    }
    return e;
  }, Me.apply(null, arguments);
}
var ge = /* @__PURE__ */ U({
  name: j + "Tooltip",
  componentName: "Tooltip",
  props: Me({}, de, {
    visible: {
      type: String,
      default: function() {
        return "always";
      },
      validator: function(t) {
        return ["always", "auto"].includes(t);
      }
    },
    adjustArrow: {
      type: Boolean,
      default: function() {
        return !1;
      }
    },
    appendToBody: {
      type: Boolean,
      default: function() {
        return !0;
      }
    },
    arrowOffset: {
      type: Number,
      default: function() {
        return 0;
      }
    },
    boundariesPadding: {
      type: Number,
      default: function() {
        return 5;
      }
    },
    closeDelay: {
      type: Number,
      default: function() {
        return 300;
      }
    },
    content: {
      type: [String, Object]
    },
    disabled: {
      type: Boolean
    },
    effect: {
      type: String,
      default: function() {
        return "dark";
      }
    },
    enterable: {
      type: Boolean,
      default: function() {
        return !0;
      }
    },
    hideAfter: {
      type: Number,
      default: function() {
        return 0;
      }
    },
    manual: {
      type: Boolean
    },
    modelValue: {
      type: Boolean
    },
    offset: {
      default: function() {
        return 0;
      }
    },
    openDelay: {
      type: Number,
      default: function() {
        return 0;
      }
    },
    placement: {
      type: String,
      default: function() {
        return "bottom";
      }
    },
    popper: {},
    popperClass: {
      type: String
    },
    popperOptions: {
      default: function() {
        return {
          gpuAcceleration: !1,
          boundariesPadding: 10
        };
      }
    },
    pre: {
      type: Boolean
    },
    reference: {},
    renderContent: {
      type: Function
    },
    tabindex: {
      type: Number,
      default: function() {
        return 0;
      }
    },
    transition: {
      type: String,
      default: function() {
        return "tiny-fade-in-linear";
      }
    },
    type: {
      type: String,
      validator: function(t) {
        return !!~["normal", "warning", "error", "info", "success"].indexOf(t);
      }
    },
    visibleArrow: {
      type: Boolean,
      default: function() {
        return !0;
      }
    },
    zIndex: {
      type: String,
      default: function() {
        return "next";
      }
    },
    contentMaxHeight: {
      type: String
    }
  }),
  setup: function(t, o) {
    return pe({
      props: t,
      context: o,
      renderless: Fn,
      api: Ln
    });
  },
  render: function() {
    var t = this, o = function(s) {
      var u = s.slots.content && s.slots.content();
      if (u && (!xe.Comment || u[0].type !== xe.Comment))
        return u;
      var f;
      return s.renderContent ? f = s.renderContent(ce, s.content) : s.pre ? f = s.content ? ce("pre", s.content) : null : f = s.content, f;
    };
    if (!Object.prototype.hasOwnProperty.call(this, "popperVM")) {
      var n = {
        value: null
      };
      this.d({
        popperVM: {
          get: function() {
            return n.value || (n.value = it({
              el: document.createElement("div"),
              propsData: null,
              component: {
                render: function() {
                  var u = o(t), f = typeof u == "string", c = {
                    attrs: {
                      name: t.transition
                    },
                    on: {
                      "after-leave": t.doDestroy
                    }
                  }, p = "is-" + (t.type || t.effect || "dark"), d = function() {
                    return t.setExpectedState(!0);
                  }, m = function() {
                    t.setExpectedState(!1), t.debounceClose();
                  };
                  return t.$nextTick(function() {
                    !t.disabled && t.state.showPopper && u && t.updatePopper();
                  }), ce("transition", c, [ue(H("div", {
                    ref: "popper",
                    id: t.state.tooltipId,
                    class: ["tiny-tooltip", "tiny-tooltip__popper", p, t.popperClass, {
                      "tiny-tooltip__show-tips": t.state.showContent
                    }],
                    style: "max-width:" + t.state.tipsMaxWidth + "px",
                    role: "tooltip",
                    "aria-hidden": t.disabled || !t.state.showPopper ? "true" : "false",
                    onMouseenter: function() {
                      return d();
                    },
                    onMouseleave: function() {
                      return m();
                    }
                  }, [f ? H("div", {
                    class: "tiny-tooltip__content-wrapper",
                    style: "max-height:" + t.contentMaxHeight
                  }, [u]) : u]), [[ve, !t.disabled && t.state.showPopper && u]])]);
                }
              }
            })), n.value;
          },
          set: function(s) {
            return n.value = s;
          }
        }
      });
    }
    var r = function() {
      var s = t.slots.default && t.slots.default();
      if (!Array.isArray(s)) return null;
      for (var u = null, f = 0; f < s.length; f++) {
        var c = ut(s[f]);
        if (!pt(c)) {
          u = c;
          break;
        }
      }
      return u;
    }, i = r();
    if (!i) return null;
    var l = i.data || i.props || (i.props = {});
    return l.class = st("tiny-tooltip " + at(l.class)), i;
  }
});
function Ee() {
  return Ee = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var o = arguments[t];
      for (var n in o) ({}).hasOwnProperty.call(o, n) && (e[n] = o[n]);
    }
    return e;
  }, Ee.apply(null, arguments);
}
var zn = function(t) {
  var o, n = typeof process == "object" ? (o = process.env) == null ? void 0 : o.TINY_MODE : null;
  return ge;
}, Hn = Ee({}, de, {
  visible: {
    type: String,
    default: function() {
      return "always";
    },
    validator: function(t) {
      return ["always", "auto"].includes(t);
    }
  },
  adjustArrow: {
    type: Boolean,
    default: function() {
      return !1;
    }
  },
  appendToBody: {
    type: Boolean,
    default: function() {
      return !0;
    }
  },
  arrowOffset: {
    type: Number,
    default: function() {
      return 0;
    }
  },
  content: {
    type: [String, Object]
  },
  disabled: {
    type: Boolean
  },
  enterable: {
    type: Boolean,
    default: function() {
      return !0;
    }
  },
  hideAfter: {
    type: Number,
    default: function() {
      return 0;
    }
  },
  manual: {
    type: Boolean
  },
  modelValue: {
    type: Boolean
  },
  offset: {
    default: function() {
      return 0;
    }
  },
  effect: {
    type: String,
    default: function() {
      return "";
    }
  },
  openDelay: {
    type: Number,
    default: function() {
      return 0;
    }
  },
  closeDelay: {
    type: Number,
    default: function() {
      return 100;
    }
  },
  placement: {
    type: String,
    default: function() {
      return "bottom";
    }
  },
  popper: {},
  popperClass: {
    type: String
  },
  popperOptions: {
    default: function() {
      return {};
    }
  },
  pre: {
    type: Boolean
  },
  reference: {},
  renderContent: {
    type: Function
  },
  tabindex: {
    type: Number,
    default: function() {
      return 0;
    }
  },
  transition: {
    type: String,
    default: function() {
      return "tiny-fade-in-linear";
    }
  },
  type: {
    type: String,
    validator: function(t) {
      return !!~["normal", "warning", "error", "info", "success"].indexOf(t);
    }
  },
  visibleArrow: {
    type: Boolean,
    default: function() {
      return !0;
    }
  },
  genArrowByHtml: {
    type: Boolean,
    default: function() {
      return !0;
    }
  },
  zIndex: {
    type: String,
    default: function() {
      return "next";
    }
  },
  contentMaxHeight: {
    type: String
  }
}), K = U({
  name: j + "Tooltip",
  componentName: "Tooltip",
  props: Hn,
  setup: function(t, o) {
    return Te({
      props: t,
      context: o,
      template: zn
    });
  }
}), Wn = "3.21.0";
K.model = {
  prop: "modelValue",
  event: "update:modelValue"
};
K.install = function(e) {
  e.component(K.name, K);
};
K.version = Wn;
const Rn = (e, t, ...o) => {
  let n = !1;
  if (typeof e == "function") {
    const r = document.createEvent("HTMLEvents");
    r.initEvent(t, !1, !0), r.preventDefault = () => {
      n = !0;
    }, o.unshift(r), o.unshift(t), e.apply(null, o);
  }
  return !n;
}, jn = ({ constants: e, props: t }) => () => t.rightSlide ? e.DIALOG_SLIDER_RIGHT : e.DIALOG_FADE, be = (e) => isNaN(Number(e)) ? e : e + "px", Un = ({ props: e, state: t, designConfig: o }) => () => {
  var n;
  let r = {}, { width: i, top: l, rightSlide: a, maxHeight: s } = e;
  return l === void 0 && (l = a ? "0" : (n = o == null ? void 0 : o.state) != null && n.top ? "" : "15vh"), i = be(i), l = be(l), s = be(s), t.isFull || (r.width = i, r.top = t.top || l, r.maxHeight = s, a ? (r.right = 0, r.height = "calc(100vh - " + r.top + ")") : r.left = t.left || "calc((100vw - " + i + ") / 2)"), t.dragStyle && (r = V(V({}, r), t.dragStyle), t.isFull && (r = { left: "0px", top: "0px" })), e.customStyle && (r = Object.assign(r, e.customStyle)), r;
}, Jn = ({
  api: e,
  constants: t,
  emit: o,
  nextTick: n,
  parent: r,
  props: i,
  vm: l,
  state: a
}) => (s) => {
  const u = r.$el;
  if (i.lockScroll && (s ? e.showScrollbar() : e.hideScrollbar()), a.move = !1, a.isFull = i.fullscreen, o("update:visible", s), s)
    a.closed = !1, o("open"), I(u, "scroll", e.updatePopper), n(() => {
      l.$refs.dialog.scrollTop = 0;
    }), i.appendToBody && document.body.appendChild(u);
  else if (D(u, "scroll", e.updatePopper), a.closed || (a.emitter.emit("boxclose", i.isFormReset), o("close")), i.destroyOnClose && n(() => a.key++), i.rightSlide && a.current !== "default") {
    const f = `[data-tag=${t.DIALOG_BOX_DATA_TAG}]`;
    i.rightSlide && (u.querySelector(f).style.left = "");
  }
}, Gn = ({ api: e, parent: t, props: o }) => () => {
  if (o.lockScroll && o.visible && e.showScrollbar(), o.visible) {
    const n = t.$el;
    e.open(), o.appendToBody && document.body.appendChild(n);
  }
}, Kn = ({ api: e, parent: t, props: o }) => () => {
  const n = t.$el;
  e.hideScrollbar(), o.appendToBody && n && n.parentNode && n.parentNode.removeChild(n);
}, Yn = ({ state: e }) => (t) => {
  e.mouseDownWrapperFlag = !1, /tiny-dialog-box__wrapper/.test(t.target.className) && t.type === "mousedown" && (e.mouseDownWrapperFlag = !0);
}, Xn = ({ state: e }) => (t) => {
  e.mouseUpWrapperFlag = !1, /tiny-dialog-box__wrapper/.test(t.target.className) && t.type === "mouseup" && (e.mouseUpWrapperFlag = !0);
}, Zn = ({ api: e, props: t, state: o }) => () => {
  t.closeOnClickModal && o.mouseDownWrapperFlag && o.mouseUpWrapperFlag && e.handleClose("mask");
}, qn = ({
  api: e,
  constants: t,
  emit: o,
  parent: n,
  props: r
}) => (i = "close") => {
  if (typeof r.beforeClose == "function" && r.beforeClose(i) === !1)
    return;
  const l = n.$el;
  if (r.rightSlide) {
    const a = l.querySelector(t.DIALOG_BOX_CLASS) || l;
    a.style.left = "";
  }
  Rn(o, "before-close", e.hide) && e.hide(i);
}, Qn = ({ api: e, emit: t, state: o, props: n }) => (r) => {
  r !== !1 && (o.emitter.emit("boxclose", n.isFormReset), t("update:visible", !1), t("change", !1), t("close", r), o.closed = !0, e.hideScrollbar());
}, er = ({ api: e, emit: t }) => () => {
  t("confirm"), e.handleClose("confirm");
}, tr = ({ api: e, emit: t }) => () => {
  t("cancel"), e.handleClose("cancel");
}, or = ({ api: e, constants: t }) => () => {
  e.broadcast(t.SELECT_DROPDOWN, "updatePopper"), e.broadcast(t.DROPDOWN_MENU, "updatePopper");
}, nr = (e) => () => {
  e("opened");
}, rr = (e) => () => {
  e("closed");
}, et = ({
  vm: e,
  componentList: t
}) => {
  const o = e.$children;
  return !o || o.length === 0 ? [] : (o.forEach((n) => {
    n.$options.componentName === "Select" && t.push(n), et({ vm: n, componentList: t });
  }), t);
}, lr = (e) => {
  et({ vm: e, componentList: [] }).forEach((t) => {
    t.state.visible = !1;
  });
}, ir = ({
  parent: e,
  props: t,
  state: o,
  emit: n,
  vm: r
}) => (i) => {
  if (!t.draggable || o.isFull)
    return;
  let l = r.$refs.dialog;
  i.preventDefault();
  let a = document.onmousemove, s = document.onmouseup, u = i.clientX - l.offsetLeft, f = i.clientY - l.offsetTop, { visibleHeight: c, visibleWidth: p } = dt();
  document.onmousemove = (d) => {
    d.preventDefault(), o.move || (n("drag-start", d), lr(e), o.move = !0);
    let m = l.offsetWidth, v = l.offsetHeight, y, w;
    if (t.dragOutsideWindow) {
      let B = p - 10, g = c - 10;
      y = d.clientX - u, w = d.clientY - f, y = d.clientX < 0 ? -u : y > B ? B : y, w = d.clientY < 0 ? -f : w > g ? g : w;
    } else {
      let B = Math.max(p - m, 0), g = Math.max(c - v, 0);
      y = d.clientX - u, w = d.clientY - f, y = y < 0 ? 0 : y > B ? B : y, w = w < 0 ? 0 : w > g ? g : w;
    }
    o.isFull || (o.dragStyle = { left: `${y}px`, top: `${w}px` }), o.left = `${y}px`, o.top = `${w}px`, o.emitter.emit("boxdrag"), n("drag-move", d);
  }, document.onmouseup = () => {
    document.onmousemove = a, document.onmouseup = s, t.draggable && o.move && n("drag-end", i), o.move = !1;
  };
}, sr = (e) => () => {
  R(document.body, e);
}, ar = (e) => () => {
  J(document.body, e);
}, ur = ({ state: e, emit: t, nextTick: o, vm: n }) => (r) => {
  e.isFull = r, o(() => {
    t("resize", { fullscreen: r, dialog: n.$refs.dialog });
  });
};
let pr = 1;
const dr = typeof window > "u", fr = ({
  onMounted: e,
  onBeforeUnmount: t,
  watch: o,
  vm: n,
  api: r,
  props: i,
  state: l,
  nextTick: a
}) => {
  e(() => {
    n._popupId = `popup-${pr++}`, T.register(n._popupId, n);
  }), t(() => {
    T.deregister(n._popupId), T.closeModal(n._popupId);
  }), o(
    () => i.visible,
    (s) => {
      if (s) {
        if (n._opening)
          return;
        l.rendered ? r.open() : (l.rendered = !0, a(() => {
          r.open();
        }));
      } else
        r.close();
    }
  );
}, cr = ({ state: e, vm: t }) => (o) => {
  e.rendered || (e.rendered = !0);
  const n = ft({}, t.$props || t, o);
  t._closeTimer && (clearTimeout(t._closeTimer), t._closeTimer = null), clearTimeout(t._openTimer);
  const r = () => {
    if (dr || e.opened)
      return;
    t._opening = !0;
    const l = t.$el, a = n.modal, s = n.zIndex;
    s && (T.zIndex = s), a && (t._closing && (T.closeModal(t._popupId), t._closing = !1), T.openModal(
      t._popupId,
      T.nextZIndex(),
      n.modalAppendToBody ? void 0 : l,
      n.modalClass,
      n.modalFade
    ), n.lockScroll && (T.fixBodyBorder(), R(document.body, T.popLockClass))), getComputedStyle(l).position === "static" && (l.style.position = "absolute"), l.style.zIndex = T.nextZIndex().toString(), e.opened = !0, t._opening = !1;
  }, i = Number(n.openDelay);
  i > 0 ? t._openTimer = setTimeout(() => {
    t._openTimer = null, r();
  }, i) : r();
}, mr = ({ state: e, vm: t }) => () => {
  t._openTimer !== null && (clearTimeout(t._openTimer), t._openTimer = null), clearTimeout(t._closeTimer);
  const o = () => {
    t._closing = !0, e.opened = !1, T.closeModal(t._popupId), t._closing = !1;
  }, n = Number(t.closeDelay);
  n > 0 ? t._closeTimer = setTimeout(() => {
    t._closeTimer = null, o();
  }, n) : o();
};
var hr = (e) => {
  const { api: t, nextTick: o, onBeforeUnmount: n, onMounted: r, props: i, reactive: l, toRefs: a, vm: s, watch: u } = e, f = l({
    opened: !1,
    rendered: !1
  });
  fr({ onMounted: r, onBeforeUnmount: n, watch: u, vm: s, api: t, props: i, state: f, nextTick: o });
  const c = cr({ state: f, vm: s }), p = mr({ state: f, vm: s });
  return V({ open: c, close: p, PopupManager: T }, a(f));
};
const yr = [
  "afterEnter",
  "afterLeave",
  "handleClose",
  "handleWrapperClick",
  "useMouseEventDown",
  "useMouseEventUp",
  "handleCancel",
  "handleConfirm",
  "handleDrag",
  "toggleFullScreen",
  "state"
], gr = ({
  reactive: e,
  computed: t,
  api: o,
  emitter: n,
  props: r,
  useBreakpoint: i
}) => {
  const { current: l } = i();
  return e({
    emitter: n(),
    key: 0,
    x: null,
    y: null,
    top: null,
    left: null,
    max: null,
    move: !1,
    closed: !1,
    dragable: !1,
    isFull: r.fullscreen,
    style: t(() => o.computedStyle()),
    animationName: t(() => o.computedAnimationName()),
    current: l,
    dragStyle: null
  });
}, br = ({ reactive: e, state: t, toRefs: o, usePopups: n }) => {
  const { opened: r, rendered: i } = n;
  return e(V({
    opened: r,
    rendered: i
  }, o(t)));
}, vr = ({
  emit: e,
  api: t,
  state: o,
  parent: n,
  props: r,
  lockScrollClass: i,
  constants: l,
  usePopups: a,
  nextTick: s,
  broadcast: u,
  designConfig: f,
  vm: c
}) => {
  const { open: p, close: d } = a;
  Object.assign(t, {
    state: o,
    open: p,
    close: d,
    broadcast: u,
    handleCancel: tr({ api: t, emit: e }),
    handleConfirm: er({ api: t, emit: e }),
    updatePopper: or({ api: t, constants: l }),
    handleWrapperClick: Zn({ api: t, props: r, state: o }),
    useMouseEventDown: Yn({ state: o }),
    useMouseEventUp: Xn({ state: o }),
    hide: Qn({ api: t, emit: e, state: o, props: r }),
    handleClose: qn({ api: t, constants: l, emit: e, parent: n, props: r }),
    watchVisible: Jn({
      api: t,
      constants: l,
      emit: e,
      nextTick: s,
      parent: n,
      props: r,
      vm: c,
      state: o
    }),
    computedStyle: Un({ state: o, props: r, designConfig: f }),
    mounted: Gn({ api: t, parent: n, props: r }),
    unMounted: Kn({ api: t, parent: n, props: r }),
    computedAnimationName: jn({ constants: l, props: r }),
    afterEnter: nr(e),
    afterLeave: rr(e),
    hideScrollbar: ar(i),
    showScrollbar: sr(i),
    handleDrag: ir({ parent: n, props: r, state: o, emit: e, vm: c }),
    // tiny 新增
    toggleFullScreen: ur({ state: o, emit: e, nextTick: s, vm: c })
  });
}, wr = ({ watch: e, state: t, api: o, props: n }) => {
  e(() => n.visible, o.watchVisible), e(
    () => n.fullscreen,
    (r) => {
      t.isFull = r;
    }
  );
}, Sr = (e, { computed: t, onBeforeUnmount: o, onMounted: n, toRefs: r, reactive: i, watch: l }, {
  vm: a,
  emitter: s,
  parent: u,
  emit: f,
  constants: c,
  nextTick: p,
  mode: d,
  broadcast: m,
  designConfig: v,
  useBreakpoint: y
}) => {
  const w = {}, B = c.SCROLL_LOCK_CLASS(d);
  let g = gr({ reactive: i, computed: t, api: w, emitter: s, props: e, useBreakpoint: y });
  const P = hr({
    api: w,
    nextTick: p,
    onBeforeUnmount: o,
    onMounted: n,
    props: e,
    reactive: i,
    toRefs: r,
    vm: a,
    watch: l
  });
  return vr({
    api: w,
    state: g,
    parent: u,
    props: e,
    emit: f,
    constants: c,
    usePopups: P,
    lockScrollClass: B,
    nextTick: p,
    vm: a,
    broadcast: m,
    designConfig: v
  }), g = br({ reactive: i, state: g, toRefs: r, usePopups: P }), wr({ watch: l, state: g, api: w, props: e }), n(w.mounted), o(w.unMounted), w;
};
function Cr(e, t) {
  var o = typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (o) return (o = o.call(e)).next.bind(o);
  if (Array.isArray(e) || (o = Or(e)) || t) {
    o && (e = o);
    var n = 0;
    return function() {
      return n >= e.length ? { done: !0 } : { done: !1, value: e[n++] };
    };
  }
  throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Or(e, t) {
  if (e) {
    if (typeof e == "string") return We(e, t);
    var o = {}.toString.call(e).slice(8, -1);
    return o === "Object" && e.constructor && (o = e.constructor.name), o === "Map" || o === "Set" ? Array.from(e) : o === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o) ? We(e, t) : void 0;
  }
}
function We(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var o = 0, n = Array(t); o < t; o++) n[o] = e[o];
  return n;
}
var _r = function(t, o) {
  for (var n = t.__vccOpts || t, r = Cr(o), i; !(i = r()).done; ) {
    var l = i.value, a = l[0], s = l[1];
    n[a] = s;
  }
  return n;
}, Mr = U({
  components: {
    IconClose: Ke(),
    IconFullscreen: Kt(),
    IconMinscreen: eo()
  },
  emits: [
    "update:visible",
    "change",
    "before-close",
    "open",
    "close",
    "opened",
    "confirm",
    "cancel",
    "closed",
    "drag-start",
    "drag-move",
    "drag-end",
    // tiny 新增
    "resize"
  ],
  props: [].concat(Je, ["resize", "isFormReset", "visible", "title", "modal", "modalAppendToBody", "appendToBody", "lockScroll", "closeOnClickModal", "closeOnPressEscape", "showClose", "width", "fullscreen", "top", "center", "draggable", "dragOutsideWindow", "showHeader", "rightSlide", "destroyOnClose", "dialogClass", "beforeClose", "maxHeight", "dialogTransition", "customStyle", "noAnimation"]),
  model: {
    prop: "visible",
    event: "update:visible"
  },
  provide: function() {
    return {
      dialog: this
    };
  },
  setup: function(t, o) {
    return pe({
      props: t,
      context: o,
      renderless: Sr,
      api: yr
    });
  }
}), Er = ["data-dialog-box-draggable"], Br = {
  class: "tiny-dialog-box__title"
}, Ir = {
  class: "tiny-dialog-box__btn-tools"
}, Tr = {
  class: "tiny-dialog-box__body"
}, $r = {
  key: 1,
  ref: "footer",
  class: "tiny-dialog-box__footer"
};
function xr(e, t, o, n, r, i) {
  var l = z("icon-fullscreen"), a = z("icon-minscreen"), s = z("icon-close");
  return h(), k(we, {
    duration: e.noAnimation ? 0 : void 0,
    name: e.state.animationName,
    onAfterEnter: e.afterEnter,
    onAfterLeave: e.afterLeave,
    persisted: ""
  }, {
    default: F(function() {
      return [ue(_(
        "div",
        {
          class: te(["tiny-dialog-box__wrapper", e.dialogClass]),
          onClick: t[4] || (t[4] = Se(function() {
            return e.handleWrapperClick && e.handleWrapperClick.apply(e, arguments);
          }, ["self"])),
          onMouseup: t[5] || (t[5] = function() {
            return e.useMouseEventUp && e.useMouseEventUp.apply(e, arguments);
          }),
          onMousedown: t[6] || (t[6] = function() {
            return e.useMouseEventDown && e.useMouseEventDown.apply(e, arguments);
          })
        },
        [H(we, {
          name: e.dialogTransition
        }, {
          default: F(function() {
            return [!e.destroyOnClose || e.visible ? ue((h(), b("div", {
              ref: "dialog",
              class: te([[{
                "is-fullscreen": e.state.isFull,
                "is-center": e.center,
                "is-right-slide": e.rightSlide
              }], "tiny-dialog-box"]),
              style: ht(e.state.style),
              "data-tag": "tiny-dialog-box",
              "data-dialog-box-draggable": e.draggable,
              key: e.state.key
            }, [e.showHeader ? (h(), b(
              "div",
              {
                key: 0,
                ref: "header",
                class: "tiny-dialog-box__header",
                onMousedown: t[3] || (t[3] = function() {
                  return e.handleDrag && e.handleDrag.apply(e, arguments);
                })
              },
              [L(e.$slots, "title", {}, function() {
                return [_(
                  "span",
                  Br,
                  x(e.title),
                  1
                  /* TEXT */
                )];
              }), _("div", Ir, [e.resize && !e.state.isFull ? (h(), b("button", {
                key: 0,
                type: "button",
                class: "tiny-dialog-box__headerbtn",
                "aria-label": "Resize",
                onClick: t[0] || (t[0] = function(u) {
                  return e.toggleFullScreen(!0);
                })
              }, [H(l, {
                class: "tiny-svg-size tiny-dialog-box__resize"
              })])) : O("v-if", !0), e.resize && e.state.isFull ? (h(), b("button", {
                key: 1,
                type: "button",
                class: "tiny-dialog-box__headerbtn",
                "aria-label": "Resize",
                onClick: t[1] || (t[1] = function(u) {
                  return e.toggleFullScreen(!1);
                })
              }, [H(a, {
                class: "tiny-svg-size tiny-dialog-box__resize"
              })])) : O("v-if", !0), e.showClose ? (h(), b("button", {
                key: 2,
                type: "button",
                class: "tiny-dialog-box__headerbtn",
                "aria-label": "Close",
                onClick: t[2] || (t[2] = function(u) {
                  return e.handleClose("close", u);
                })
              }, [H(s, {
                class: "tiny-svg-size tiny-dialog-box__close"
              })])) : O("v-if", !0)])],
              544
              /* NEED_HYDRATION, NEED_PATCH */
            )) : O("v-if", !0), _("div", Tr, [L(e.$slots, "default")]), e.slots.footer ? (h(), b(
              "div",
              $r,
              [L(e.$slots, "footer", {
                beforeClose: e.beforeClose
              })],
              512
              /* NEED_PATCH */
            )) : O("v-if", !0)], 14, Er)), [[ve, e.visible]]) : O("v-if", !0)];
          }),
          _: 3
          /* FORWARDED */
        }, 8, ["name"])],
        34
        /* CLASS, NEED_HYDRATION */
      ), [[ve, e.visible]])];
    }),
    _: 3
    /* FORWARDED */
  }, 8, ["duration", "name", "onAfterEnter", "onAfterLeave"]);
}
var re = /* @__PURE__ */ _r(Mr, [["render", xr]]);
function Be() {
  return Be = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var o = arguments[t];
      for (var n in o) ({}).hasOwnProperty.call(o, n) && (e[n] = o[n]);
    }
    return e;
  }, Be.apply(null, arguments);
}
var Dr = function(t) {
  var o, n = typeof process == "object" ? (o = process.env) == null ? void 0 : o.TINY_MODE : null;
  return re;
}, kr = {
  DIALOG_SLIDER_RIGHT: "dialog-slideRight",
  DIALOG_FADE: "dialog-fade",
  SELECT_DROPDOWN: j + "SelectDropdown",
  DROPDOWN_MENU: j + "DropdownMenu",
  DIALOG_BOX_CLASS: "div.tiny-dialog-box",
  PC_SCROLL_LOCK_CLASS: "dialog-box__scroll-lock",
  MOBILE_SCROLL_LOCK_CLASS: "mobile-dialog-box__scroll-lock",
  DIALOG_BOX_DATA_TAG: "tiny-dialog-box",
  Mode: "pc",
  SCROLL_LOCK_CLASS: function(t) {
    return t === this.Mode ? this.PC_SCROLL_LOCK_CLASS : this.MOBILE_SCROLL_LOCK_CLASS;
  }
}, Pr = Be({}, de, {
  _constants: {
    type: Object,
    default: function() {
      return kr;
    }
  },
  appendToBody: {
    type: Boolean,
    default: function() {
      return !1;
    }
  },
  beforeClose: Function,
  center: {
    type: Boolean,
    default: function() {
      return !1;
    }
  },
  closeOnClickModal: {
    type: Boolean,
    default: function() {
      return !0;
    }
  },
  closeOnPressEscape: {
    type: Boolean,
    default: function() {
      return !0;
    }
  },
  destroyOnClose: {
    type: Boolean,
    default: function() {
      return !1;
    }
  },
  dialogClass: {
    type: String,
    default: function() {
      return "";
    }
  },
  draggable: {
    type: Boolean,
    default: function() {
      return !1;
    }
  },
  dragOutsideWindow: {
    type: Boolean,
    default: function() {
      return !1;
    }
  },
  fullscreen: {
    type: Boolean,
    default: function() {
      return !1;
    }
  },
  isFormReset: {
    type: Boolean,
    default: function() {
      return !0;
    }
  },
  lockScroll: {
    type: Boolean,
    default: function() {
      return !0;
    }
  },
  modal: {
    type: Boolean,
    default: function() {
      return !0;
    }
  },
  modalAppendToBody: {
    type: Boolean,
    default: function() {
      return !0;
    }
  },
  resize: {
    type: Boolean,
    default: function() {
      return !1;
    }
  },
  rightSlide: {
    type: Boolean,
    default: function() {
      return !1;
    }
  },
  showClose: {
    type: Boolean,
    default: function() {
      return !0;
    }
  },
  showHeader: {
    type: Boolean,
    default: function() {
      return !0;
    }
  },
  title: {
    type: String,
    default: function() {
      return "";
    }
  },
  top: String,
  visible: {
    type: Boolean,
    default: function() {
      return !1;
    }
  },
  width: {
    type: String,
    default: function() {
      return "500px";
    }
  },
  maxHeight: {
    type: String,
    default: function() {
      return "";
    }
  },
  dialogTransition: {
    type: String,
    default: ""
  },
  noAnimation: {
    type: Boolean,
    default: !1
  },
  customStyle: {
    type: Object,
    default: function() {
      return {};
    }
  }
}), Q = U({
  name: j + "DialogBox",
  model: {
    prop: "visible",
    event: "update:visible"
  },
  props: Pr,
  setup: function(t, o) {
    return Te({
      props: t,
      context: o,
      template: Dr
    });
  }
}), Vr = "3.21.0";
Q.install = function(e) {
  e.component(Q.name, Q);
};
Q.version = Vr;
function Ar(e, t) {
  var o = typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (o) return (o = o.call(e)).next.bind(o);
  if (Array.isArray(e) || (o = Lr(e)) || t) {
    o && (e = o);
    var n = 0;
    return function() {
      return n >= e.length ? { done: !0 } : { done: !1, value: e[n++] };
    };
  }
  throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Lr(e, t) {
  if (e) {
    if (typeof e == "string") return Re(e, t);
    var o = {}.toString.call(e).slice(8, -1);
    return o === "Object" && e.constructor && (o = e.constructor.name), o === "Map" || o === "Set" ? Array.from(e) : o === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o) ? Re(e, t) : void 0;
  }
}
function Re(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var o = 0, n = Array(t); o < t; o++) n[o] = e[o];
  return n;
}
var tt = function(t, o) {
  for (var n = t.__vccOpts || t, r = Ar(o), i; !(i = r()).done; ) {
    var l = i.value, a = l[0], s = l[1];
    n[a] = s;
  }
  return n;
}, Nr = U({
  name: j + "TallStorage",
  inheritAttrs: !1,
  props: {
    isMemoryStorage: Boolean,
    localstorageData: Array
  },
  setup: function(t, o) {
    return pe({
      props: t,
      context: o,
      renderless: sn,
      api: ln
    });
  }
}), Fr = {
  class: "tiny-storage-list-style"
}, zr = ["onClick"];
function Hr(e, t, o, n, r, i) {
  return h(), b(
    "div",
    {
      class: "tiny-tall-storage",
      onMousedown: t[1] || (t[1] = function() {
        return e.mousedown && e.mousedown.apply(e, arguments);
      })
    },
    [_("div", Fr, [_(
      "ul",
      {
        onKeydown: t[0] || (t[0] = gt(function() {
          return e.keydownEvent && e.keydownEvent.apply(e, arguments);
        }, ["enter"])),
        class: "tiny-storage-list"
      },
      [(h(!0), b(
        Ce,
        null,
        bt(e.localstorageData, function(l) {
          return h(), b("li", {
            key: l,
            class: te(["tiny-storage-item", [e.state.hoverValue === l ? "item-hover" : ""]]),
            onClick: function(s) {
              return e.selectItem(l);
            }
          }, x(l), 11, zr);
        }),
        128
        /* KEYED_FRAGMENT */
      ))],
      32
      /* NEED_HYDRATION */
    )])],
    32
    /* NEED_HYDRATION */
  );
}
var Wr = /* @__PURE__ */ tt(Nr, [["render", Hr]]), Rr = U({
  inheritAttrs: !1,
  // 勿删，兼容灵雀特殊场景,MR#1861
  emits: ["update:modelValue", "change", "clear", "focus", "blur", "keyup", "keydown", "paste", "mouseenter", "mouseleave", "click", "input"],
  directives: mt({
    Clickoutside: rn
  }),
  components: {
    IconClose: Ke(),
    IconEyeopen: Wt(),
    IconEyeclose: Vt(),
    TinyTallStorage: Wr,
    TinyTooltip: K,
    TinyButton: ct,
    TinyDialogBox: Q
  },
  props: [].concat(Je, ["name", "size", "form", "type", "mask", "label", "modelValue", "height", "resize", "counter", "autosize", "disabled", "readonly", "tabindex", "clearable", "suffixIcon", "prefixIcon", "autocomplete", "showPassword", "memorySpace", "validateEvent", "showWordLimit", "displayOnly", "displayOnlyContent", "frontClearIcon", "showEmptyValue", "hoverExpand", "popupMore", "showTooltip", "inputBoxType"]),
  setup: function(t, o) {
    return pe({
      props: t,
      context: o,
      renderless: tn,
      api: Xo
    });
  }
}), jr = {
  key: 0,
  class: "tiny-input-group__prepend",
  ref: "prepend"
}, Ur = {
  class: "tiny-input-display-only"
}, Jr = {
  key: 0,
  class: "tiny-input-display-only__content"
}, Gr = {
  key: 1,
  class: "tiny-input-display-only__mask"
}, Kr = {
  class: "tiny-input-display-only__mask-text"
}, Yr = {
  key: 2,
  class: "tiny-input-display-only__content"
}, Xr = ["name", "tabindex", "type", "disabled", "readonly", "unselectable", "autocomplete", "aria-label"], Zr = {
  key: 2,
  class: "tiny-input__prefix",
  ref: "prefix"
}, qr = {
  key: 0,
  class: "tiny-input__suffix",
  ref: "suffix"
}, Qr = {
  class: "tiny-input__suffix-inner"
}, el = {
  key: 5,
  class: "tiny-input__count"
}, tl = {
  class: "tiny-input__count-inner"
}, ol = {
  class: "tiny-input__count-text-length"
}, nl = {
  class: "tiny-input__count-upper-limit"
}, rl = {
  key: 3,
  class: "tiny-input-group__append",
  ref: "append"
}, ll = {
  key: 4,
  class: "tiny-input-group__panel",
  ref: "panel"
}, il = {
  class: "tiny-textarea-display-only__wrap"
}, sl = {
  ref: "textBox",
  class: "tiny-textarea-display-only__content text-box"
}, al = ["tabindex", "disabled", "readonly", "unselectable", "autocomplete", "aria-label"], ul = {
  key: 2,
  class: "tiny-input__count"
}, pl = {
  class: "tiny-input__count-inner"
}, dl = {
  class: "tiny-input__count-text-length"
}, fl = {
  class: "tiny-input__count-upper-limit"
};
function cl(e, t, o, n, r, i) {
  var l = z("tiny-tooltip"), a = z("tiny-tall-storage"), s = z("icon-close"), u = z("tiny-button"), f = z("tiny-dialog-box"), c = yt("clickoutside");
  return h(), b(
    "div",
    me(e.a(e.$attrs, ["class"]), {
      class: [e.$attrs.class, e.type === "textarea" ? "tiny-textarea" : "tiny-input", e.state.inputSize ? "tiny-input-" + e.state.inputSize : "", {
        "is-disabled": e.state.inputDisabled,
        "is-exceed": e.state.inputExceed,
        "tiny-input-group": e.slots.prepend || e.slots.append,
        "tiny-input-group-append": e.slots.append,
        "tiny-input-group-prepend": e.slots.prepend,
        "tiny-input-prefix": e.slots.prefix || e.prefixIcon,
        "tiny-input-suffix": e.slots.suffix || e.suffixIcon || e.clearable || e.showPassword || e.mask && e.state.inputDisabled,
        "tiny-input-word-limit": e.state.isWordLimitVisible,
        "is-display-only": e.state.isDisplayOnly,
        "tiny-input-underline": e.inputBoxType === "underline"
      }],
      onMouseenter: t[32] || (t[32] = function(p) {
        e.state.hovering = !0, e.$emit("mouseenter", p);
      }),
      onMouseleave: t[33] || (t[33] = function(p) {
        e.state.hovering = !1, e.$emit("mouseleave", p);
      }),
      onClick: t[34] || (t[34] = function(p) {
        return e.$emit("click", p);
      })
    }),
    [e.type !== "textarea" ? (h(), b(
      Ce,
      {
        key: 0
      },
      [e.slots.prepend ? (h(), b(
        "div",
        jr,
        [L(e.$slots, "prepend")],
        512
        /* NEED_PATCH */
      )) : O("v-if", !0), _("span", Ur, [e.state.isDisplayOnly ? (h(), k(l, {
        key: 0,
        disabled: !e.showTooltip,
        effect: "light",
        content: e.state.displayOnlyTooltip,
        placement: "top",
        "popper-class": e.state.tooltipConfig.popperClass || "",
        onMouseenter: e.handleEnterDisplayOnlyContent
      }, {
        default: F(function() {
          return [e.type === "password" ? (h(), b(
            "span",
            Jr,
            x(e.state.hiddenPassword),
            1
            /* TEXT */
          )) : e.mask ? (h(), b("span", Gr, [_(
            "span",
            Kr,
            x(e.state.displayedMaskValue),
            1
            /* TEXT */
          ), (h(), k(Y(e.state.maskValueVisible ? "icon-eyeopen" : "icon-eyeclose"), {
            onClick: t[0] || (t[0] = function(p) {
              return e.state.maskValueVisible = !e.state.maskValueVisible;
            })
          }))])) : (h(), b(
            "span",
            Yr,
            x(e.state.displayOnlyText),
            1
            /* TEXT */
          ))];
        }),
        _: 1
        /* STABLE */
      }, 8, ["disabled", "content", "popper-class", "onMouseenter"])) : O("v-if", !0), e.type !== "textarea" ? (h(), b("input", me({
        key: 1,
        ref: "input",
        name: e.name,
        "data-tag": "tiny-input-inner"
      }, e.a(e.$attrs, ["type", "class", "style", "^on[A-Z]", "id"]), {
        class: ["tiny-input__inner", e.mask && e.state.inputDisabled && !e.state.maskValueVisible && "tiny-input__mask"],
        tabindex: e.tabindex,
        type: e.showPassword ? e.state.passwordVisible ? "text" : "password" : e.type,
        disabled: e.state.inputDisabled,
        readonly: e.readonly,
        unselectable: e.readonly ? "on" : "off",
        autocomplete: e.autocomplete,
        onCompositionend: t[1] || (t[1] = function() {
          return e.handleCompositionEnd && e.handleCompositionEnd.apply(e, arguments);
        }),
        onCompositionupdate: t[2] || (t[2] = function() {
          return e.handleCompositionUpdate && e.handleCompositionUpdate.apply(e, arguments);
        }),
        onCompositionstart: t[3] || (t[3] = function() {
          return e.handleCompositionStart && e.handleCompositionStart.apply(e, arguments);
        }),
        onBlur: t[4] || (t[4] = function() {
          return e.handleBlur && e.handleBlur.apply(e, arguments);
        }),
        onFocus: t[5] || (t[5] = function() {
          return e.handleFocus && e.handleFocus.apply(e, arguments);
        }),
        onInput: t[6] || (t[6] = function() {
          return e.handleInput && e.handleInput.apply(e, arguments);
        }),
        onChange: t[7] || (t[7] = function() {
          return e.handleChange && e.handleChange.apply(e, arguments);
        }),
        "aria-label": e.label,
        onKeyup: t[8] || (t[8] = function(p) {
          return e.$emit("keyup", p);
        }),
        onKeydown: t[9] || (t[9] = function(p) {
          return e.$emit("keydown", p);
        }),
        onPaste: t[10] || (t[10] = function(p) {
          return e.$emit("paste", p);
        })
      }), null, 16, Xr)) : O("v-if", !0)]), e.isMemoryStorage ? (h(), k(a, {
        key: 1,
        name: e.name,
        "localstorage-data": e.storageData,
        "is-memory-storage": e.isMemoryStorage,
        onSelected: e.selectedMemory
      }, null, 8, ["name", "localstorage-data", "is-memory-storage", "onSelected"])) : O("v-if", !0), !e.state.isDisplayOnly && (e.slots.prefix || e.prefixIcon) ? (h(), b(
        "span",
        Zr,
        [L(e.$slots, "prefix"), e.prefixIcon ? (h(), k(Y(e.prefixIcon), {
          key: 0,
          class: "tiny-svg-size tiny-input__icon"
        })) : O("v-if", !0)],
        512
        /* NEED_PATCH */
      )) : O("v-if", !0), _("div", null, [H(we, {
        name: "tiny-transition-icon-out-in"
      }, {
        default: F(function() {
          return [!e.state.isDisplayOnly && e.getSuffixVisible() ? (h(), b(
            "span",
            qr,
            [_("span", Qr, [e.frontClearIcon && e.state.showClear ? (h(), k(s, {
              key: 0,
              class: "tiny-svg-size tiny-input__icon tiny-input__clear",
              onMousedown: t[11] || (t[11] = Se(function() {
              }, ["prevent"])),
              onClick: e.clear
            }, null, 8, ["onClick"])) : O("v-if", !0), !e.state.showClear || !e.state.showPwdVisible || !e.state.isWordLimitVisible ? (h(), b(
              Ce,
              {
                key: 1
              },
              [L(e.$slots, "suffix"), e.suffixIcon ? (h(), k(Y(e.suffixIcon), {
                key: 0,
                class: "tiny-svg-size tiny-input__icon"
              })) : O("v-if", !0)],
              64
              /* STABLE_FRAGMENT */
            )) : O("v-if", !0), !e.frontClearIcon && e.state.showClear ? (h(), k(s, {
              key: 2,
              class: "tiny-svg-size tiny-input__icon tiny-input__clear",
              onMousedown: t[12] || (t[12] = Se(function() {
              }, ["prevent"])),
              onClick: e.clear
            }, null, 8, ["onClick"])) : O("v-if", !0), e.showPassword ? (h(), k(Y(e.state.passwordVisible ? "icon-eyeopen" : "icon-eyeclose"), {
              key: 3,
              class: "tiny-svg-size tiny-input__icon",
              onClick: e.handlePasswordVisible
            }, null, 8, ["onClick"])) : O("v-if", !0), e.mask && e.state.inputDisabled ? (h(), k(Y(e.state.maskValueVisible ? "icon-eyeopen" : "icon-eyeclose"), {
              key: 4,
              class: "tiny-svg-size tiny-input__icon",
              onClick: t[13] || (t[13] = function(p) {
                return e.state.maskValueVisible = !e.state.maskValueVisible;
              })
            })) : O("v-if", !0), e.state.isWordLimitVisible ? (h(), b("span", el, [_("span", tl, [_(
              "span",
              ol,
              x(e.state.showWordLimit ? "" + e.state.textLength : ""),
              1
              /* TEXT */
            ), _(
              "span",
              nl,
              x(e.state.showWordLimit ? "/" + e.state.upperLimit : e.state.textLength),
              1
              /* TEXT */
            )])])) : O("v-if", !0)]), e.state.validateState ? (h(), b(
              "i",
              {
                key: 0,
                class: te(["tiny-input__icon", ["tiny-input__validateIcon", e.validateIcon]])
              },
              null,
              2
              /* CLASS */
            )) : O("v-if", !0)],
            512
            /* NEED_PATCH */
          )) : O("v-if", !0)];
        }),
        _: 3
        /* FORWARDED */
      })]), e.slots.append ? (h(), b(
        "div",
        rl,
        [L(e.$slots, "append")],
        512
        /* NEED_PATCH */
      )) : O("v-if", !0), e.slots.panel ? (h(), b(
        "div",
        ll,
        [L(e.$slots, "panel")],
        512
        /* NEED_PATCH */
      )) : O("v-if", !0)],
      64
      /* STABLE_FRAGMENT */
    )) : (h(), b(
      "span",
      {
        key: 1,
        class: te(["tiny-textarea-display-only", e.hoverExpand && "tiny-textarea__inner-con"])
      },
      [e.state.isDisplayOnly ? (h(), k(l, {
        key: 0,
        disabled: !e.showTooltip,
        pre: "",
        effect: "light",
        content: e.state.displayOnlyTooltip,
        placement: "top",
        "popper-class": e.state.tooltipConfig.popperClass || "",
        onMouseenter: t[15] || (t[15] = function(p) {
          return e.handleEnterDisplayOnlyContent(p, "textarea");
        })
      }, {
        default: F(function() {
          return [_("div", il, [_(
            "span",
            sl,
            [e.state.showMoreBtn ? (h(), b(
              "span",
              {
                key: 0,
                onClick: t[14] || (t[14] = function(p) {
                  return e.state.showDisplayOnlyBox = !0;
                }),
                class: "more-btn"
              },
              x(e.t("ui.input.more")) + ">",
              1
              /* TEXT */
            )) : O("v-if", !0), _(
              "span",
              null,
              x(e.state.displayOnlyText),
              1
              /* TEXT */
            )],
            512
            /* NEED_PATCH */
          )])];
        }),
        _: 1
        /* STABLE */
      }, 8, ["disabled", "content", "popper-class"])) : O("v-if", !0), e.state.isDisplayOnly && e.popupMore ? (h(), k(f, {
        key: 1,
        title: e.t("ui.input.detail"),
        visible: e.state.showDisplayOnlyBox,
        "append-to-body": !0,
        "onUpdate:visible": t[17] || (t[17] = function(p) {
          return e.state.showDisplayOnlyBox = p;
        })
      }, {
        footer: F(function() {
          return [H(u, {
            onClick: t[16] || (t[16] = function(p) {
              return e.state.showDisplayOnlyBox = !1;
            })
          }, {
            default: F(function() {
              return [De(
                x(e.t("ui.input.close")),
                1
                /* TEXT */
              )];
            }),
            _: 1
            /* STABLE */
          })];
        }),
        default: F(function() {
          return [_(
            "div",
            null,
            x(e.state.displayOnlyText),
            1
            /* TEXT */
          )];
        }),
        _: 1
        /* STABLE */
      }, 8, ["title", "visible"])) : O("v-if", !0), ue((h(), b("textarea", me({
        ref: "textarea"
      }, e.a(e.$attrs, ["type", "class", "style", "id"]), {
        tabindex: e.tabindex,
        class: ["tiny-textarea__inner", e.hoverExpand && !e.state.enteredTextarea && "tiny-textarea__fix-height"],
        onCompositionstart: t[18] || (t[18] = function() {
          return e.handleCompositionStart && e.handleCompositionStart.apply(e, arguments);
        }),
        onCompositionupdate: t[19] || (t[19] = function() {
          return e.handleCompositionUpdate && e.handleCompositionUpdate.apply(e, arguments);
        }),
        onCompositionend: t[20] || (t[20] = function() {
          return e.handleCompositionEnd && e.handleCompositionEnd.apply(e, arguments);
        }),
        onInput: t[21] || (t[21] = function() {
          return e.handleInput && e.handleInput.apply(e, arguments);
        }),
        disabled: e.state.inputDisabled,
        readonly: e.readonly,
        unselectable: e.readonly ? "on" : "off",
        autocomplete: e.autocomplete,
        style: e.state.textareaStyle,
        onFocus: t[22] || (t[22] = function() {
          return e.handleFocus && e.handleFocus.apply(e, arguments);
        }),
        onBlur: t[23] || (t[23] = function() {
          return e.handleBlur && e.handleBlur.apply(e, arguments);
        }),
        onChange: t[24] || (t[24] = function() {
          return e.handleChange && e.handleChange.apply(e, arguments);
        }),
        onMouseenter: t[25] || (t[25] = function(p) {
          return e.handleEnterTextarea(p);
        }),
        onMouseleave: t[26] || (t[26] = function(p) {
          return e.handleLeaveTextarea(p);
        }),
        onMousedown: t[27] || (t[27] = function(p) {
          return e.handleTextareaMouseDown();
        }),
        onMouseup: t[28] || (t[28] = function(p) {
          return e.handleTextareaMouseUp();
        }),
        "aria-label": e.label,
        onKeyup: t[29] || (t[29] = function(p) {
          return e.$emit("keyup", p);
        }),
        onKeydown: t[30] || (t[30] = function(p) {
          return e.$emit("keydown", p);
        }),
        onPaste: t[31] || (t[31] = function(p) {
          return e.$emit("paste", p);
        })
      }), [De(`
      `)], 16, al)), [[c, function() {
        return e.handleTextareaMouseUp(!0);
      }, void 0, {
        mouseup: !0
      }]])],
      2
      /* CLASS */
    )), e.state.isWordLimitVisible && e.type === "textarea" ? (h(), b("span", ul, [_("span", pl, [_(
      "span",
      dl,
      x(e.state.showWordLimit ? "" + e.state.textLength : ""),
      1
      /* TEXT */
    ), _(
      "span",
      fl,
      x(e.state.showWordLimit ? "/" + e.state.upperLimit : e.state.textLength),
      1
      /* TEXT */
    )])])) : O("v-if", !0), L(e.$slots, "default")],
    16
    /* FULL_PROPS */
  );
}
var le = /* @__PURE__ */ tt(Rr, [["render", cl]]);
function Ie() {
  return Ie = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var o = arguments[t];
      for (var n in o) ({}).hasOwnProperty.call(o, n) && (e[n] = o[n]);
    }
    return e;
  }, Ie.apply(null, arguments);
}
var ml = function(t) {
  var o, n = typeof process == "object" ? (o = process.env) == null ? void 0 : o.TINY_MODE : null;
  return le;
}, hl = {
  INPUT_PC: "tiny-input__",
  INPUTGROUP_PC: "tiny-input-group__",
  INPUT_MOBILE: "tiny-mobile-input__",
  INPUTGROUP_MOBILE: "tiny-mobile-input-group__",
  Mode: "pc",
  inputMode: function(t) {
    return t === this.Mode ? this.INPUT_PC : this.INPUT_MOBILE;
  },
  inputGroupMode: function(t) {
    return t === this.Mode ? this.INPUTGROUP_PC : this.INPUTGROUP_MOBILE;
  },
  VALIDATE_ICON: {
    Validating: "tiny-icon-loading",
    Success: "tiny-icon-circle-check",
    Error: "tiny-icon-circle-close"
  },
  COMPONENT_NAME: {
    FormItem: "FormItem"
  },
  MASKSYMBOL: "******",
  TEXTAREA_HEIGHT_MOBILE: 108
}, yl = Ie({}, de, {
  _constants: {
    type: Object,
    default: function() {
      return hl;
    }
  },
  name: String,
  size: String,
  form: String,
  label: String,
  height: Number,
  resize: String,
  tabindex: {
    type: String,
    default: "1"
  },
  disabled: Boolean,
  readonly: Boolean,
  hoverExpand: Boolean,
  mask: Boolean,
  suffixIcon: [Object, String],
  prefixIcon: [Object, String],
  modelValue: [String, Number],
  type: {
    type: String,
    default: "text"
  },
  memorySpace: {
    type: Number,
    default: 5
  },
  vertical: {
    type: Boolean,
    default: !1
  },
  selectMenu: {
    type: Array,
    default: function() {
      return [];
    }
  },
  ellipsis: {
    type: Boolean,
    default: !1
  },
  contentStyle: {
    type: Object,
    default: function() {
      return {};
    }
  },
  isSelect: {
    type: Boolean,
    default: !1
  },
  tips: String,
  counter: {
    type: Boolean,
    default: !1
  },
  autosize: {
    type: [Boolean, Object],
    default: !1
  },
  clearable: {
    type: Boolean,
    default: !1
  },
  autocomplete: {
    type: String,
    default: "off"
  },
  showPassword: {
    type: Boolean,
    default: !1
  },
  showWordLimit: {
    type: Boolean,
    default: !1
  },
  showTitle: {
    type: Boolean,
    default: !1
  },
  validateEvent: {
    type: Boolean,
    default: !0
  },
  popupMore: {
    type: Boolean,
    default: !1
  },
  // mobile特有属性
  textareaTitle: {
    type: String,
    default: ""
  },
  displayOnly: {
    type: Boolean,
    default: !1
  },
  displayOnlyContent: {
    type: String,
    default: ""
  },
  customClass: {
    type: String,
    default: ""
  },
  frontClearIcon: {
    type: Boolean,
    default: !1
  },
  showEmptyValue: {
    type: Boolean,
    default: void 0
  },
  textAlign: {
    type: String,
    default: "left"
  },
  width: {
    type: [String, Number]
  },
  showTooltip: {
    type: Boolean,
    default: !0
  },
  /** 输入框的边框模式，当值为underline时，只显示一条底部直线 */
  inputBoxType: {
    type: String,
    default: "normal",
    validator: function(t) {
      return ["normal", "underline"].includes(t);
    }
  }
}), ee = U({
  name: j + "Input",
  inheritAttrs: !1,
  props: yl,
  setup: function(t, o) {
    return Te({
      props: t,
      context: o,
      template: ml
    });
  }
}), gl = "3.21.0";
ee.model = {
  prop: "modelValue",
  event: "update:modelValue"
};
ee.install = function(e) {
  e.component(ee.name, ee);
};
ee.version = gl;
export {
  ee as I
};
