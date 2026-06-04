import * as m from "vue";
import { createElementBlock as He, openBlock as J, createElementVNode as O, resolveComponent as Ot, mergeProps as Pt, createBlock as Oe, createCommentVNode as Pe, renderSlot as Ft, resolveDynamicComponent as Dt, normalizeClass as Nt, toDisplayString as zt } from "vue";
const Ge = Object.prototype.toString, we = Object.prototype.hasOwnProperty, jt = Object.getPrototypeOf, We = we.toString, Rt = We.call(Object), Ut = {
  "[object Error]": "error",
  "[object Object]": "object",
  "[object RegExp]": "regExp",
  "[object Date]": "date",
  "[object Array]": "array",
  "[object Function]": "function",
  "[object AsyncFunction]": "asyncFunction",
  "[object String]": "string",
  "[object Number]": "number",
  "[object Boolean]": "boolean"
}, Ye = (e) => e == null, de = (e) => Ye(e) ? String(e) : Ut[Ge.call(e)] || "object", Fe = (e) => de(e) === "object", j = (e) => {
  if (!e || Ge.call(e) !== "[object Object]")
    return !1;
  const r = jt(e);
  if (!r)
    return !0;
  const t = we.call(r, "constructor") && r.constructor;
  return typeof t == "function" && We.call(t) === Rt;
};
let oe;
const $t = (e, r, t) => {
  if (!e || !j(e) || !r || typeof r != "string")
    return;
  const n = r.split(".");
  let a = e;
  const o = n.length;
  if (o > 1) {
    for (let i = 0; i < o; i++)
      if (a = a[n[i]], Ye(a))
        return a;
    return a;
  } else
    return a[n[0]];
}, Bt = (e, r, t, n) => {
  if (!e || !j(e) || !r || typeof r != "string")
    return e;
  const a = r.split("."), o = e;
  let l = a.length, i = a[0];
  if (l > 1) {
    l--;
    let s = o, c, u;
    for (let d = 0; d < l; d++)
      c = a[d], u = s[c], (u === null || !j(u)) && (s[c] = {}, u = s[c]), s = u;
    i = a[l], s[i] = t;
  } else
    o[i] = t;
  return o;
}, _t = (e, r, t, n) => {
  const a = (o, l, i, s) => {
    const c = {};
    return l.forEach((u) => Bt(c, u, $t(o, u))), c;
  };
  return j(e) ? Array.isArray(r) ? a(e, r) : oe(t !== !1, {}, e) : e;
}, Vt = (e) => Array.isArray(e) ? e.map((r) => _t(r)) : e, qt = (e, r, t, n, a) => {
  let o;
  if (t && n && (j(n) || (o = Array.isArray(n))))
    if (o)
      o = !1, e[r] = Vt(n);
    else {
      const l = a && j(a) ? a : {};
      e[r] = oe(t, l, n);
    }
  else if (n !== void 0)
    try {
      e[r] = n;
    } catch {
    }
};
oe = function(...e) {
  const r = e.length;
  let t = e[0] || {}, n = 1, a = !1;
  for (de(t) === "boolean" && (a = t, t = e[n] || {}, n++), !Fe(t) && de(t) !== "function" && (t = {}); n < r; n++) {
    const o = e[n];
    if (o !== null && Fe(o)) {
      const l = Object.keys(o);
      for (const i of l) {
        const s = t[i], c = o[i];
        t !== c && qt(t, i, a, c, s);
      }
    }
  }
  return t;
};
const Lo = function(e, ...r) {
  for (let t = 0, n = r.length; t < n; t++) {
    const a = r[t] || {};
    for (const o in a)
      if (we.call(a, o)) {
        const l = a[o];
        l !== void 0 && (e[o] = l);
      }
  }
  return e;
}, Ht = () => {
  let e = 8;
  return document.addEventListener && window.performance && (e = 9, window.atob && window.matchMedia && (e = 10, !window.attachEvent && !document.all && (e = 11))), e;
}, Gt = (e) => {
  e.chrome && ~navigator.userAgent.indexOf("Edg") ? (e.name = "edge", e.edge = !0, delete e.chrome) : !document.documentMode && window.StyleMedia && (e.name = "edge", e.edge = !0);
}, Te = typeof window < "u" && typeof document < "u" && window.document === document, De = Te ? window : global;
(() => {
  const e = {
    name: void 0,
    version: void 0,
    isDoc: typeof document < "u",
    isMobile: !1,
    isPC: !0,
    isNode: typeof window > "u"
  };
  if (Te) {
    const r = /(Android|webOS|iPhone|iPad|iPod|SymbianOS|BlackBerry|Windows Phone)/.test(navigator.userAgent);
    e.isMobile = r, e.isPC = !r;
    let t;
    if (window.chrome && (window.chrome.webstore || /^Google\b/.test(window.navigator.vendor)) ? (e.name = "chrome", e.chrome = !0, t = navigator.userAgent.match(/chrome\/(\d+)/i), e.version = !!t && !!t[1] && parseInt(t[1], 10), t = void 0) : document.all || document.documentMode ? (e.name = "ie", e.version = Ht(), e.ie = !0) : typeof window.InstallTrigger < "u" ? (e.name = "firefox", e.firefox = !0) : Object.prototype.toString.call(window.HTMLElement).indexOf("Constructor") > 0 ? (e.name = "safari", e.safari = !0) : (window.opr && window.opr.addons || window.opera) && (e.name = "opera", e.opera = !0), Gt(e), !~["ie", "chrome"].indexOf(e.name)) {
      const n = e.name + "/(\\d+)";
      t = navigator.userAgent.match(new RegExp(n, "i")), e.version = !!t && !!t[1] && parseInt(t[1], 10), t = void 0;
    }
    if (e.isDoc) {
      const n = document.body || document.documentElement;
      ["webkit", "khtml", "moz", "ms", "o"].forEach((a) => {
        e["-" + a] = !!n[a + "MatchesSelector"];
      });
    }
  }
  return e;
})();
function Se(e) {
  let r = /* @__PURE__ */ Object.create(null);
  return function(n) {
    return r[n] || (r[n] = e(n));
  };
}
const Wt = /-(\w)/g, Yt = Se((e) => e.replace(Wt, (r, t) => t ? t.toUpperCase() : "")), Kt = Se((e) => e.charAt(0).toUpperCase() + e.slice(1)), Jt = /\B([A-Z])/g, Xt = Se((e) => e.replace(Jt, "-$1").toLowerCase()), Zt = () => De.crypto.getRandomValues(new De.Uint32Array(1))[0] / 4294967296, Mo = (e = "", r = 8) => e + Zt().toString().substr(2, r), Oo = (e, r, t) => {
  let n;
  if (!Te)
    return { t: e, o: !1 };
  const o = document.createElement("canvas").getContext("2d");
  o.font = r;
  let l = o.measureText(e);
  if (l.width < t)
    return { t: e, o: !1 };
  for (let i = -1; ; i--)
    if (n = e.slice(0, i) + "...", l = o.measureText(n), l.width < t)
      return { t: n, o: !0 };
};
var Qt = Object.defineProperty, er = (e, r, t) => r in e ? Qt(e, r, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[r] = t, fe = (e, r, t) => (er(e, typeof r != "symbol" ? r + "" : r, t), t);
const Ke = () => typeof window < "u" && typeof document < "u" && window.document === document, xe = () => Ke() ? window : global, tr = "tcirzywvqlkjhgfbZQG_FLOWHSUBDNIMYREVKCAJxp57XP043891T62-modnaesu";
tr.split("").reverse().join("");
function rr(e) {
  return Ke() && (e.document.all || e.document.documentMode) && !e.crypto && e.msCrypto;
}
function nr(e) {
  if (rr(e)) {
    e.crypto = e.msCrypto;
    const r = e.crypto.getRandomValues;
    e.crypto.getRandomValues = function(t) {
      const n = r.call(e.crypto, t), a = [];
      for (let o = 0; o < t.length; o++)
        a[o] = n[o];
      return a;
    };
  }
}
const or = xe();
nr(or);
var pe = { exports: {} }, w = {}, me = { exports: {} }, z = {};
function Je() {
  var e = {};
  return e["align-content"] = !1, e["align-items"] = !1, e["align-self"] = !1, e["alignment-adjust"] = !1, e["alignment-baseline"] = !1, e.all = !1, e["anchor-point"] = !1, e.animation = !1, e["animation-delay"] = !1, e["animation-direction"] = !1, e["animation-duration"] = !1, e["animation-fill-mode"] = !1, e["animation-iteration-count"] = !1, e["animation-name"] = !1, e["animation-play-state"] = !1, e["animation-timing-function"] = !1, e.azimuth = !1, e["backface-visibility"] = !1, e.background = !0, e["background-attachment"] = !0, e["background-clip"] = !0, e["background-color"] = !0, e["background-image"] = !0, e["background-origin"] = !0, e["background-position"] = !0, e["background-repeat"] = !0, e["background-size"] = !0, e["baseline-shift"] = !1, e.binding = !1, e.bleed = !1, e["bookmark-label"] = !1, e["bookmark-level"] = !1, e["bookmark-state"] = !1, e.border = !0, e["border-bottom"] = !0, e["border-bottom-color"] = !0, e["border-bottom-left-radius"] = !0, e["border-bottom-right-radius"] = !0, e["border-bottom-style"] = !0, e["border-bottom-width"] = !0, e["border-collapse"] = !0, e["border-color"] = !0, e["border-image"] = !0, e["border-image-outset"] = !0, e["border-image-repeat"] = !0, e["border-image-slice"] = !0, e["border-image-source"] = !0, e["border-image-width"] = !0, e["border-left"] = !0, e["border-left-color"] = !0, e["border-left-style"] = !0, e["border-left-width"] = !0, e["border-radius"] = !0, e["border-right"] = !0, e["border-right-color"] = !0, e["border-right-style"] = !0, e["border-right-width"] = !0, e["border-spacing"] = !0, e["border-style"] = !0, e["border-top"] = !0, e["border-top-color"] = !0, e["border-top-left-radius"] = !0, e["border-top-right-radius"] = !0, e["border-top-style"] = !0, e["border-top-width"] = !0, e["border-width"] = !0, e.bottom = !1, e["box-decoration-break"] = !0, e["box-shadow"] = !0, e["box-sizing"] = !0, e["box-snap"] = !0, e["box-suppress"] = !0, e["break-after"] = !0, e["break-before"] = !0, e["break-inside"] = !0, e["caption-side"] = !1, e.chains = !1, e.clear = !0, e.clip = !1, e["clip-path"] = !1, e["clip-rule"] = !1, e.color = !0, e["color-interpolation-filters"] = !0, e["column-count"] = !1, e["column-fill"] = !1, e["column-gap"] = !1, e["column-rule"] = !1, e["column-rule-color"] = !1, e["column-rule-style"] = !1, e["column-rule-width"] = !1, e["column-span"] = !1, e["column-width"] = !1, e.columns = !1, e.contain = !1, e.content = !1, e["counter-increment"] = !1, e["counter-reset"] = !1, e["counter-set"] = !1, e.crop = !1, e.cue = !1, e["cue-after"] = !1, e["cue-before"] = !1, e.cursor = !1, e.direction = !1, e.display = !0, e["display-inside"] = !0, e["display-list"] = !0, e["display-outside"] = !0, e["dominant-baseline"] = !1, e.elevation = !1, e["empty-cells"] = !1, e.filter = !1, e.flex = !1, e["flex-basis"] = !1, e["flex-direction"] = !1, e["flex-flow"] = !1, e["flex-grow"] = !1, e["flex-shrink"] = !1, e["flex-wrap"] = !1, e.float = !1, e["float-offset"] = !1, e["flood-color"] = !1, e["flood-opacity"] = !1, e["flow-from"] = !1, e["flow-into"] = !1, e.font = !0, e["font-family"] = !0, e["font-feature-settings"] = !0, e["font-kerning"] = !0, e["font-language-override"] = !0, e["font-size"] = !0, e["font-size-adjust"] = !0, e["font-stretch"] = !0, e["font-style"] = !0, e["font-synthesis"] = !0, e["font-variant"] = !0, e["font-variant-alternates"] = !0, e["font-variant-caps"] = !0, e["font-variant-east-asian"] = !0, e["font-variant-ligatures"] = !0, e["font-variant-numeric"] = !0, e["font-variant-position"] = !0, e["font-weight"] = !0, e.grid = !1, e["grid-area"] = !1, e["grid-auto-columns"] = !1, e["grid-auto-flow"] = !1, e["grid-auto-rows"] = !1, e["grid-column"] = !1, e["grid-column-end"] = !1, e["grid-column-start"] = !1, e["grid-row"] = !1, e["grid-row-end"] = !1, e["grid-row-start"] = !1, e["grid-template"] = !1, e["grid-template-areas"] = !1, e["grid-template-columns"] = !1, e["grid-template-rows"] = !1, e["hanging-punctuation"] = !1, e.height = !0, e.hyphens = !1, e.icon = !1, e["image-orientation"] = !1, e["image-resolution"] = !1, e["ime-mode"] = !1, e["initial-letters"] = !1, e["inline-box-align"] = !1, e["justify-content"] = !1, e["justify-items"] = !1, e["justify-self"] = !1, e.left = !1, e["letter-spacing"] = !0, e["lighting-color"] = !0, e["line-box-contain"] = !1, e["line-break"] = !1, e["line-grid"] = !1, e["line-height"] = !1, e["line-snap"] = !1, e["line-stacking"] = !1, e["line-stacking-ruby"] = !1, e["line-stacking-shift"] = !1, e["line-stacking-strategy"] = !1, e["list-style"] = !0, e["list-style-image"] = !0, e["list-style-position"] = !0, e["list-style-type"] = !0, e.margin = !0, e["margin-bottom"] = !0, e["margin-left"] = !0, e["margin-right"] = !0, e["margin-top"] = !0, e["marker-offset"] = !1, e["marker-side"] = !1, e.marks = !1, e.mask = !1, e["mask-box"] = !1, e["mask-box-outset"] = !1, e["mask-box-repeat"] = !1, e["mask-box-slice"] = !1, e["mask-box-source"] = !1, e["mask-box-width"] = !1, e["mask-clip"] = !1, e["mask-image"] = !1, e["mask-origin"] = !1, e["mask-position"] = !1, e["mask-repeat"] = !1, e["mask-size"] = !1, e["mask-source-type"] = !1, e["mask-type"] = !1, e["max-height"] = !0, e["max-lines"] = !1, e["max-width"] = !0, e["min-height"] = !0, e["min-width"] = !0, e["move-to"] = !1, e["nav-down"] = !1, e["nav-index"] = !1, e["nav-left"] = !1, e["nav-right"] = !1, e["nav-up"] = !1, e["object-fit"] = !1, e["object-position"] = !1, e.opacity = !1, e.order = !1, e.orphans = !1, e.outline = !1, e["outline-color"] = !1, e["outline-offset"] = !1, e["outline-style"] = !1, e["outline-width"] = !1, e.overflow = !1, e["overflow-wrap"] = !1, e["overflow-x"] = !1, e["overflow-y"] = !1, e.padding = !0, e["padding-bottom"] = !0, e["padding-left"] = !0, e["padding-right"] = !0, e["padding-top"] = !0, e.page = !1, e["page-break-after"] = !1, e["page-break-before"] = !1, e["page-break-inside"] = !1, e["page-policy"] = !1, e.pause = !1, e["pause-after"] = !1, e["pause-before"] = !1, e.perspective = !1, e["perspective-origin"] = !1, e.pitch = !1, e["pitch-range"] = !1, e["play-during"] = !1, e.position = !1, e["presentation-level"] = !1, e.quotes = !1, e["region-fragment"] = !1, e.resize = !1, e.rest = !1, e["rest-after"] = !1, e["rest-before"] = !1, e.richness = !1, e.right = !1, e.rotation = !1, e["rotation-point"] = !1, e["ruby-align"] = !1, e["ruby-merge"] = !1, e["ruby-position"] = !1, e["shape-image-threshold"] = !1, e["shape-outside"] = !1, e["shape-margin"] = !1, e.size = !1, e.speak = !1, e["speak-as"] = !1, e["speak-header"] = !1, e["speak-numeral"] = !1, e["speak-punctuation"] = !1, e["speech-rate"] = !1, e.stress = !1, e["string-set"] = !1, e["tab-size"] = !1, e["table-layout"] = !1, e["text-align"] = !0, e["text-align-last"] = !0, e["text-combine-upright"] = !0, e["text-decoration"] = !0, e["text-decoration-color"] = !0, e["text-decoration-line"] = !0, e["text-decoration-skip"] = !0, e["text-decoration-style"] = !0, e["text-emphasis"] = !0, e["text-emphasis-color"] = !0, e["text-emphasis-position"] = !0, e["text-emphasis-style"] = !0, e["text-height"] = !0, e["text-indent"] = !0, e["text-justify"] = !0, e["text-orientation"] = !0, e["text-overflow"] = !0, e["text-shadow"] = !0, e["text-space-collapse"] = !0, e["text-transform"] = !0, e["text-underline-position"] = !0, e["text-wrap"] = !0, e.top = !1, e.transform = !1, e["transform-origin"] = !1, e["transform-style"] = !1, e.transition = !1, e["transition-delay"] = !1, e["transition-duration"] = !1, e["transition-property"] = !1, e["transition-timing-function"] = !1, e["unicode-bidi"] = !1, e["vertical-align"] = !1, e.visibility = !1, e["voice-balance"] = !1, e["voice-duration"] = !1, e["voice-family"] = !1, e["voice-pitch"] = !1, e["voice-range"] = !1, e["voice-rate"] = !1, e["voice-stress"] = !1, e["voice-volume"] = !1, e.volume = !1, e["white-space"] = !1, e.widows = !1, e.width = !0, e["will-change"] = !1, e["word-break"] = !0, e["word-spacing"] = !0, e["word-wrap"] = !0, e["wrap-flow"] = !1, e["wrap-through"] = !1, e["writing-mode"] = !1, e["z-index"] = !1, e;
}
function ar(e, r, t) {
}
function ir(e, r, t) {
}
var lr = /javascript\s*\:/img;
function sr(e, r) {
  return lr.test(r) ? "" : r;
}
z.whiteList = Je();
z.getDefaultWhiteList = Je;
z.onAttr = ar;
z.onIgnoreAttr = ir;
z.safeAttrValue = sr;
var cr = {
  indexOf: function(e, r) {
    var t, n;
    if (Array.prototype.indexOf)
      return e.indexOf(r);
    for (t = 0, n = e.length; t < n; t++)
      if (e[t] === r)
        return t;
    return -1;
  },
  forEach: function(e, r, t) {
    var n, a;
    if (Array.prototype.forEach)
      return e.forEach(r, t);
    for (n = 0, a = e.length; n < a; n++)
      r.call(t, e[n], n, e);
  },
  trim: function(e) {
    return String.prototype.trim ? e.trim() : e.replace(/(^\s*)|(\s*$)/g, "");
  },
  trimRight: function(e) {
    return String.prototype.trimRight ? e.trimRight() : e.replace(/(\s*$)/g, "");
  }
}, $ = cr;
function ur(e, r) {
  e = $.trimRight(e), e[e.length - 1] !== ";" && (e += ";");
  var t = e.length, n = !1, a = 0, o = 0, l = "";
  function i() {
    if (!n) {
      var u = $.trim(e.slice(a, o)), d = u.indexOf(":");
      if (d !== -1) {
        var f = $.trim(u.slice(0, d)), p = $.trim(u.slice(d + 1));
        if (f) {
          var g = r(a, l.length, f, p, u);
          g && (l += g + "; ");
        }
      }
    }
    a = o + 1;
  }
  for (; o < t; o++) {
    var s = e[o];
    if (s === "/" && e[o + 1] === "*") {
      var c = e.indexOf("*/", o + 2);
      if (c === -1)
        break;
      o = c + 1, a = o + 1, n = !1;
    } else
      s === "(" ? n = !0 : s === ")" ? n = !1 : s === ";" ? n || i() : s === `
` && i();
  }
  return $.trim(l);
}
var dr = ur, q = z, fr = dr;
function Ne(e) {
  return e == null;
}
function pr(e) {
  var r = {};
  for (var t in e)
    r[t] = e[t];
  return r;
}
function Xe(e) {
  e = pr(e || {}), e.whiteList = e.whiteList || q.whiteList, e.onAttr = e.onAttr || q.onAttr, e.onIgnoreAttr = e.onIgnoreAttr || q.onIgnoreAttr, e.safeAttrValue = e.safeAttrValue || q.safeAttrValue, this.options = e;
}
Xe.prototype.process = function(e) {
  if (e = e || "", e = e.toString(), !e)
    return "";
  var r = this, t = r.options, n = t.whiteList, a = t.onAttr, o = t.onIgnoreAttr, l = t.safeAttrValue, i = fr(e, function(s, c, u, d, f) {
    var p = n[u], g = !1;
    if (p === !0 ? g = p : typeof p == "function" ? g = p(d) : p instanceof RegExp && (g = p.test(d)), g !== !0 && (g = !1), d = l(u, d), !!d) {
      var v = {
        position: c,
        sourcePosition: s,
        source: f,
        isWhite: g
      };
      if (g) {
        var h = a(u, d, v);
        return Ne(h) ? u + ":" + d : h;
      } else {
        var h = o(u, d, v);
        if (!Ne(h))
          return h;
      }
    }
  });
  return i;
};
var mr = Xe;
(function(e, r) {
  var t = z, n = mr;
  function a(l, i) {
    var s = new n(i);
    return s.process(l);
  }
  r = e.exports = a, r.FilterCSS = n;
  for (var o in t)
    r[o] = t[o];
  typeof window < "u" && (window.filterCSS = e.exports);
})(me, me.exports);
var Ce = me.exports, Ae = {
  indexOf: function(e, r) {
    var t, n;
    if (Array.prototype.indexOf)
      return e.indexOf(r);
    for (t = 0, n = e.length; t < n; t++)
      if (e[t] === r)
        return t;
    return -1;
  },
  forEach: function(e, r, t) {
    var n, a;
    if (Array.prototype.forEach)
      return e.forEach(r, t);
    for (n = 0, a = e.length; n < a; n++)
      r.call(t, e[n], n, e);
  },
  trim: function(e) {
    return String.prototype.trim ? e.trim() : e.replace(/(^\s*)|(\s*$)/g, "");
  },
  spaceIndex: function(e) {
    var r = /\s|\n|\t/, t = r.exec(e);
    return t ? t.index : -1;
  }
}, hr = Ce.FilterCSS, gr = Ce.getDefaultWhiteList, Q = Ae;
function Ze() {
  return {
    a: ["target", "href", "title"],
    abbr: ["title"],
    address: [],
    area: ["shape", "coords", "href", "alt"],
    article: [],
    aside: [],
    audio: [
      "autoplay",
      "controls",
      "crossorigin",
      "loop",
      "muted",
      "preload",
      "src"
    ],
    b: [],
    bdi: ["dir"],
    bdo: ["dir"],
    big: [],
    blockquote: ["cite"],
    br: [],
    caption: [],
    center: [],
    cite: [],
    code: [],
    col: ["align", "valign", "span", "width"],
    colgroup: ["align", "valign", "span", "width"],
    dd: [],
    del: ["datetime"],
    details: ["open"],
    div: [],
    dl: [],
    dt: [],
    em: [],
    figcaption: [],
    figure: [],
    font: ["color", "size", "face"],
    footer: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    header: [],
    hr: [],
    i: [],
    img: ["src", "alt", "title", "width", "height"],
    ins: ["datetime"],
    li: [],
    mark: [],
    nav: [],
    ol: [],
    p: [],
    pre: [],
    s: [],
    section: [],
    small: [],
    span: [],
    sub: [],
    summary: [],
    sup: [],
    strong: [],
    strike: [],
    table: ["width", "border", "align", "valign"],
    tbody: ["align", "valign"],
    td: ["width", "rowspan", "colspan", "align", "valign"],
    tfoot: ["align", "valign"],
    th: ["width", "rowspan", "colspan", "align", "valign"],
    thead: ["align", "valign"],
    tr: ["rowspan", "align", "valign"],
    tt: [],
    u: [],
    ul: [],
    video: [
      "autoplay",
      "controls",
      "crossorigin",
      "loop",
      "muted",
      "playsinline",
      "poster",
      "preload",
      "src",
      "height",
      "width"
    ]
  };
}
var Qe = new hr();
function vr(e, r, t) {
}
function yr(e, r, t) {
}
function br(e, r, t) {
}
function wr(e, r, t) {
}
function et(e) {
  return e.replace(Sr, "&lt;").replace(xr, "&gt;");
}
function Tr(e, r, t, n) {
  if (t = it(t), r === "href" || r === "src") {
    if (t = Q.trim(t), t === "#")
      return "#";
    if (!(t.substr(0, 7) === "http://" || t.substr(0, 8) === "https://" || t.substr(0, 7) === "mailto:" || t.substr(0, 4) === "tel:" || t.substr(0, 11) === "data:image/" || t.substr(0, 6) === "ftp://" || t.substr(0, 2) === "./" || t.substr(0, 3) === "../" || t[0] === "#" || t[0] === "/"))
      return "";
  } else if (r === "background") {
    if (H.lastIndex = 0, H.test(t))
      return "";
  } else if (r === "style") {
    if (ze.lastIndex = 0, ze.test(t) || (je.lastIndex = 0, je.test(t) && (H.lastIndex = 0, H.test(t))))
      return "";
    n !== !1 && (n = n || Qe, t = n.process(t));
  }
  return t = lt(t), t;
}
var Sr = /</g, xr = />/g, Cr = /"/g, Ar = /&quot;/g, kr = /&#([a-zA-Z0-9]*);?/gim, Ir = /&colon;?/gim, Er = /&newline;?/gim, H = /((j\s*a\s*v\s*a|v\s*b|l\s*i\s*v\s*e)\s*s\s*c\s*r\s*i\s*p\s*t\s*|m\s*o\s*c\s*h\s*a):/gi, ze = /e\s*x\s*p\s*r\s*e\s*s\s*s\s*i\s*o\s*n\s*\(.*/gi, je = /u\s*r\s*l\s*\(.*/gi;
function tt(e) {
  return e.replace(Cr, "&quot;");
}
function rt(e) {
  return e.replace(Ar, '"');
}
function nt(e) {
  return e.replace(kr, function(r, t) {
    return t[0] === "x" || t[0] === "X" ? String.fromCharCode(parseInt(t.substr(1), 16)) : String.fromCharCode(parseInt(t, 10));
  });
}
function ot(e) {
  return e.replace(Ir, ":").replace(Er, " ");
}
function at(e) {
  for (var r = "", t = 0, n = e.length; t < n; t++)
    r += e.charCodeAt(t) < 32 ? " " : e.charAt(t);
  return Q.trim(r);
}
function it(e) {
  return e = rt(e), e = nt(e), e = ot(e), e = at(e), e;
}
function lt(e) {
  return e = tt(e), e = et(e), e;
}
function Lr() {
  return "";
}
function Mr(e, r) {
  typeof r != "function" && (r = function() {
  });
  var t = !Array.isArray(e);
  function n(l) {
    return t ? !0 : Q.indexOf(e, l) !== -1;
  }
  var a = [], o = !1;
  return {
    onIgnoreTag: function(l, i, s) {
      if (n(l))
        if (s.isClosing) {
          var c = "[/removed]", u = s.position + c.length;
          return a.push([
            o !== !1 ? o : s.position,
            u
          ]), o = !1, c;
        } else
          return o || (o = s.position), "[removed]";
      else
        return r(l, i, s);
    },
    remove: function(l) {
      var i = "", s = 0;
      return Q.forEach(a, function(c) {
        i += l.slice(s, c[0]), s = c[1];
      }), i += l.slice(s), i;
    }
  };
}
function Or(e) {
  for (var r = "", t = 0; t < e.length; ) {
    var n = e.indexOf("<!--", t);
    if (n === -1) {
      r += e.slice(t);
      break;
    }
    r += e.slice(t, n);
    var a = e.indexOf("-->", n);
    if (a === -1)
      break;
    t = a + 3;
  }
  return r;
}
function Pr(e) {
  var r = e.split("");
  return r = r.filter(function(t) {
    var n = t.charCodeAt(0);
    return n === 127 ? !1 : n <= 31 ? n === 10 || n === 13 : !0;
  }), r.join("");
}
w.whiteList = Ze();
w.getDefaultWhiteList = Ze;
w.onTag = vr;
w.onIgnoreTag = yr;
w.onTagAttr = br;
w.onIgnoreTagAttr = wr;
w.safeAttrValue = Tr;
w.escapeHtml = et;
w.escapeQuote = tt;
w.unescapeQuote = rt;
w.escapeHtmlEntities = nt;
w.escapeDangerHtml5Entities = ot;
w.clearNonPrintableCharacter = at;
w.friendlyAttrValue = it;
w.escapeAttrValue = lt;
w.onIgnoreTagStripAll = Lr;
w.StripTagBody = Mr;
w.stripCommentTag = Or;
w.stripBlankChar = Pr;
w.cssFilter = Qe;
w.getDefaultCSSWhiteList = gr;
var ae = {}, F = Ae;
function Fr(e) {
  var r = F.spaceIndex(e), t;
  return r === -1 ? t = e.slice(1, -1) : t = e.slice(1, r + 1), t = F.trim(t).toLowerCase(), t.slice(0, 1) === "/" && (t = t.slice(1)), t.slice(-1) === "/" && (t = t.slice(0, -1)), t;
}
function Dr(e) {
  return e.slice(0, 2) === "</";
}
function Nr(e, r, t) {
  var n = "", a = 0, o = !1, l = !1, i = 0, s = e.length, c = "", u = "";
  e:
    for (i = 0; i < s; i++) {
      var d = e.charAt(i);
      if (o === !1) {
        if (d === "<") {
          o = i;
          continue;
        }
      } else if (l === !1) {
        if (d === "<") {
          n += t(e.slice(a, i)), o = i, a = i;
          continue;
        }
        if (d === ">" || i === s - 1) {
          n += t(e.slice(a, o)), u = e.slice(o, i + 1), c = Fr(u), n += r(
            o,
            n.length,
            c,
            u,
            Dr(u)
          ), a = i + 1, o = !1;
          continue;
        }
        if (d === '"' || d === "'")
          for (var f = 1, p = e.charAt(i - f); p.trim() === "" || p === "="; ) {
            if (p === "=") {
              l = d;
              continue e;
            }
            p = e.charAt(i - ++f);
          }
      } else if (d === l) {
        l = !1;
        continue;
      }
    }
  return a < s && (n += t(e.substr(a))), n;
}
var zr = /[^a-zA-Z0-9\\_:.-]/gim;
function jr(e, r) {
  var t = 0, n = 0, a = [], o = !1, l = e.length;
  function i(f, p) {
    if (f = F.trim(f), f = f.replace(zr, "").toLowerCase(), !(f.length < 1)) {
      var g = r(f, p || "");
      g && a.push(g);
    }
  }
  for (var s = 0; s < l; s++) {
    var c = e.charAt(s), u, d;
    if (o === !1 && c === "=") {
      o = e.slice(t, s), t = s + 1, n = e.charAt(t) === '"' || e.charAt(t) === "'" ? t : Ur(e, s + 1);
      continue;
    }
    if (o !== !1 && s === n) {
      if (d = e.indexOf(c, s + 1), d === -1)
        break;
      u = F.trim(e.slice(n + 1, d)), i(o, u), o = !1, s = d, t = s + 1;
      continue;
    }
    if (/\s|\n|\t/.test(c))
      if (e = e.replace(/\s|\n|\t/g, " "), o === !1)
        if (d = Rr(e, s), d === -1) {
          u = F.trim(e.slice(t, s)), i(u), o = !1, t = s + 1;
          continue;
        } else {
          s = d - 1;
          continue;
        }
      else if (d = $r(e, s - 1), d === -1) {
        u = F.trim(e.slice(t, s)), u = Re(u), i(o, u), o = !1, t = s + 1;
        continue;
      } else
        continue;
  }
  return t < e.length && (o === !1 ? i(e.slice(t)) : i(o, Re(F.trim(e.slice(t))))), F.trim(a.join(" "));
}
function Rr(e, r) {
  for (; r < e.length; r++) {
    var t = e[r];
    if (t !== " ")
      return t === "=" ? r : -1;
  }
}
function Ur(e, r) {
  for (; r < e.length; r++) {
    var t = e[r];
    if (t !== " ")
      return t === "'" || t === '"' ? r : -1;
  }
}
function $r(e, r) {
  for (; r > 0; r--) {
    var t = e[r];
    if (t !== " ")
      return t === "=" ? r : -1;
  }
}
function Br(e) {
  return e[0] === '"' && e[e.length - 1] === '"' || e[0] === "'" && e[e.length - 1] === "'";
}
function Re(e) {
  return Br(e) ? e.substr(1, e.length - 2) : e;
}
ae.parseTag = Nr;
ae.parseAttr = jr;
var _r = Ce.FilterCSS, M = w, st = ae, Vr = st.parseTag, qr = st.parseAttr, X = Ae;
function G(e) {
  return e == null;
}
function Hr(e) {
  var r = X.spaceIndex(e);
  if (r === -1)
    return {
      html: "",
      closing: e[e.length - 2] === "/"
    };
  e = X.trim(e.slice(r + 1, -1));
  var t = e[e.length - 1] === "/";
  return t && (e = X.trim(e.slice(0, -1))), {
    html: e,
    closing: t
  };
}
function Gr(e) {
  var r = {};
  for (var t in e)
    r[t] = e[t];
  return r;
}
function Wr(e) {
  var r = {};
  for (var t in e)
    Array.isArray(e[t]) ? r[t.toLowerCase()] = e[t].map(function(n) {
      return n.toLowerCase();
    }) : r[t.toLowerCase()] = e[t];
  return r;
}
function ct(e) {
  e = Gr(e || {}), e.stripIgnoreTag && (e.onIgnoreTag && console.error(
    'Notes: cannot use these two options "stripIgnoreTag" and "onIgnoreTag" at the same time'
  ), e.onIgnoreTag = M.onIgnoreTagStripAll), e.whiteList || e.allowList ? e.whiteList = Wr(e.whiteList || e.allowList) : e.whiteList = M.whiteList, e.onTag = e.onTag || M.onTag, e.onTagAttr = e.onTagAttr || M.onTagAttr, e.onIgnoreTag = e.onIgnoreTag || M.onIgnoreTag, e.onIgnoreTagAttr = e.onIgnoreTagAttr || M.onIgnoreTagAttr, e.safeAttrValue = e.safeAttrValue || M.safeAttrValue, e.escapeHtml = e.escapeHtml || M.escapeHtml, this.options = e, e.css === !1 ? this.cssFilter = !1 : (e.css = e.css || {}, this.cssFilter = new _r(e.css));
}
ct.prototype.process = function(e) {
  if (e = e || "", e = e.toString(), !e)
    return "";
  var r = this, t = r.options, n = t.whiteList, a = t.onTag, o = t.onIgnoreTag, l = t.onTagAttr, i = t.onIgnoreTagAttr, s = t.safeAttrValue, c = t.escapeHtml, u = r.cssFilter;
  t.stripBlankChar && (e = M.stripBlankChar(e)), t.allowCommentTag || (e = M.stripCommentTag(e));
  var d = !1;
  t.stripIgnoreTagBody && (d = M.StripTagBody(
    t.stripIgnoreTagBody,
    o
  ), o = d.onIgnoreTag);
  var f = Vr(
    e,
    function(p, g, v, h, b) {
      var y = {
        sourcePosition: p,
        position: g,
        isClosing: b,
        isWhite: Object.prototype.hasOwnProperty.call(n, v)
      }, T = a(v, h, y);
      if (!G(T))
        return T;
      if (y.isWhite) {
        if (y.isClosing)
          return "</" + v + ">";
        var k = Hr(h), I = n[v], S = qr(k.html, function(x, C) {
          var A = X.indexOf(I, x) !== -1, E = l(v, x, C, A);
          return G(E) ? A ? (C = s(v, x, C, u), C ? x + '="' + C + '"' : x) : (E = i(v, x, C, A), G(E) ? void 0 : E) : E;
        });
        return h = "<" + v, S && (h += " " + S), k.closing && (h += " /"), h += ">", h;
      } else
        return T = o(v, h, y), G(T) ? c(h) : T;
    },
    c
  );
  return d && (f = d.remove(f)), f;
};
var Yr = ct;
(function(e, r) {
  var t = w, n = ae, a = Yr;
  function o(i, s) {
    var c = new a(s);
    return c.process(i);
  }
  r = e.exports = o, r.filterXSS = o, r.FilterXSS = a, function() {
    for (var i in t)
      r[i] = t[i];
    for (var s in n)
      r[s] = n[s];
  }(), typeof window < "u" && (window.filterXSS = e.exports);
  function l() {
    return typeof self < "u" && typeof DedicatedWorkerGlobalScope < "u" && self instanceof DedicatedWorkerGlobalScope;
  }
  l() && (self.filterXSS = e.exports);
})(pe, pe.exports);
var ee = pe.exports;
let L = {
  enableAttrs: !0,
  enableHtml: !0,
  enableUrl: !0,
  html: {
    whiteList: {
      a: ["class", "style", "contenteditable", "data-id", "data-title", "data-size", "data-last-modified"],
      address: ["class", "style"],
      area: ["class", "style"],
      article: ["class", "style"],
      aside: ["class", "style"],
      audio: ["class", "style"],
      b: ["class", "style"],
      bdi: ["class", "style"],
      bdo: ["class", "style"],
      big: ["class", "style"],
      blockquote: ["class", "style"],
      br: ["class", "style"],
      caption: ["class", "style"],
      center: ["class", "style"],
      cite: ["class", "style"],
      code: ["class", "style"],
      col: ["class", "style"],
      colgroup: ["class", "style"],
      dd: ["class", "style"],
      del: ["class", "style"],
      details: ["class", "style"],
      div: [
        "class",
        "style",
        "spellcheck",
        "data-gramm",
        "spellcheck",
        "data-mode",
        "data-position",
        "data-row",
        "data-cell",
        "data-rowspan",
        "data-colspan",
        "data-cell-bg",
        "data-parent-bg"
      ],
      dl: ["class", "style"],
      dt: ["class", "style"],
      em: ["class", "style"],
      figcaption: ["class", "style"],
      figure: ["class", "style"],
      font: ["class", "style"],
      footer: ["class", "style"],
      h1: ["class", "style"],
      h2: ["class", "style"],
      h3: ["class", "style"],
      h4: ["class", "style"],
      h5: ["class", "style"],
      h6: ["class", "style"],
      header: ["class", "style"],
      hr: ["class", "style"],
      i: ["class", "style", "data-image-id", "data-image"],
      img: ["class", "style", "devui-editorx-image", "style", "data-image-id"],
      input: ["class", "style", "data-formula", "data-link", "data-video"],
      ins: ["class", "style"],
      li: ["class", "style"],
      mark: ["class", "style"],
      nav: ["class", "style"],
      ol: ["class", "style"],
      p: ["class", "style"],
      pre: ["class", "style"],
      s: ["class", "style"],
      section: ["class", "style"],
      small: ["class", "style"],
      span: ["class", "style", "contenteditable", "color", "style"],
      sub: ["class", "style"],
      summary: ["class", "style"],
      sup: ["class", "style"],
      strong: ["class", "style"],
      strike: ["class", "style"],
      svg: ["class", "style", "t", "viewBox", "viewbox", "version", "xmlns", "p-id", "xmlns:xlink"],
      path: ["d", "p-id"],
      table: ["class", "style"],
      tbody: ["class", "style"],
      td: ["class", "style", "data-row", "data-cell", "data-cell-bg", "data-parent-bg"],
      tfoot: ["class", "style"],
      th: ["class", "style"],
      thead: ["class", "style"],
      tr: ["class", "style", "data-row"],
      tt: ["class", "style"],
      u: ["class", "style"],
      ul: ["class", "style"],
      video: ["class", "style"]
    }
  }
};
const Kr = ee.getDefaultWhiteList && ee.getDefaultWhiteList() || {};
L.html.whiteList = Object.assign(Kr, L.html.whiteList);
let ut = new ee.FilterXSS(L.html);
const Jr = () => L, Xr = (e) => {
  var r;
  let t;
  (r = e == null ? void 0 : e.html) != null && r.whiteList && (t = Object.assign(L.html.whiteList, e.html.whiteList)), L = Object.assign(L, e), t && (L.html.whiteList = t), ut = new ee.FilterXSS(L.html);
};
let dt = (e) => !L.enableHtml || typeof e != "string" ? e : ut.process(e);
const Zr = (e) => {
  dt = e;
};
let ft = (e) => !L.enableAttrs || typeof e != "string" ? e : e.replace(/<.*?>/gi, "").replace(/on[a-z]+=/gi, "");
const Qr = (e) => {
  ft = e;
};
let pt = (e) => {
  if (!L.enableUrl || typeof e != "string")
    return e;
  const r = e.replace(/&#(\w+)(^\w|;)?/g, (n, a) => String.fromCharCode(a)).replace(/[\u0000-\u001F\u007F-\u009F\u2000-\u200D\uFEFF]/gim, "").trim();
  if (!r)
    return "";
  if ([".", "/"].includes(r[0]))
    return r;
  const t = r.match(/^([^:]+):/gm);
  return t && /^([^\w]*)(javascript|data|vbscript)/im.test(t[0]) ? "" : r;
};
const en = (e) => {
  pt = e;
}, tn = {
  getXssOption: Jr,
  setXssOption: Xr,
  filterHtml: dt,
  setFilterHtml: Zr,
  filterAttrs: ft,
  setFilterAttrs: Qr,
  filterUrl: pt,
  setFilterUrl: en
}, rn = xe(), nn = "console", on = rn[nn] || {}, Ue = {}, an = (e, r) => function(...t) {
  e[r] && typeof e[r] == "function" && e[r](...t);
}, ln = (e) => (Object.keys(e).forEach((r) => {
  Ue[r] = an(e, r);
}), Ue);
ln(on);
const $e = xe().crypto;
let he;
$e ? he = (e) => {
  const r = [];
  for (let t = 0; t < e; t += 4)
    r.push($e.getRandomValues(new Uint32Array(1))[0]);
  return new te(r, e);
} : he = (e) => {
  const r = [], t = (n) => {
    let a = n, o = 987654321;
    const l = 4294967295;
    return () => {
      o = 36969 * (o & 65535) + (o >> 16) & l, a = 18e3 * (a & 65535) + (a >> 16) & l;
      let i = (o << 16) + a & l;
      return i /= 4294967296, i += 0.5, i * (Math.random() > 0.5 ? 1 : -1);
    };
  };
  for (let n = 0, a; n < e; n += 4) {
    const o = t((a || Math.random()) * 4294967296);
    a = o() * 987654071, r.push(o() * 4294967296 | 0);
  }
  return new te(r, e);
};
class sn {
  // @ts-ignore
  static create(...r) {
    return new this(...r);
  }
  clone() {
    const r = new this.constructor();
    return Object.assign(r, this), r;
  }
  mixIn(r) {
    return Object.assign(this, r);
  }
}
class te extends sn {
  constructor(r = [], t = r.length * 4) {
    super(), fe(this, "words"), fe(this, "sigBytes");
    let n = r;
    if (n instanceof ArrayBuffer && (n = new Uint8Array(n)), (n instanceof Int8Array || n instanceof Uint8ClampedArray || n instanceof Int16Array || n instanceof Uint16Array || n instanceof Int32Array || n instanceof Uint32Array || n instanceof Float32Array || n instanceof Float64Array) && (n = new Uint8Array(n.buffer, n.byteOffset, n.byteLength)), n instanceof Uint8Array) {
      const a = n.byteLength, o = [];
      for (let l = 0; l < a; l += 1)
        o[l >>> 2] |= n[l] << 24 - l % 4 * 8;
      this.words = o, this.sigBytes = a;
    } else
      this.words = r, this.sigBytes = t;
  }
  toString(r = cn) {
    return r.stringify(this);
  }
  concat(r) {
    const t = this.words, n = r.words, a = this.sigBytes, o = r.sigBytes;
    if (this.clamp(), a % 4)
      for (let l = 0; l < o; l += 1) {
        const i = n[l >>> 2] >>> 24 - l % 4 * 8 & 255;
        t[a + l >>> 2] |= i << 24 - (a + l) % 4 * 8;
      }
    else
      for (let l = 0; l < o; l += 4)
        t[a + l >>> 2] = n[l >>> 2];
    return this.sigBytes += o, this;
  }
  clone() {
    const r = super.clone.call(this);
    return r.words = this.words.slice(0), r;
  }
  clamp() {
    const { words: r, sigBytes: t } = this;
    r[t >>> 2] &= 4294967295 << 32 - t % 4 * 8, r.length = Math.ceil(t / 4);
  }
}
fe(te, "random", he);
const cn = {
  stringify(e) {
    const { words: r, sigBytes: t } = e, n = [];
    for (let a = 0; a < t; a += 1) {
      const o = r[a >>> 2] >>> 24 - a % 4 * 8 & 255;
      n.push((o >>> 4).toString(16)), n.push((o & 15).toString(16));
    }
    return n.join("");
  },
  parse(e) {
    const r = e.length, t = [];
    for (let n = 0; n < r; n += 2)
      t[n >>> 3] |= parseInt(e.substr(n, 2), 16) << 24 - n % 8 * 4;
    return new te(t, r / 2);
  }
}, un = [], dn = [];
let W = 2, B = 0;
const fn = (e) => {
  const r = Math.sqrt(e);
  for (let t = 2; t <= r; t += 1)
    if (!(e % t))
      return !1;
  return !0;
}, Be = (e) => (e - (e | 0)) * 4294967296 | 0;
for (; B < 64; )
  fn(W) && (B < 8 && (un[B] = Be(W ** (1 / 2))), dn[B] = Be(W ** (1 / 3)), B += 1), W += 1;
const pn = tn;
var ie = {
  "en-US": "英语",
  "zh-CN": "中文",
  "zh-TW": "中国台湾",
  hello: "你好 {name}",
  code: "zh-CN",
  yes: "是",
  no: "否",
  ui: {
    input: {
      close: "关闭",
      more: "更多",
      detail: "详细信息"
    },
    numeric: {
      equalTo: "等于",
      notEqualTo: "不等于",
      moreThan: "大于",
      moreThanOrEqualTo: "大于等于",
      lessThan: "小于",
      lessThanOrEqualTo: "小于等于",
      empty: "为空",
      nonEmpty: "不为空"
    },
    queryBuilder: {
      addItem: "新增条件",
      addGroup: "新增子条件组",
      removeGroup: "移除条件组"
    },
    wizard: {
      previousStep: "上一步",
      nextStep: "下一步",
      save: "保存",
      submit: "提交"
    },
    linkMenu: {
      title: "消息",
      placeholder: "请输入关键字过滤...",
      sure: "确定",
      cancel: "取消"
    },
    todoList: {
      add: "提交",
      placeholder: "请输入内容..."
    },
    alert: {
      error: "错误",
      info: "消息",
      success: "成功",
      title: "消息提示",
      warning: "警告"
    },
    amount: {
      currency: "币种",
      amount: "金额",
      date: "日期",
      equalTo: "等于",
      notEqualTo: "不等于",
      moreThan: "大于",
      moreThanOrEqualTo: "大于等于",
      lessThan: "小于",
      lessThanOrEqualTo: "小于等于",
      empty: "为空",
      nonEmpty: "不为空"
    },
    actionMenu: {
      moreText: "更多"
    },
    base: {
      all: "全部",
      cancel: "取消",
      confirm: "确定",
      delete: "删除",
      edit: "编辑",
      more: "更多",
      reset: "重置",
      clear: "清空",
      comma: "，"
    },
    button: {
      cancel: "取消",
      confirm: "确定"
    },
    buttonGroup: {
      noData: "暂无数据"
    },
    buttonMessage: {
      cancel: "取消",
      confirm: "确定"
    },
    cell: {
      placeholder: "请选择"
    },
    cascader: {
      noMatch: "无匹配数据",
      loading: "加载中",
      placeholder: "请选择",
      noData: "暂无数据"
    },
    chart: {
      auxiliary: "辅助",
      emptyText: "暂无数据",
      kName: "日K",
      other: "其他",
      summation: "总量",
      total: "总计",
      value: "数值"
    },
    colorSelectPanel: {
      confirm: "选择",
      cancel: "取消",
      predefine: "预定义颜色",
      history: "历史记录",
      empty: "暂无"
    },
    crop: {
      choose: "选择图片",
      zoomOut: "缩小10%",
      zoomIn: "放大10%",
      rotate_45: "逆时针旋转45°",
      rotate45: "顺时针旋转45°",
      closeCropArea: "隐藏选区",
      reset: "重置视图",
      closeCrop: "退出裁剪",
      cropImage: "选择区域"
    },
    datepicker: {
      clear: "清空",
      cancel: "取消",
      endDate: "结束日期",
      confirm: "确定",
      month: "月",
      endTime: "结束时间",
      month2: "2 月",
      month1: "1 月",
      month4: "4 月",
      month3: "3 月",
      month6: "6 月",
      month5: "5 月",
      month8: "8 月",
      month7: "7 月",
      month10: "10 月",
      month9: "9 月",
      month12: "12 月",
      month11: "11 月",
      months: {
        feb: "二月",
        jan: "一月",
        apr: "四月",
        mar: "三月",
        jun: "六月",
        may: "五月",
        aug: "八月",
        jul: "七月",
        oct: "十月",
        sep: "九月",
        dec: "十二月",
        nov: "十一月"
      },
      nextYear: "后一年",
      nextMonth: "下个月",
      prevMonth: "上个月",
      now: "此刻",
      selectDate: "选择日期",
      prevYear: "前一年",
      startDate: "开始日期",
      selectTime: "选择时间",
      today: "今天",
      currentMonth: "本月",
      startTime: "开始时间",
      week: "Maintainer次",
      weeks: {
        mon: "一",
        sun: "日",
        wed: "三",
        tue: "二",
        fri: "五",
        thu: "四",
        sat: "六"
      },
      timezone: "选择时区",
      year: "年",
      hour: "时",
      minute: "分",
      second: "秒",
      to: "至",
      yearMonth: "{year}年{month}月",
      yearMonthDay: "{year}年{month}月{day}日"
    },
    richTextEditor: {
      bold: "加粗",
      italic: "斜体",
      link: "链接",
      unlink: "移除链接",
      highlight: "高亮",
      underline: "下划线",
      strike: "中划线",
      subscript: "下标",
      superscript: "上标",
      code: "代码",
      unorderedlist: "无序列表",
      orderedlist: "有序列表",
      taskList: "任务列表",
      quote: "引用",
      codeBlock: "代码块",
      formatClear: "清除标记",
      nodeDelete: "删除节点",
      undo: "回退",
      redo: "前进",
      left: "左对齐",
      center: "居中",
      right: "右对齐",
      fontSize: "字号",
      lineHeight: "行高",
      hBox: "段落标题",
      img: "图片",
      color: "颜色",
      table: "表格",
      backgroundColor: "文字背景色",
      localResources: "本地资源",
      resourceLink: "资源链接"
    },
    calendar: {
      showType: {
        year: "年"
      }
    },
    dept: {
      code: "编码",
      company: "公司",
      dept1: "一级部门",
      dept2: "二级部门",
      dept3: "三级部门",
      dept4: "四级部门",
      dept5: "五级部门",
      dept6: "六级部门",
      dept7: "七级部门",
      dept8: "八级部门",
      input: "可输入部门编码或名称",
      name: "名称",
      search: "辅助查询",
      selected: "已选"
    },
    dialogBox: {
      confirm: "确定",
      cancel: "取消"
    },
    load: {
      dot: "加载中"
    },
    exception: {
      build: "模块正在建设中",
      busy: "系统繁忙，请稍等一下",
      noperm: "茫茫大海，找不到页面",
      weaknet: "网络不给力",
      pcview: "请到PC上查看文件",
      nodata: "休息一下",
      create: "创建",
      provide: "TINY 开发团队提供",
      nodatamf: "暂无数据",
      nopermmf: "无访问权限",
      weaknetmf: "网络异常",
      noresult: "无相关搜索结果",
      nonews: "暂无最新消息",
      pagenoperm: "403:无访问权限",
      pageweaknet: "网络异常",
      pagenothing: "404:你访问的页面不存在",
      pageservererror: "500:服务器异常"
    },
    fileUpload: {
      largefile: "文件过大，将会分片上传，请耐心等待!",
      folder: "文件所在文件夹层数已超过 5 层，将不会上传该文件",
      init: "服务报错，请重试",
      token="<REDACTED_CREDENTIAL>",
      exceed: "文件大小超过限制（{maxSize}）",
      largeFile: "文件大小超出限制 2G ！！",
      fileSize: "文件大小低于限制（{minSize}{sizeUnit}）",
      deleteTip: "按 delete 键可删除",
      downloadFile: "下载文件",
      previewFile: "预览文件",
      updateFile: "更新文件",
      reUploadFile: "重新上传",
      cancelFile: "取消上传",
      deleteFile: "删除文件",
      empty: "是空文件！",
      kiaScanTip: "抱歉，从公网接入下载文档，需要通过KIA检测；当前文档正在KIA检测中，请稍后几分钟后再下载！",
      fileNameExceeds: "超过255个字符，请修改文件名。",
      fileName: "该文件名",
      calcHash: "文档正在计算加密中",
      uploadFile: "文件上传",
      downloadAll: "全部下载",
      onlySupport: "支持{type}格式文件",
      fileNotLessThan: "单个文件不能小于",
      fileNotMoreThan: "单个文件不能超过",
      fileSizeRange: "单个文件大小需在{moreThan}~{lessThan}之间",
      notSupport: "格式（.{format}）暂不支持",
      notSupportNoSuffix: "暂不支持无后缀文件",
      notSupportSpecialCharacters: "文件名包含特殊字符，请重命名后上传",
      attachment: "附件",
      uploadList: "上传列表",
      numberExceed: "批量上传个数超过限制（{number}）",
      numberLimit: "最多上传{number}个文件",
      encryptDialogTitle: "水印及加密设置",
      addWatermark: "添加水印",
      encrypted: "加密",
      docPreview: "文档预览",
      networkError: "网络出错",
      pictureNetworkError: "网络出错，上传失败",
      reUploadTip: "{number}个文件上传失败！"
    },
    uploadList: {
      pictureUploading: "图片上传中",
      uploadFailed: "上传失败",
      uploading: "上传中",
      download: "下载",
      reUpload: "重新上传",
      delete: "删除",
      noAttachments: "暂无附件",
      cancel: "取消",
      preview: "预览",
      releaseAndUpload: "释放鼠标，上传文件",
      dragOrClickImport: "将文件拖到此处，或点击导入",
      shoot: "拍摄",
      selectFromAlbum: "从相册选择",
      uploadFailedAndReupload: "上传失败，点击重新上传"
    },
    upload: {
      addPicture: "添加图片",
      addAudio: "添加音频",
      addVideo: "添加视频"
    },
    grid: {
      dataUnchanged: "数据未改动！",
      deleteSelectRecord: "您确定要删除所选记录吗？",
      emptyText: "暂无数据",
      error: {
        delRevert: "方法 revert 已废弃，请使用 revertData",
        groupFixed: "如果使用分组表头，固定列必须在左右两侧",
        notDelete: "Delete 方法不存在",
        notQuery: "query 方法不存在",
        notResizable: "横向虚拟滚动不支持 resizable",
        notSave: "save 方法不存在",
        reqModule: "缺少 {{name}} 模块",
        rowIdEmpty: "参数 row-id 不允许为空",
        scrollYHeight: "启用虚拟滚动必须要设置 height 或 max-height",
        toolbarId: "工具栏需要设置唯一 id",
        treeFixedExpand: "树结构的固定列与展开行功能有冲突",
        treeInsert: "树结构不支持 insert 操作",
        treeRemove: "树结构不支持 remove 操作",
        unableInsert: "无法插入到指定位置",
        notAllowDragSelf: "不允许自己给自己拖动",
        notAllowDragFixed: "固定列不允许拖动",
        remoteMethod: "个性化模板管理远端存储需要设置 multipleHistory.remoteMethod",
        remoteSelectedMethod: "个性化模板管理远端存储需要设置 multipleHistory.remoteSelectedMethod",
        chainCallError: "列的默认插槽中存在语法错误，请检查。",
        renderParamError: "期望配置一个生成 VNode 的渲染方法。",
        classComponentError: "类组件渲染出错。",
        groupColumnFixedError: "同一个分组内不能设置不同的固定类型。",
        missingValueFormat: "渲染器无法格式化日期字符串，需要提供 valueFormat 源日期格式配置。",
        clipboardWriteError: "剪切板写入错误"
      },
      filter: {
        allSelect: "(全选)",
        endDate: "结束日期",
        startDate: "开始日期",
        dateTips: "请至少输入一个日期",
        clear: "清除当前列筛选",
        clearAll: "清除所有列筛选",
        confirmFilter: "筛选",
        empty: "为空",
        emptyText: "暂无数据",
        equal: "等于",
        include: "包含",
        prefix: "开头是",
        resetFilter: "重置",
        unempty: "不为空"
      },
      individuation: {
        cancelBtn: "取消",
        colConfigs: {
          visible: "显示",
          invisible: "隐藏",
          asc: "正序",
          desc: "倒序",
          unsorted: "未排序",
          frozenLeft: "左冻结",
          frozenRight: "右冻结",
          unfrozen: "未冻结",
          unfreeze: "取消冻结",
          unsort: "取消排序"
        },
        toolbar: {
          set: "设置",
          selected: "已选",
          freeze: "冻结",
          sort: "排序",
          clear: "清空",
          search: "搜索",
          all: "全选"
        },
        columnSet: "列设置",
        overwriteSave: "覆盖保存",
        saveAs: "另存为",
        saveTemplate: "存模板",
        selectTemplate: "选择模板",
        hideMsg: "至少保留一列显示",
        maxFreezeNumMsg: "冻结列不可超过6项",
        defaultTemplateName: "请输入名称，如未填写由系统按时间生成",
        reserveTemplateName: "如未填写名称将保留之前的名称",
        resetBtn: "重置",
        saveBtn: "确定",
        hideAll: "全部隐藏",
        showAll: "全部显示",
        tabs: {
          base: {
            title: "基础设置",
            tips: "点击图标按钮设置个性化"
          },
          other: {
            title: "其他设置",
            tips: "设置服务器排序或客户端排序、每页条数大小。",
            sortType: "排序类型",
            currPageSort: "当前页数据排序",
            allDataSort: "所有数据排序",
            pageSize: "每页条数"
          }
        },
        title: "个性化设置",
        switchtitle: "模板管理",
        switchsave: "保存配置",
        switchlabel: "配置列表：",
        switchapply: "使用",
        switchedit: "编辑",
        switchdel: "删除",
        switchconfirm: "确定",
        switchdelconfirm: "删除确认",
        switchonlytemp: "保存模板",
        switchtempapply: "保存并使用模板",
        switchtempoverwrite: "覆盖并使用模板",
        switchdelcon: "确定要删除这个模板？",
        switchdelyes: "确定",
        switchdelno: "取消",
        switchapplycon: "确定要使用这个模板？"
      },
      removeSelectRecord: "您确定要移除所选记录吗？",
      saveSuccess: "保存成功",
      selectOneRecord: "请至少选择一条记录！",
      isSaveMsg: "有修改的数据，是否要保存？"
    },
    hrapprover: {
      approver: "权签人",
      noselected: "没有选择权签人",
      noapprover: "没有权签人",
      remark: "备注"
    },
    imageViewer: {
      loadErrorAlt: "加载失败",
      save: "保存图片",
      del: "删除图片",
      thumbnail: "缩略图",
      menu: "目录",
      hide: "隐藏侧边栏",
      show: "显示侧边栏"
    },
    navMenu: {
      moreText: "更多"
    },
    logout: {
      in: "登录",
      out: "注销"
    },
    page: {
      goto: "前往",
      item: "条",
      next: "下一页",
      page: "条/页",
      pageClassifier: "页",
      pagesize: "条/页",
      prev: "上一页",
      total: "共",
      totals: "总条数：",
      jump: "跳至",
      hundredThousand: "10万+",
      million: "100万+",
      tenMillion: "1千万+",
      loadingTotals: "加载总条数…"
    },
    popeditor: {
      cancel: "取 消",
      confirm: "确 认",
      historyLists: "历史数据列表",
      reset: "重 置",
      search: "查 询",
      selectionLists: "选择数据列表",
      sourceLists: "所有数据列表",
      title: "选择",
      filterNode: "输入内容进行筛选"
    },
    popupload: {
      fileName: "文件名",
      fileSize: "文件大小",
      fileStatus: "文件状态",
      uploadError: "上传失败",
      dialogTitle: "文件上传",
      cancelButtonText: "取消",
      tipsFileText: "上传提示",
      saveButtonText: "开始上传",
      uploadSuccess: "上传成功！",
      uploadButtonText: "选择文件",
      uploadsButtonText: "选择批量文件",
      errorTypeTips: "上传文件类型不匹配",
      errorNumTips: "上传文件数量超出限制,已取消该操作",
      errorSizeTips: "上传文件大小超出限制",
      confirmDeleteTips: "确定要删除该文件吗？",
      delete: "删除",
      waitUpload: "等待上传",
      operation: "操作",
      success: "上传成功",
      listTip: "共{0}条数据：",
      errorListTip: "其中{0}条出错，请修改后重试",
      limitUploadFileNumber: "上传文件数限制为",
      limitUploadFileType: "上传文件类型限制为",
      limitUploadFileSize: "上传文件大小不超过"
    },
    rate: {
      level: {
        average: "一般",
        excellent: "很好",
        fair: "差",
        good: "好",
        poor: "很差"
      }
    },
    select: {
      loading: "加载中",
      noMatch: "无匹配数据",
      noData: "暂无相关数据",
      placeholder: "请选择",
      pleaseSearch: "请搜索",
      search: "搜索",
      selected: "已选",
      selectedNum: "已选 {num} 个",
      noSearchData: "无相关搜索结果，请重新输入",
      add: "新增",
      collapse: "收起"
    },
    search: {
      placeholder: "搜索"
    },
    signature: {
      confirm: "确认",
      rewrite: "重写",
      cancel: "取消",
      tips: "请手写签名",
      resign: "重新签名",
      placeholder: "请在此签名（必填）"
    },
    tabs: {
      moreItem: "更多"
    },
    tag: {
      add: "添加"
    },
    toggleMenu: {
      placeholder: "请输入内容进行筛选"
    },
    treeMenu: {
      placeholder: "输入关键字搜索"
    },
    transfer: {
      filterPlaceholder: "请输入搜索内容",
      hasCheckedFormat: "已选 {checked}/{total} 项",
      noCheckedFormat: "共 {total} 项",
      noData: "无数据",
      noMatch: "无匹配数据",
      titles: ["列表 1", "列表 2"]
    },
    tree: {
      loading: "加载中",
      emptyText: "暂无数据",
      switchText: "同时勾选下级",
      edit: "编辑",
      delete: "删除",
      addChild: "新增下级",
      newNodeTitle: "新增下级",
      deleteTip1: "删除后数据不可恢复，确定删除吗？",
      deleteTip2: "该节点存在下级节点，是否保留下级节点数据？",
      deleteTip3: "保留下级节点数据"
    },
    usercard: {
      address: "地址",
      collapse: "收起",
      email: "邮箱",
      empno: "工号",
      expand: "展开",
      fax: "传真",
      internal: "内线",
      manager: "主管",
      mobile: "手机",
      other: "其他",
      phone: "固定电话",
      timezone: "时区",
      travelcode: "出差联系信息",
      viop: "VIOP"
    },
    richText: {
      bold: "加粗",
      italic: "倾斜",
      underline: "下划线",
      header: "段落格式",
      strike: "删除线",
      blockquote: "块引用",
      codeBlock: "插入代码段",
      size: "字体大小",
      listOrdered: "编号列表",
      listBullet: "项目列表",
      header1: "h1",
      header2: "h2",
      align: "对齐方式",
      color: "字体颜色",
      background: "背景颜色",
      image: "图像",
      video: "视频",
      link: "添加链接",
      formula: "插入公式",
      clean: "清除格式",
      indent1: "向左缩进",
      indent2: "向右缩进",
      pickerLabel: "标题大小",
      headerPicker1: "标题一",
      headerPicker2: "标题二",
      headerPicker3: "标题三",
      headerPicker4: "标题四",
      headerPicker5: "标题五",
      headerPicker6: "标题六",
      normal: "标准",
      sizeSmall: "小号",
      sizeLarge: "大号",
      sizeHuge: "超大号",
      alignPicker1: "居左对齐",
      alignPicker2: "居中对齐",
      alignPicker3: "居右对齐",
      alignPicker4: "两端对齐",
      subScript: "下标",
      superScript: "上标",
      directionRTL: "从右到左",
      font: "字体",
      file: "文件",
      betterTable: "表格",
      fullscreen: "全屏",
      insertColumnRight: "右插入列",
      insertColumnLeft: "左插入列",
      insertRowUp: "上插入行",
      insertRowDown: "下插入行",
      mergeCells: "合并单元格",
      unmergeCells: "拆分单元格",
      deleteColumn: "删除当前列",
      deleteRow: "删除当前行",
      deleteTable: "删除表格",
      colorPicker: "背景颜色",
      placeholder: "在此处插入文本...",
      maxLength: "文本长度超过限制，支持的最大长度是 "
    },
    fluentEditor: {
      undo: "撤销",
      redo: "重做",
      lineheight: "行高"
    },
    steps: {
      done: "已完成",
      doing: "进行中",
      wait: "等待中"
    },
    actionSheet: {
      cancel: "取消"
    },
    image: {
      loadFail: "加载失败"
    },
    miniPicker: {
      cancel: "取消",
      confirm: "确定"
    },
    pullRefresh: {
      pullingDown: "下拉即可刷新",
      pullingUp: "上拉即可刷新",
      pulling: "下拉即可刷新",
      loosing: "释放即可刷新",
      success: "刷新成功",
      failed: "刷新失败",
      noMore: "没有更多了"
    },
    currency: {
      defaultCurrency: "默认币种",
      setDefault: "设为默认",
      chooseCurrency: "选择币种"
    },
    calendarBar: {
      week: {
        0: "日",
        1: "一",
        2: "二",
        3: "三",
        4: "四",
        5: "五",
        6: "六"
      },
      year: "%s年",
      yearMonth: "%y年%m月",
      month: {
        1: "1月",
        2: "2月",
        3: "3月",
        4: "4月",
        5: "5月",
        6: "6月",
        7: "7月",
        8: "8月",
        9: "9月",
        10: "10月",
        11: "11月",
        12: "12月"
      },
      monthAbbr: {
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
        6: "6",
        7: "7",
        8: "8",
        9: "9",
        10: "10",
        11: "11",
        12: "12"
      }
    },
    calendarView: {
      week: {
        0: "日",
        1: "一",
        2: "二",
        3: "三",
        4: "四",
        5: "五",
        6: "六"
      },
      weekDays: {
        0: "Maintainer日",
        1: "Maintainer一",
        2: "Maintainer二",
        3: "Maintainer三",
        4: "Maintainer四",
        5: "Maintainer五",
        6: "Maintainer六"
      },
      backToday: "回今天",
      new: "新增",
      noSchedule: "暂无日程",
      year: "年",
      month: "月",
      dateFormat: "yyyy 年 MM 月"
    },
    selectedBox: {
      select: "已选（%s）",
      allSelect: "已全选（%s）",
      clear: "清空",
      noData: "暂无数据"
    },
    record: {
      record: "录音",
      cancel: "取消",
      confirm: "确定",
      clickToStartRecording: "点击开始录音",
      clickToResumeRecording: "点击继续录音"
    },
    dialogSelect: {
      treeSearch: "请输入关键字并回车"
    },
    loadList: {
      errorText: "出错了",
      loadingText: "加载中...",
      finishedText: "没有更多了"
    }
  },
  validation: {
    array: {
      len: "%s 的长度必须为 %s",
      min: "%s 长度不能小于 %s",
      max: "%s 的长度不能大于 %s",
      range: "%s 的长度必须介于 %s 和 %s 之间"
    },
    date: {
      format: "%s 日期 %s 对于格式 %s 无效",
      invalid: "%s 日期 %s 无效",
      parse: "无法分析 %s 日期， %s 无效"
    },
    default: "%s 字段校验错误",
    enum: "%s 必须是 %s 中的一个",
    number: {
      len: "%s 必须等于 %s",
      min: "%s 不能小于 %s",
      max: "%s 不能大于 %s",
      range: "%s 必须介于 %s 和 %s 之间"
    },
    pattern: {
      mismatch: "%s 值%s 与模式 %s 不匹配"
    },
    required: "必填",
    string: {
      len: "%s 必须是 %s 个字符",
      min: "%s 必须至少为 %s 个字符",
      max: "%s 不能大于 %s 个字符",
      range: "%s 必须介于 %s 和 %s 个字符之间"
    },
    types: {
      acceptFile: "只接受文件",
      acceptImg: "只接受图片格式",
      array: "非法数组",
      boolean: "非法布尔值",
      date: "不符合规则的日期格式",
      dateTime: "不符合规则的日期时间格式",
      dateYM: "不符合规则的日期格式(yyyy-mm)",
      dateYMD: "不符合规则的日期格式(yyyy-MM-dd)",
      digits: "非法纯数字",
      email: "非法邮件地址",
      fileSize: "文件大小的格式不正确,应如 3kb",
      float: "非法浮点数",
      hex: "非法十六进制",
      integer: "非法整数",
      longDateTime: "不符合规则的长日期格式",
      method: "必须是函数（Function）",
      number: "非法数字",
      object: "非法对象",
      regexp: "非法正则表达式",
      specialch: "只能包含数字、字母、下划线、横杠、点号",
      specialch2: "只能包含数字、字母、下划线、横杠",
      speczh: "只能包含数字、字母、下划线、汉",
      string: "非法字符串",
      time: "不符合规则的时间格式",
      url: "非法 URL 地址",
      version: "非法版本格式"
    },
    whitespace: "%s 不能为空"
  }
}, ke = {
  "en-US": "English",
  "zh-CN": "Chinese",
  "zh-TW": "中国台湾",
  hello: "Hello {name}",
  code: "en-US",
  yes: "Yes",
  no: "No",
  ui: {
    input: {
      close: "Close",
      more: "More",
      detail: "Detailed Info"
    },
    numeric: {
      equalTo: "Equal to",
      notEqualTo: "Not equal to",
      moreThan: "Greater than",
      moreThanOrEqualTo: "Greater than or equal to",
      lessThan: "Less than",
      lessThanOrEqualTo: "Less than or equal to",
      empty: "Null",
      nonEmpty: "Not null"
    },
    queryBuilder: {
      addItem: "Add Rule",
      addGroup: "Add Rule Group",
      removeGroup: "Del Rule Group"
    },
    wizard: {
      previousStep: "Previous",
      nextStep: "Next",
      save: "Save",
      submit: "Submit"
    },
    linkMenu: {
      title: "",
      placeholder: "Enter a keyword.",
      sure: "OK",
      cancel: "Cancel"
    },
    todoList: {
      add: "Add",
      placeholder: "please input your todo things"
    },
    alert: {
      error: "Error",
      info: "Information",
      success: "Success",
      title: "Information",
      warning: "Warning"
    },
    amount: {
      currency: "Currency",
      amount: "Amount",
      date: "Date",
      equalTo: "Equal to",
      notEqualTo: "Not equal to",
      moreThan: "Greater than",
      moreThanOrEqualTo: "Greater than or equal to",
      lessThan: "Less than",
      lessThanOrEqualTo: "Less than or equal to",
      empty: "Null",
      nonEmpty: "Not null"
    },
    actionMenu: {
      moreText: "More"
    },
    base: {
      all: "All",
      cancel: "Cancel",
      confirm: "OK",
      delete: "Delete",
      edit: "Edit",
      more: "More",
      reset: "Reset",
      clear: "Clear",
      comma: ","
    },
    button: {
      cancel: "Cancel",
      confirm: "Confirm"
    },
    buttonGroup: {
      noData: "No data"
    },
    buttonMessage: {
      cancel: "Cancel",
      confirm: "Confirm"
    },
    cell: {
      placeholder: "--Select--"
    },
    cascader: {
      noMatch: "No matches",
      loading: "Loading",
      placeholder: "--Select--",
      noData: "No data available."
    },
    chart: {
      auxiliary: "Auxiliary",
      emptyText: "No Data",
      kName: "Day K",
      other: "Other",
      summation: "Summation",
      total: "Total",
      value: "Value"
    },
    colorSelectPanel: {
      confirm: "Select",
      cancel: "Cancel",
      predefine: "Default Colors",
      history: "Recent Colors",
      empty: "None"
    },
    crop: {
      choose: "choose image",
      zoomOut: "zoom out 10%",
      zoomIn: "zoom in 10%",
      rotate_45: "rotate -45°",
      rotate45: "rotate 45°",
      closeCropArea: "hide selection",
      reset: "reset",
      cropImage: "crop image",
      croppedImage: "Target image"
    },
    datepicker: {
      clear: "Clear",
      cancel: "Cancel",
      endDate: "End Date",
      confirm: "OK",
      month: "Month",
      endTime: "End Time",
      month2: "Feb",
      month1: "Jan",
      month4: "Apr",
      month3: "Mar",
      month6: "Jun",
      month5: "May",
      month8: "Aug",
      month7: "Jul",
      month10: "Oct",
      month9: "Sep",
      month12: "Dec",
      month11: "Nov",
      months: {
        feb: "February",
        jan: "January",
        apr: "April",
        mar: "March",
        jun: "June",
        may: "May",
        aug: "August",
        jul: "July",
        oct: "October",
        sep: "September",
        dec: "December",
        nov: "November"
      },
      nextYear: "Next year",
      nextMonth: "Next Month",
      prevMonth: "Previous Month",
      now: "Now",
      selectDate: "Select a date.",
      prevYear: "Previous year",
      startDate: "Start Date",
      selectTime: "Select a time.",
      today: "Today",
      currentMonth: "This Month",
      startTime: "Start Time",
      week: "Week",
      weeks: {
        mon: "Mon",
        sun: "Sun",
        wed: "Wed",
        tue: "Tue",
        thu: "Thu",
        sat: "Sat",
        fri: "Fri"
      },
      timezone: "Select a time zone.",
      year: "Year",
      hour: "hour",
      minute: "minute",
      second: "second",
      to: "-",
      yearMonth: "{month} {year}",
      yearMonthDay: "{month} {day}, {year}"
    },
    richTextEditor: {
      bold: "bold",
      italic: "Italic",
      link: "Link",
      unlink: "Unlink",
      highlight: "Highlight",
      underline: "Underline",
      strike: "Strikethrough",
      subscript: "Subscript",
      superscript: "Superscript",
      code: "Coding",
      unorderedlist: "Bullet Lists",
      orderedlist: "Numbered Lists",
      taskList: "Multi-level Lists",
      quote: "Reference",
      codeBlock: "Code Block",
      formatClear: "Clear Formatting",
      nodeDelete: "node delete",
      undo: "Undo",
      redo: "Redo",
      left: "Left-Aligned",
      center: "Centered",
      right: "Right-Aligned",
      fontSize: "Font Size",
      lineHeight: "Line Spacing",
      hBox: "Headings",
      img: "Picture",
      color: "Text Color",
      table: "Table",
      backgroundColor: "Background Color",
      localResources: "Upload Local File",
      resourceLink: "Past Link"
    },
    calendar: {
      showType: {
        year: "Year"
      }
    },
    dept: {
      code: "Code",
      company: "Company",
      dept1: "Level-1 Dept.",
      dept2: "Level-2 Dept.",
      dept3: "Level-3 Dept.",
      dept4: "Level-4 Dept.",
      dept5: "Level-5 Dept.",
      dept6: "Level-6 Dept.",
      dept7: "Level-7 Dept.",
      dept8: "Level-8 Dept.",
      input: "Enter a department code ID or name.",
      name: "Name",
      search: "Auxiliary Search",
      selected: "Selected"
    },
    dialogBox: {
      confirm: "OK",
      cancel: "Cancel"
    },
    load: {
      dot: "Loading…"
    },
    exception: {
      build: "Building",
      busy: "The network is busy. Please wait",
      noperm: "Not find the page",
      weaknet: "Poor network performance",
      pcview: "View the file on the PC",
      nodata: "Get some rest",
      create: "Create",
      provide: "Provided by the TINY Team DEV",
      nodatamf: "No data available.",
      nopermmf: "Insufficient permissions.",
      weaknetmf: "Network error.",
      noresult: "No results found.",
      nonews: "No messages.",
      pagenoperm: "403 Forbidden",
      pageweaknet: "Network error.",
      pagenothing: "404 Not Found",
      pageservererror: "500 Internal Server Error"
    },
    fileUpload: {
      largefile: "The file is too large and will be uploaded in segments. Please wait.",
      folder: "The file cannot be uploaded because it is more than five-folder levels deep.",
      init: "Service error. Please try again.",
      token="<REDACTED_CREDENTIAL>",
      exceed: "The file size exceeds the upper limit ({maxSize}).",
      largeFile: "The file exceeds 2 GB.",
      fileSize: "The file is less than the minimum size ({minSize} {sizeUnit}).",
      deleteTip: "Press the Delete key.",
      downloadFile: "Download",
      previewFile: "Preview",
      updateFile: "Update",
      reUploadFile: "Upload Again",
      cancelFile: "Cancel Upload",
      deleteFile: "Delete",
      empty: "The file is empty.",
      kiaScanTip: "KIA needs to verify the download of documents from the public network. The current document is being checked by KIA. Try again later.",
      fileNameExceeds: "The file name contains more than 255 characters. Shorten the file name.",
      fileName: "This file name",
      calcHash: "The document is being analyzed and encrypted.",
      uploadFile: "Upload",
      downloadAll: "Download All",
      onlySupport: "Only {type} files are supported.",
      fileNotLessThan: "A single file cannot be less than ",
      fileNotMoreThan: "A single file cannot exceed ",
      fileSizeRange: "The size of a single file must range from {moreThan} to {lessThan}.",
      notSupport: "The format (.{format}) is not supported.",
      notSupportNoSuffix: "Files without file name extensions are not supported.",
      notSupportSpecialCharacters: "Special characters not allowed. Rename the file and upload it again.",
      attachment: "Attachments",
      uploadList: "File List",
      numberExceed: "Too many files in this batch. Max. supported: {number}",
      numberLimit: "Maximum files per batch: {number}",
      encryptDialogTitle: "Watermark and Encryption",
      addWatermark: "Add Watermark",
      encrypted: "Encryption",
      docPreview: "Preview",
      networkError: "Network error.",
      pictureNetworkError: "Network error. File upload failed.",
      reUploadTip: "{number} files failed to be uploaded."
    },
    uploadList: {
      pictureUploading: "Uploading",
      uploadFailed: "Upload failed",
      uploading: "Uploading",
      download: "Download",
      reUpload: "Upload Again",
      delete: "Delete",
      noAttachments: "No attachments available.",
      cancel: "Cancel",
      preview: "Preview",
      releaseAndUpload: "Release mouse capture to upload the file.",
      dragOrClickImport: "Drag a file here or click to import.",
      shoot: "Take Photo or Video",
      selectFromAlbum: "Select from Album",
      uploadFailedAndReupload: "Upload failed. Please try again."
    },
    upload: {
      addPicture: "Add Picture",
      addAudio: "Add Audio",
      addVideo: "Add Video"
    },
    grid: {
      dataUnchanged: "Data remains unchanged.",
      deleteSelectRecord: "Delete the selected records?",
      emptyText: "No data available.",
      error: {
        delRevert: "The <strong>revert</strong> method has been deprecated. Use <strong>revertData</strong> instead.",
        groupFixed: "If you want to use grouping headers, place the fixed columns on the left and right sides.",
        notDelete: "The <strong>delete</strong> method does not exist.",
        notQuery: "The <strong>query</strong> method does not exist.",
        notResizable: "Horizontal virtual scrolling cannot be resized.",
        notSave: "The <strong>save</strong> method does not exist.",
        reqModule: "The module {{name}} is missing.",
        rowIdEmpty: "The <strong>row-id</strong> parameter is required.",
        scrollYHeight: "The height or max-height must be specified before enabling virtual scrolling.",
        toolbarId: "A unique ID is required for the toolbar.",
        treeFixedExpand: "The fixed column conflicts with row expansion in the tree structure.",
        treeInsert: "The tree structure does not support the <strong>insert</strong> operation.",
        treeRemove: "The tree structure does not support the <strong>remove</strong> operation.",
        unableInsert: "Unable to insert data to the specified location.",
        notAllowDragSelf: "Self dragging is not allowed.",
        notAllowDragFixed: "Fixed columns cannot be dragged.",
        remoteMethod: "The <strong>multipleHistory.remoteSelectedMethod</strong> must be set for the remote storage of personalized template management.",
        remoteSelectedMethod: '"remoteSelectedMethod" needs to be set for remote storage for personalized template management.',
        chainCallError: "There are syntax errors in the default slot.",
        renderParamError: "A rendering method is required for generating VNode.",
        classComponentError: "There was an error in the class component rendering.",
        groupColumnFixedError: "Each group must have the same type.",
        missingValueFormat: "The renderer cannot format the date character string. The valueFormat source date format is required.",
        clipboardWriteError: "Clipboard write error."
      },
      filter: {
        allSelect: "All",
        endDate: "End Date",
        startDate: "Start Date",
        dateTips: "Select at least one date.",
        clear: "Clear Filter Criteria from Current Column",
        clearAll: "Clear Filter Criteria from All Columns",
        confirmFilter: "Filter",
        empty: "Empty",
        emptyText: "No data available.",
        equal: "Equal to",
        include: "Contains",
        prefix: "Starts with",
        resetFilter: "Reset",
        unempty: "Not empty"
      },
      individuation: {
        cancelBtn: "Cancel",
        colConfigs: {
          asc: "Ascending",
          desc: "Descending",
          frozenLeft: "Freeze left",
          frozenRight: "Freeze right",
          invisible: "Hide",
          unsorted: "Unsorted",
          unfrozen: "Unfrozen",
          visible: "Show",
          unfreeze: "Unfreeze",
          unsort: "Unsort"
        },
        toolbar: {
          set: "Operation",
          selected: "Selected",
          freeze: "Frozen",
          sort: "Sorting",
          clear: "Clear",
          search: "Search",
          all: "All"
        },
        columnSet: "Set Columns",
        overwriteSave: "Overwrite and Save",
        saveAs: "Save As",
        saveTemplate: "Save",
        selectTemplate: "Select",
        hideMsg: "There must be at least one column.",
        maxFreezeNumMsg: "A maximum of 6 columns can be frozen.",
        defaultTemplateName: "Enter a name. If no name is specified, a name will be automatically generated based on the time.",
        reserveTemplateName: "If no new name is specified, the original name will be kept.",
        resetBtn: "Reset",
        saveBtn: "OK",
        hideAll: "Hide All",
        showAll: "Show All",
        tabs: {
          base: {
            title: "Basic Settings",
            tips: "Click the icons to customize the display style."
          },
          other: {
            allDataSort: "All data",
            currPageSort: "Current page",
            pageSize: "Records per Page",
            title: "Other Settings",
            tips: "Set sorting for servers or clients and the number of records on each page.",
            sortType: "Sorting Data"
          }
        },
        title: "Custom Settings",
        switchtitle: "Manage",
        switchsave: "Save",
        switchlabel: "Configuration List:",
        switchapply: "Use",
        switchedit: "Edit",
        switchdel: "Delete",
        switchdelconfirm: "Deletion Confirmation",
        switchconfirm: "Confirm",
        switchonlytemp: "Save",
        switchtempapply: "Save and Use",
        switchtempoverwrite: "Overwrite and Use",
        switchdelcon: "Delete this template?",
        switchdelyes: "Confirm",
        switchdelno: "Cancel",
        switchapplycon: "Use this template??"
      },
      removeSelectRecord: "Remove the selected records?",
      saveSuccess: "Saved successfully.",
      selectOneRecord: "Select at least one record.",
      isSaveMsg: "Some data has been modified. Save the changes?"
    },
    hrapprover: {
      approver: "Authorized Approver",
      noapprover: "No authorized approver.",
      noselected: "No authorized approver selected.",
      remark: "Remarks"
    },
    imageViewer: {
      loadErrorAlt: "Loading failed.",
      save: "Save",
      del: "Delete",
      thumbnail: "Thumbnail",
      menu: "Directory",
      hide: "Hide Sidebar",
      show: "Show Sidebar"
    },
    navMenu: {
      moreText: "More"
    },
    logout: {
      in: "Logged in",
      out: "Logged out"
    },
    page: {
      goto: "Go to",
      item: "items",
      next: "Next",
      page: "",
      pageClassifier: "",
      pagesize: "",
      prev: "Previous",
      total: "Total:",
      totals: "Total:",
      jump: "Go to",
      hundredThousand: "100,000+",
      million: "1 million+",
      tenMillion: "10 million+",
      loadingTotals: "Loading the total number of items..."
    },
    popeditor: {
      cancel: "Cancel",
      confirm: "OK",
      historyLists: "History",
      reset: "Reset",
      search: "Query",
      selectionLists: "Selected",
      sourceLists: "All",
      title: "Select",
      filterNode: "Enter a keyword."
    },
    popupload: {
      fileName: "Name",
      fileSize: "Size",
      fileStatus: "Status",
      dialogTitle: "Upload Files",
      cancelButtonText: "Cancel",
      tipsFileText: "Info",
      uploadError: "Upload failed.",
      uploadButtonText: "Upload",
      uploadSuccess: "Upload completed.",
      saveButtonText: "Select File",
      uploadsButtonText: "Select Files",
      errorTypeTips: "Invalid file format.",
      errorSizeTips: "File too large.",
      confirmDeleteTips: "Are you sure you want to delete this file?",
      delete: "Delete",
      waitUpload: "Waiting for upload",
      operation: "Operation",
      success: "Upload successful",
      listTip: "There are a total of {0} pieces of data: ",
      errorListTip: "There are {0} errors in them. Please modify them and try again",
      limitUploadFileType: "Supported file formats: ",
      limitUploadFileNumber: "Maximum files allowed: ",
      limitUploadFileSize: "Maximum file size: ",
      errorNumTips: "The number of uploaded files exceeds the limit. The operation has been cancelled"
    },
    rate: {
      level: {
        average: "Acceptable",
        excellent: "Very Good",
        fair: "Poor",
        good: "Good",
        poor: "Very Poor"
      }
    },
    select: {
      loading: "Loading...",
      noData: "No data available.",
      noMatch: "No matches.",
      placeholder: "--Select--",
      pleaseSearch: "Enter a keyword.",
      search: "Search",
      selected: "Selected",
      selectedNum: "{num} selected",
      noSearchData: "No matches. Enter another keyword.",
      add: "Add",
      collapse: "Collapse"
    },
    search: {
      placeholder: "Search"
    },
    signature: {
      confirm: "Done",
      rewrite: "Re-sign",
      cancel: "Cancel",
      tips: "Handwritten signature required.",
      resign: "Re-sign",
      placeholder: "Please sign here (mandatory)."
    },
    tabs: {
      moreItem: "More"
    },
    tag: {
      add: "Add"
    },
    toggleMenu: {
      placeholder: "Enter a keyword."
    },
    treeMenu: {
      placeholder: "Enter a keyword."
    },
    transfer: {
      filterPlaceholder: "Enter a keyword.",
      hasCheckedFormat: "{checked}/{total} checked",
      noData: "No data available.",
      noMatch: "No matches.",
      noCheckedFormat: "{total} items",
      titles: ["List 1", "List 2"]
    },
    tree: {
      loading: "Loading...",
      emptyText: "No data available.",
      switchText: "Select child nodes",
      edit: "Edit",
      delete: "Delete",
      addChild: "Add Child",
      newNodeTitle: "Add Child Node",
      deleteTip1: "Deleted data cannot be restored. Are you sure you want to continue?",
      deleteTip2: "This node has child nodes. Do you want to retain the child nodes?",
      deleteTip3: "Retain child nodes"
    },
    usercard: {
      address: "Address",
      collapse: "Show less",
      email: "Email",
      empno: "Employee ID",
      expand: "Show more",
      fax: "Fax",
      internal: "Extension",
      manager: "Supervisor",
      mobile: "Mobile",
      other: "Additional Info",
      phone: "Landline",
      timezone: "Time Zone",
      travelcode: "Out-of-Office Message for a Business Trip",
      viop: "VIOP"
    },
    richText: {
      bold: "Bold",
      italic: "Tilt",
      underline: "Underline",
      header: "Paragraph Format",
      strike: "Delete Line",
      blockquote: "Block Reference",
      codeBlock: "Insert Code Segment",
      size: "Font Size",
      listOrdered: "No. List",
      listBullet: "Project List",
      header1: "H1",
      header2: "H2",
      align: "Alignment Mode",
      color: "Font Color",
      background: "Background Color",
      image: "Image",
      video: "Video",
      link: "Add Link",
      formula: "Insert Function",
      clean: "Clear Format",
      indent1: "Indent To The Left",
      indent2: "Indent To The Right",
      pickerLabel: "Title Size",
      headerPicker1: "Title 1",
      headerPicker2: "Title 2",
      headerPicker3: "Title 3",
      headerPicker4: "Title 4",
      headerPicker5: "Title 5",
      headerPicker6: "Title 6",
      normal: "Normal",
      sizeSmall: "Small",
      sizeLarge: "Large",
      sizeHuge: "Super Large Size",
      alignPicker1: "Align To The Left",
      alignPicker2: "Align In The Center",
      alignPicker3: "Align To The Right",
      alignPicker4: "Align The Two Ends",
      subScript: "Subscript",
      superScript: "Superscript",
      directionRTL: "Right To Left",
      font: "Font",
      file: "File",
      betterTable: "Table",
      fullscreen: "Fullscreen",
      insertColumnRight: "Insert Column Right",
      insertColumnLeft: "Insert Column Left",
      insertRowUp: "Insert Row Up",
      insertRowDown: "Insert Row Down",
      mergeCells: "Merge Cells",
      unmergeCells: "Split Cells",
      deleteColumn: "Delete Current Column",
      deleteRow: "Delete Current Row",
      deleteTable: "Delete Table",
      colorPicker: "Background Color",
      placeholder: "Insert text here...",
      maxLength: "Text Length exceeds the Limit, max Length config is "
    },
    fluentEditor: {
      undo: "Undo",
      redo: "Redo",
      lineheight: "Line Height"
    },
    steps: {
      done: "Completed",
      doing: "In Progress",
      wait: "Pending"
    },
    actionSheet: {
      cancel: "Cancel"
    },
    image: {
      loadFail: "Loading failed."
    },
    miniPicker: {
      cancel: "Cancel",
      confirm: "OK"
    },
    pullRefresh: {
      pullingDown: "Pull down to refresh.",
      pullingUp: "Pull up to refresh.",
      pulling: "Pull down to refresh.",
      loosing: "Release to refresh.",
      success: "Refreshed.",
      failed: "Refresh failed.",
      noMore: "No more data."
    },
    currency: {
      defaultCurrency: "Default",
      setDefault: "Set as default",
      chooseCurrency: "Select Currency"
    },
    calendarBar: {
      week: {
        0: "Sun",
        1: "Mon",
        2: "Tue",
        3: "Wed",
        4: "Thu",
        5: "Fri",
        6: "Sat"
      },
      year: "%s",
      yearMonth: "%m %y",
      month: {
        1: "Jan",
        2: "Feb",
        3: "Mar",
        4: "Apr",
        5: "May",
        6: "Jun",
        7: "Jul",
        8: "Aug",
        9: "Sep",
        10: "Oct",
        11: "Nov",
        12: "Dec"
      },
      monthAbbr: {
        1: "Jan",
        2: "Feb",
        3: "Mar",
        4: "Apr",
        5: "May",
        6: "Jun",
        7: "Jul",
        8: "Aug",
        9: "Sept",
        10: "Oct",
        11: "Nov",
        12: "Dec"
      }
    },
    calendarView: {
      week: {
        0: "Sun",
        1: "Mon",
        2: "Tue",
        3: "Wed",
        4: "Thu",
        5: "Fri",
        6: "Sat"
      },
      weekDays: {
        0: "SUN",
        1: "MON",
        2: "TUE",
        3: "WED",
        4: "THU",
        5: "FRI",
        6: "SAT"
      },
      backToday: "Today",
      new: "Add",
      noSchedule: "No Schedule",
      year: "",
      month: "",
      dateFormat: "yyyy-MM"
    },
    selectedBox: {
      select: "Selected (%s)",
      allSelect: "All Selected (%s)",
      clear: "Clear",
      noData: "No data"
    },
    record: {
      record: "Recording",
      cancel: "Cancel",
      confirm: "OK",
      clickToStartRecording: "Click to record.",
      clickToResumeRecording: "Click to continue recording."
    },
    dialogSelect: {
      treeSearch: "Enter a keyword and press Enter."
    },
    loadList: {
      errorText: "Something went wrong.",
      loadingText: "Loading...",
      finishedText: "There's no more."
    }
  },
  validation: {
    array: {
      len: "This field must contain %s characters.",
      min: "This field must contain %s characters or more.",
      max: "This field must contain %s characters or less.",
      range: "This field must have %s to %s characters."
    },
    date: {
      format: "The date %s does not match the %s format.",
      invalid: "%s is invalid.",
      parse: "Unable to parse %s, %s is invalid"
    },
    default: "%s field verification error.",
    enum: "Must be one of %s",
    number: {
      len: "The value must be %s.",
      min: "The value must be %s or larger.",
      max: "The value must be %s or less.",
      range: "The value must be between %s and %s."
    },
    pattern: {
      mismatch: "The value %s does not match %s."
    },
    required: "Required field",
    string: {
      len: "This field must contain %s characters.",
      min: "This field must contain at least %s characters.",
      max: "This field can contain a maximum of %s characters.",
      range: "This field must contain %s to %s characters."
    },
    types: {
      acceptFile: "Only files are supported.",
      acceptImg: "Only images are supported.",
      array: "Invalid array.",
      boolean: "Invalid boolean value.",
      date: "Invalid date format.",
      dateTime: "Invalid date and time format.",
      dateYM: "The date format (y-mm) does not comply with the rule.",
      dateYMD: "The date format (y-MM-dd) does not comply with the rule.",
      digits: "Invalid number only.",
      email: "Invalid email address.",
      fileSize: "The file size is not in the correct format, such as 3kb.",
      float: "Invalid floating point number.",
      hex: "Invalid hexadecimal number.",
      integer: "Invalid integer.",
      longDateTime: "Invalid long date format.",
      method: "Must be a function.",
      number: "Invalid number.",
      object: "Invalid object.",
      regexp: "Invalid regular expression.",
      specialch: "Only digits, letters, underscores (_), hyphens (-), and dots (.) are allowed.",
      specialch2: "Only digits, letters, underscores (_), and hyphens (-) are allowed.",
      speczh: "Only digits, letters, and underscores (_) are allowed.",
      string: "Invalid string.",
      time: "Invalid time format.",
      url: "Invalid URL.",
      version: "Invalid version format."
    },
    whitespace: "This field cannot be left blank."
  }
}, mn = /(%|)\{([0-9a-zA-Z_]+)\}/g;
function hn(e) {
  for (var r = arguments.length, t = new Array(r > 1 ? r - 1 : 0), n = 1; n < r; n++)
    t[n - 1] = arguments[n];
  return t.length === 1 && typeof t[0] == "object" && (t = t[0]), (!t || !t.hasOwnProperty) && (t = {}), e.replace(mn, function(a, o, l, i) {
    var s;
    return e[i - 1] === "{" && e[i + a.length] === "}" ? l : (s = Object.prototype.hasOwnProperty.call(t, l) ? t[l] : null, s ?? "");
  });
}
var _ = ie, V = null, le = function(r, t) {
  if (t === void 0 && (t = void 0), V) return V.apply(this, arguments);
  for (var n = r.split("."), a = null, o = _, l = 0, i = n.length; l < i; l++) {
    var s = n[l];
    if (a = o[s] || "", l === i - 1) return hn(a, t);
    if (!a) return "";
    o = a;
  }
  return "";
}, mt = function(r) {
  return _ = r || _, _;
}, gn = function() {
  return _.code;
}, ht = function(r) {
  return V = r || le, V;
}, Ie = oe, gt = function(r) {
  var t = r.app, n = r.createI18n, a = r.messages, o = a === void 0 ? {} : a, l = r.i18n, i = l === void 0 ? {} : l, s = r.merge;
  typeof s != "function" && (s = function(f) {
    var p = f.lang, g = f.i18n, v = f.messages;
    return Ie(!0, p, g.messages, v);
  });
  var c = {
    zhCN: ie,
    enUS: ke
  };
  if (typeof n == "function") {
    var u = n({
      legacy: i.legacy,
      locale: i.locale || "zhCN",
      messages: s({
        lang: c,
        i18n: i,
        messages: o
      })
    });
    return V = function(f, p) {
      return u.global.t(f, p);
    }, u;
  }
  return t && t.config && t.config.globalProperties && (t.config.globalProperties.$t = le), s({
    lang: c,
    i18n: i,
    messages: o
  });
}, vt = !0, yt = !1, vn = {
  isVue2: vt,
  isVue3: yt,
  use: mt,
  t: le,
  i18n: ht,
  initI18n: gt,
  extend: Ie,
  zhCN: ie,
  enUS: ke
}, D = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: vn,
  enUS: ke,
  extend: Ie,
  i18n: ht,
  initI18n: gt,
  isVue2: vt,
  isVue3: yt,
  language: gn,
  t: le,
  use: mt,
  zhCN: ie
}, Symbol.toStringTag, {
  value: "Module"
}));
D.use;
var _e = D.t;
D.i18n;
D.initI18n;
D.extend;
D.zhCN;
D.enUS;
D.language;
const bt = typeof window > "u", Po = (e, r, t, n = !1) => {
  e && r && t && e.addEventListener(r, t, n);
}, Fo = (e, r, t, n = !1) => {
  e && r && e.removeEventListener(r, t, n);
}, Do = (e, r = "") => {
  if (!e)
    return;
  r.split(" ").filter((n) => n).forEach((n) => e.classList.add(n));
}, No = (e, r) => {
  if (!e || !r)
    return;
  r.split(" ").filter((n) => n).forEach((n) => e.classList.remove(n));
}, zo = () => {
  const e = window;
  let r = e.document.documentElement, t = e.document.body;
  return {
    scrollTop: r.scrollTop || t.scrollTop,
    scrollLeft: r.scrollLeft || t.scrollLeft,
    visibleHeight: r.clientHeight || t.clientHeight,
    visibleWidth: r.clientWidth || t.clientWidth
  };
}, yn = (e) => {
  if (bt)
    return !1;
  if (e) {
    const r = getComputedStyle(e);
    if (r.getPropertyValue("position") === "fixed") {
      if (r.getPropertyValue("display") === "none")
        return !0;
      if (e.parentNode !== document.body)
        return yn(e.parentNode);
    } else
      return e.offsetParent === null;
  }
  return !1;
};
function bn(e, r, t, n) {
  let a, o = 0;
  typeof r != "boolean" && (n = t, t = r, r = void 0);
  function l() {
    const s = this, c = (/* @__PURE__ */ new Date()).valueOf() - o, u = arguments;
    function d() {
      o = (/* @__PURE__ */ new Date()).valueOf(), t.apply(s, u);
    }
    function f() {
      a = void 0;
    }
    n && !a && d(), a && clearTimeout(a);
    const p = n === void 0;
    p && c > e ? d() : r !== !0 && (a = setTimeout(n ? f : d, p ? e - c : e));
  }
  function i() {
    a && (clearTimeout(a), a = null);
  }
  return l._cancel = i, l;
}
function wn(e, r, t) {
  return bn(e, r, !1);
}
const Tn = ({ getCurrentInstance: e, isVue2: r, nextTick: t, onUnmounted: n }) => () => {
  const a = e().proxy;
  r || Object.defineProperty(a, "$scopedSlots", { configurable: !0, value: null }), Object.defineProperty(a, "instanceSlots", {
    configurable: !0,
    get: () => a.$scopedSlots || a.$slots
  }), n(() => {
    t(() => {
      r || delete a.$scopedSlots, delete a.instanceSlots;
    });
  });
}, Sn = () => {
}, xn = ({ onMounted: e, onActivated: r, nextTick: t }) => (n) => {
  let a;
  e(() => {
    n(), t(() => a = !0);
  }), r(() => a && n());
}, Cn = ({
  computed: e,
  getCurrentInstance: r,
  inject: t,
  markRaw: n,
  nextTick: a,
  onMounted: o,
  onActivated: l,
  onUnmounted: i,
  provide: s,
  reactive: c,
  toRef: u
}) => ({ relationKey: d, relationContainer: f, onChange: p, childrenKey: g, delivery: v } = {}) => {
  if (!d)
    throw new Error("[TINY Error]<relationKey> must exist.");
  const h = r(), b = c({ children: [], indexInParent: -1 }), y = t(d, null);
  let T = [];
  if (y) {
    const { link: S, unlink: x, callbacks: C, childrenKey: A, delivery: E } = y;
    T = C, g = g || A || "instanceChildren", v = E, b.indexInParent = S(h), i(() => x(h));
  } else {
    g = g || "instanceChildren";
    const S = xn({ onMounted: o, onActivated: l, nextTick: a }), x = p ? () => a(p) : Sn;
    let C;
    a(() => {
      const A = typeof f == "function" ? f() : f;
      A && (C = new MutationObserver((E, N) => {
        const U = [];
        wt(A.childNodes, U), T.forEach((se) => se(U, E, N)), x();
      }), C.observe(A, { attributes: !0, childList: !0, subtree: !0 }));
    }), S(() => x()), i(() => {
      C && (C.disconnect(), C = null), T = null;
    });
  }
  const k = (S) => {
    const x = S.proxy;
    return b.children.push(n(x)), e(() => b.children.indexOf(x));
  }, I = (S) => {
    const x = b.children.indexOf(S.proxy);
    x > -1 && b.children.splice(x, 1);
  };
  return T.push((S) => An(b.children, S)), s(d, { link: k, unlink: I, callbacks: T, childrenKey: g, delivery: v }), Object.defineProperty(h.proxy, g, { configurable: !0, get: () => b.children }), i(() => delete h.proxy[g]), { children: u(b, "children"), index: u(b, "indexInParent"), delivery: v };
}, wt = (e, r) => {
  e.length && e.forEach((t) => {
    r.push(t), t.childNodes && wt(t.childNodes, r);
  });
}, An = (e, r) => {
  e.sort((t, n) => r.indexOf(t.$el) - r.indexOf(n.$el));
};
function R() {
  return R = Object.assign ? Object.assign.bind() : function(e) {
    for (var r = 1; r < arguments.length; r++) {
      var t = arguments[r];
      for (var n in t) ({}).hasOwnProperty.call(t, n) && (e[n] = t[n]);
    }
    return e;
  }, R.apply(null, arguments);
}
var Tt = function() {
  var r = {}, t = function(o, l, i) {
    if (i === void 0 && (i = !1), o && typeof o == "string" && typeof l == "function") {
      var s = r[o] || [];
      r[o] = s, s.push(l), l.once = i;
    }
  }, n = {
    emit: function(o) {
      var l = arguments, i = r[o];
      i && (i.forEach(function(s) {
        return s.apply(null, [].slice.call(l, 1));
      }), r[o] = i.filter(function(s) {
        return !s.once;
      }));
    },
    on: t,
    once: function(o, l) {
      t(o, l, !0);
    },
    off: function(o, l) {
      if (o && typeof o == "string") {
        var i = r[o];
        typeof l == "function" ? r[o] = i.filter(function(s) {
          return s !== l;
        }) : delete r[o];
      } else
        r = {};
    }
  };
  return n;
}, kn = function(r, t) {
  t === void 0 && (t = {});
  var n = {};
  for (var a in r)
    a.indexOf("_") !== 0 && (n[a] = r[a]);
  for (var o in t)
    n[o] = t[o];
  return n;
}, In = function(r, t) {
  if (r === void 0 && (r = {}), typeof t == "object") {
    var n = Array.isArray(t) ? t : Object.keys(t).filter(function(o) {
      return t[o];
    }), a = "";
    return n.forEach(function(o) {
      r[o] && (a += r[o] + " ");
    }), a;
  } else
    return r[t] || "";
}, En = m.defineAsyncComponent, Ln = m.markRaw, St = function(r) {
  var t = r.view, n = t === void 0 ? void 0 : t, a = r.component, o = a === void 0 ? void 0 : a, l = r.props, i = r.context, s = i.attrs, c = i.slots, u = r.extend, d = u === void 0 ? {} : u;
  return function() {
    return m.h(n && n.value || o, R({
      ref: "modeTemplate"
    }, l, s, d), c);
  };
}, Ee = function(r) {
  var t = m.getCurrentInstance();
  return r && xt(t), t == null ? void 0 : t.appContext.config.globalProperties;
}, Mn = function() {
  var r, t = m.getCurrentInstance(), n = t == null || (r = t.type) == null ? void 0 : r.name;
  if (!n) {
    var a, o;
    n = t == null || (a = t.parent) == null || (o = a.type) == null ? void 0 : o.name;
  }
  return n || "";
}, On = function() {
  var r;
  return ((r = m.getCurrentInstance()) == null ? void 0 : r.appContext) || {
    component: function() {
    }
  };
}, Pn = function() {
  var r = m.getCurrentInstance();
  return (r == null ? void 0 : r.appContext.config.globalProperties) || {};
}, Fn = function(r) {
  var t;
  r === void 0 && (r = m.getCurrentInstance());
  var n = (t = r) == null ? void 0 : t.appContext.config.globalProperties.$router, a = n && n.currentRoute.value;
  return {
    route: a,
    router: n
  };
}, xt = function(r) {
  var t = Tt();
  typeof r.$emitter > "u" && Object.defineProperty(r, "$emitter", {
    get: function() {
      return t;
    }
  });
}, Dn = function(r) {
  var t = function(a, o, l, i) {
    var s = a.subTree && a.subTree.children || a.children;
    Array.isArray(s) && s.forEach(function(c) {
      var u = c.type && c.type.componentName, d = c.component;
      u === o ? (d.emit(l, i), d.$emitter && d.$emitter.emit(l, i)) : t(c, o, l, i);
    });
  };
  return {
    dispatch: function(a, o, l) {
      for (var i = r.parent || r.root, s = i.type && i.type.componentName; i && (!s || s !== a); )
        i = i.parent, i && (s = i.type && i.type.componentName);
      if (i) {
        var c, u;
        (c = i).emit.apply(c, [o].concat(l)), i.$emitter && (u = i.$emitter).emit.apply(u, [o].concat(l));
      }
    },
    broadcast: function(a, o, l) {
      t(r, a, o, l);
    }
  };
}, re = function(r) {
  if (r && r.parent) return r.parent.type.name === "AsyncComponentWrapper" && r.parent.parent ? r.parent.parent : r.parent;
}, Nn = function(r) {
  return function(t) {
    var n = re(r), a = 0, o = function(i) {
      return {
        level: a,
        vm: P({}, i),
        el: i.vnode.el,
        options: i.type
      };
    };
    if (typeof t != "function") return n ? o(n) : {};
    for (a++; n && !t(o(n)); )
      n = re(n), a++;
  };
}, zn = function(r) {
  return function(t) {
    if (typeof t != "function") return Ct(r.subTree);
    var n = 1, a = function(l) {
      if (l) {
        var i = l.children || l.dynamicChildren, s = n++;
        if (Array.isArray(i)) {
          if (i.some(function(c) {
            return c.component && t({
              level: s,
              vm: P({}, c.component),
              el: c.el,
              options: c.type,
              isLevel1: !0
            });
          })) return;
          i.forEach(function(c) {
            return a(c);
          });
        }
      }
    };
    a(r.subTree);
  };
}, jn = /^on[A-Z]/, Rn = function(r) {
  var t = {}, n = {};
  for (var a in r) {
    var o = r[a];
    if (jn.test(a) && typeof o == "function") {
      n[Xt(a.substr(2))] = o;
      continue;
    }
    t[a] = o;
  }
  return {
    $attrs: t,
    $listeners: n
  };
}, Ct = function(r) {
  var t = [];
  if (t.refs = {}, r) {
    var n = r.dynamicChildren || r.children;
    Array.isArray(n) ? n.forEach(function(a) {
      if (a.component) {
        var o = P({}, a.component);
        t.push(o), a.props.ref && (t.refs[a.props.ref] = o);
      }
    }) : r.component && t.push(P({}, r.component));
  }
  return t;
}, ce = function(r, t, n, a) {
  var o = function(s) {
    if (typeof a == "function" && a(s)) return 1;
    Object.defineProperty(r, s, {
      configurable: !0,
      enumerable: !0,
      get: function() {
        return t[n][s];
      },
      set: function(u) {
        return t[n][s] = u;
      }
    });
  };
  for (var l in t[n])
    o(l);
  return r;
}, Ve = function(r) {
  return r.indexOf("_") === 0;
}, At = function(r, t) {
  return ce(r, t, "setupState", null), ce(r, t, "props", Ve), ce(r, t, "ctx", Ve), r;
}, P = function(r, t, n) {
  n === void 0 && (n = null);
  var a = Rn(t.attrs), o = a.$attrs, l = a.$listeners, i = t.$emitter;
  i || (xt(t), i = t.$emitter);
  var s = function() {
    for (var d = arguments.length, f = new Array(d), p = 0; p < d; p++)
      f[p] = arguments[p];
    t.emit.apply(t, f), i.emit.apply(r, f);
  }, c = function(d, f, p) {
    return d[f] = p;
  };
  return n || At(r, t), Object.defineProperties(r, {
    $attrs: {
      get: function() {
        return o;
      }
    },
    $children: {
      get: function() {
        return Ct(t.subTree);
      }
    },
    $constants: {
      get: function() {
        return t.props._constants;
      }
    },
    $emit: {
      get: function() {
        return s;
      }
    },
    $el: {
      get: function() {
        return t.vnode.el;
      }
    },
    $listeners: {
      get: function() {
        return l;
      }
    },
    $mode: {
      get: function() {
        return t._tiny_mode;
      }
    },
    $nextTick: {
      get: function() {
        return m.nextTick;
      }
    },
    $off: {
      get: function() {
        return i.off;
      }
    },
    $on: {
      get: function() {
        return i.on;
      }
    },
    $once: {
      get: function() {
        return i.once;
      }
    },
    $options: {
      get: function() {
        return {
          componentName: t.type.componentName
        };
      }
    },
    $parent: {
      get: function() {
        return t.parent && P({}, re(t));
      }
    },
    $refs: {
      get: function() {
        return t.refs;
      }
    },
    $renderless: {
      get: function() {
        return t.props.tiny_renderless;
      }
    },
    $scopedSlots: {
      get: function() {
        return t.slots;
      }
    },
    $set: {
      get: function() {
        return c;
      }
    },
    $slots: {
      get: function() {
        return t.slots;
      }
    },
    $template: {
      get: function() {
        return t.props.tiny_template;
      }
    }
  }), r;
}, Un = function(r, t) {
  for (var n in r.refs)
    Object.prototype.hasOwnProperty.call(r.refs, n) && (t[n] = r.refs[n]);
}, $n = function(r, t) {
  var n, a, o = m.getCurrentInstance(), l = o == null ? void 0 : o.appContext.config.globalProperties, i = Fn(o), s = i.route, c = i.router, u = o == null || (n = o.proxy) == null || (a = n.$root) == null ? void 0 : a.$i18n, d = Dn(o), f = d.dispatch, p = d.broadcast, g = Nn(o), v = zn(o), h = P({}, o, r), b = r.emit, y = {}, T = typeof o.props.tiny_template > "u" && re(o), k = T ? P({}, T) : o.parent ? P({}, o.parent) : null, I = function(A) {
    var E, N = A.name, U = A.value, se = T ? T.ctx : o == null || (E = o.parent) == null ? void 0 : E.ctx;
    se[N] = U, k[N] = U;
  }, S = function(A) {
    Object.defineProperties(h, A), Object.defineProperties(o == null ? void 0 : o.ctx, A);
  }, x = function(A) {
    k && Object.defineProperties(k, A);
  };
  return m.onBeforeMount(function() {
    return At(h, o);
  }), m.onMounted(function() {
    return Un(o, y);
  }), {
    framework: "vue3",
    vm: h,
    emit: b,
    emitter: Tt,
    route: s,
    router: c,
    dispatch: f,
    broadcast: p,
    parentHandler: g,
    childrenHandler: v,
    i18n: u,
    refs: y,
    slots: o == null ? void 0 : o.slots,
    scopedSlots: o == null ? void 0 : o.slots,
    attrs: r.attrs,
    parent: k,
    nextTick: m.nextTick,
    constants: o == null ? void 0 : o.props._constants,
    mode: t,
    isPCMode: t === "pc",
    isMobileMode: t === "mobile",
    service: l == null ? void 0 : l.$service,
    getService: function() {
      return l == null ? void 0 : l.$getService(h);
    },
    setParentAttribute: I,
    defineInstanceProperties: S,
    defineParentInstanceProperties: x
  };
}, Y = function(r, t, n) {
  if (typeof r[t] < "u") {
    var a = r[t];
    r[n] = function(o, l, i) {
      i.context = l.instance, a(o, l, i);
    }, delete r[t];
  }
}, jo = function(r) {
  for (var t in r) {
    var n = r[t];
    Y(n, "inserted", "mounted"), Y(n, "bind", "beforeMount"), Y(n, "update", "updated"), Y(n, "unbind", "unmounted");
  }
  return r;
}, Ro = function(r) {
  return r;
}, Bn = m.Text, _n = m.Comment, Uo = function(r) {
  return !r || !r.type || [Bn, _n].includes(r.type);
}, Vn = function(r) {
  var t = {};
  for (var n in r)
    if (n === "class" || n === "style")
      t[n] = r[n];
    else if (n === "on" || n === "nativeOn") {
      var a = r[n];
      for (var o in a) t["on" + Kt(Yt(o))] = a[o];
    } else if (n === "attrs" || n === "props" || n === "domProps") {
      var l = r[n];
      for (var i in l) t[i] = l[i];
    } else
      t[n] = r[n];
  return t;
}, qn = function(r) {
  var t = r, n = !1;
  if (typeof r == "string" && typeof document < "u") {
    var a = document.createElement(r), o = ["SVG", "CIRCLE", "PATH"];
    a instanceof HTMLUnknownElement && !o.includes(a.nodeName) || r.includes("-") ? (r = r.toLowerCase(), n = !0, r === "transition" ? t = m.Transition : r === "transition-group" ? t = m.TransitionGroup : t = m.resolveComponent(r)) : t = r;
  }
  return {
    type: t,
    component: r,
    customElement: n
  };
}, $o = function(r, t, n) {
  var a = {}, o = n, l = qn(r), i = l.customElement, s = l.type;
  return r = l.component, t && typeof t == "object" && !Array.isArray(t) ? (a = Vn(t), t.scopedSlots && (o = t.scopedSlots)) : (typeof t == "string" || Array.isArray(t)) && (n = t), (typeof n == "string" || Array.isArray(n)) && (o = typeof r != "string" || i ? function() {
    return n;
  } : n), m.h(s, a, o);
}, Hn = function(r) {
  return function(t) {
    var n, a = t.component, o = t.propsData, l = t.el, i = Object.assign(a, {
      provide: (n = {}, n[r.configKey] = r.configInstance, n)
    }), s = m.createVNode(i, o);
    return m.render(s, l), P({}, s.component);
  };
}, Le = m.defineComponent, kt = !1, ge = function(r) {
  var t = [];
  return Object.keys(r).forEach(function(n) {
    return r[n] && t.push(n);
  }), t.join(" ");
}, Gn = function(r) {
  var t = [];
  return r.forEach(function(n) {
    typeof n == "string" ? t.push(n) : typeof n == "object" && t.push(ge(n));
  }), t.join(" ");
}, ve = function(r) {
  if (!r)
    return "";
  if (typeof r == "string")
    return r;
  if (Array.isArray(r) && r.length > 0) {
    var t = [];
    return r.forEach(function(n) {
      n && (typeof n == "string" ? t.push(n) : Array.isArray(n) ? t.push(Gn(n)) : typeof n == "object" && t.push(ge(n)));
    }), t.join(" ");
  }
  return typeof r == "object" ? ge(r) : "";
}, Bo = function(r) {
  var t = ve(r), n = Array.from(new Set(t.split(" "))).filter(function(a) {
    return a;
  });
  return ve(n);
}, Wn = function() {
  var r = m.ref(""), t = ["2xl", "xl", "lg", "md", "sm"], n = function(s) {
    return bt || typeof matchMedia != "function" ? {
      matches: !1,
      media: s,
      addEventListener: function() {
      },
      removeEventListener: function() {
      }
    } : window.matchMedia(s);
  }, a = {
    "2xl": n("(min-width:1536px)"),
    xl: n("(min-width:1280px)"),
    lg: n("(min-width:1024px)"),
    md: n("(min-width:768px)"),
    sm: n("(min-width:640px)")
  }, o = function() {
    for (var s = 0; s < t.length; s++) {
      var c = t[s];
      if (a[c].matches) {
        r.value = c;
        return;
      }
    }
    r.value = "default";
  }, l = wn(0, function() {
    return o();
  });
  return o(), t.forEach(function(i) {
    return a[i].addEventListener("change", l);
  }), m.onBeforeUnmount(function() {
    t.forEach(function(i) {
      return a[i].removeEventListener("change", l);
    });
  }), {
    current: r
  };
}, Yn = ["IconLoadingShadow", "IconNoData"], It = 0, Et = function(r, t) {
  {
    var n;
    if ((n = r.props) != null && n.id) {
      var a = "" + r.props.id + It;
      t[r.props.id] = a, r.props.id = a;
    }
  }
  Array.isArray(r == null ? void 0 : r.children) && r.children.forEach(function(o) {
    Et(o, t);
  });
}, Lt = function(r, t) {
  var n = ["fill", "mask", "filter"];
  n.forEach(function(a) {
    {
      var o, l;
      if ((o = r.props) != null && (l = o[a]) != null && l.includes("url(#")) {
        var i = r.props[a].replace("url(#", "").replace(")", ""), s = t[i];
        s && (r.props[a] = "url(#" + s + ")");
      }
    }
  }), Array.isArray(r == null ? void 0 : r.children) && r.children.forEach(function(a) {
    Lt(a, t);
  });
}, Kn = function(r) {
  if (r) {
    var t = {};
    Et(r, t), Lt(r, t), It++;
  }
};
Tn(R({}, m, {
  isVue2: kt
}));
Cn(R({}, m, {
  isVue2: kt
}));
var ne = "Tiny", Jn = {
  tiny_mode: String,
  tiny_mode_root: Boolean,
  tiny_template: [Function, Object],
  tiny_renderless: Function,
  tiny_theme: String,
  tiny_chart_theme: Object
}, Xn = ["tiny_mode", "tiny_mode_root", "tiny_template", "tiny_renderless", "_constants", "tiny_theme", "tiny_chart_theme"], Me = function(r, t) {
  var n = function(d) {
    return ~["pc", "mobile", "mobile-first"].indexOf(d);
  }, a = Ee(t), o = typeof r.tiny_mode == "string" ? r.tiny_mode : null, l = m.inject("TinyMode", null), i;
  typeof a.tiny_mode == "string" ? i = a.tiny_mode : a.tiny_mode && (i = a.tiny_mode.value), n(o) || (o = null), n(l) || (l = null), n(i) || (i = null);
  var s = o || l || i || "pc";
  r.tiny_mode_root && m.provide("TinyMode", s);
  var c = m.getCurrentInstance();
  return Object.defineProperty(c, "_tiny_mode", {
    value: s
  }), s;
}, Zn = function(r, t) {
  var n = function(u) {
    return ~["tiny", "saas"].indexOf(u);
  }, a = Ee(t), o = typeof r.tiny_theme == "string" ? r.tiny_theme : null, l = m.inject("TinyTheme", null), i = a.tiny_theme && a.tiny_theme.value;
  n(o) || (o = null), n(l) || (l = null), n(i) || (i = null);
  var s = o || l || i || "tiny";
  return s;
}, Qn = function(r, t) {
  var n = Ee(t), a = typeof r.tiny_chart_theme == "object" ? r.tiny_chart_theme : null, o = m.inject("TinyChartTheme", null), l = n.tiny_chart_theme && n.tiny_chart_theme.value, i = a || o || l || null;
  return i;
}, eo = function(r) {
  var t = r.props, n = r.context, a = r.template, o = r.extend, l = o === void 0 ? {} : o, i = Me(t, n), s = m.computed(function() {
    if (typeof t.tiny_template < "u") return t.tiny_template;
    var c = a(i, t);
    return typeof c == "function" ? En(c) : c;
  });
  return St({
    view: s,
    props: t,
    context: n,
    extend: l
  });
}, Mt = {
  configKey: Symbol("designConfigKey"),
  configInstance: null
}, _o = Hn(Mt), to = {
  designConfig: null,
  twMerge: function() {
    return "";
  }
}, ye = function() {
  for (var r = arguments.length, t = new Array(r), n = 0; n < r; n++)
    t[n] = arguments[n];
  return to.twMerge(ve(t));
}, ro = function(r) {
  var t, n, a, o = r.props, l = r.context, i = r.renderless, s = r.api, c = r.extendOptions, u = c === void 0 ? {} : c, d = r.mono, f = d === void 0 ? !1 : d, p = r.classes, g = p === void 0 ? {} : p, v = typeof o.tiny_renderless == "function" ? o.tiny_renderless : i, h = m.inject(Mt.configKey, {});
  h = ((t = h) == null ? void 0 : t.value) || h || {};
  var b = (n = h) == null || (a = n.components) == null ? void 0 : a[Mn().replace(ne, "")], y = R({
    $prefix: ne,
    t: _e
  }, $n(l, Me(o, l)), {
    designConfig: b,
    globalDesignConfig: h,
    useBreakpoint: Wn,
    mergeClass: ye
  });
  y.vm.theme = Zn(o, l), y.vm.chartTheme = Qn(o, l);
  var T = v(o, m, y, u);
  typeof (b == null ? void 0 : b.renderless) == "function" && Object.assign(T, b.renderless(o, m, y, T));
  var k = {
    t: _e,
    vm: y.vm,
    f: kn,
    a: oo,
    d: y.defineInstanceProperties,
    dp: y.defineParentInstanceProperties,
    gcls: function(S) {
      return In(g, S);
    },
    m: ye
  };
  return k.d({
    slots: {
      get: function() {
        return y.vm.$slots;
      },
      configurable: !0
    },
    scopedSlots: {
      get: function() {
        return y.vm.$scopedSlots;
      },
      configurable: !0
    }
  }), k.dp({
    slots: {
      get: function() {
        return y.parent.$slots;
      },
      configurable: !0
    },
    scopedSlots: {
      get: function() {
        return y.parent.$scopedSlots;
      },
      configurable: !0
    }
  }), ao(), Array.isArray(s) && (Array.isArray(b == null ? void 0 : b.api) && (s = s.concat(b.api)), s.forEach(function(I) {
    var S = T[I];
    typeof S < "u" && (k[I] = S, f || y.setParentAttribute({
      name: I,
      value: S
    }));
  })), k;
};
function no(e) {
  var r = e.name, t = r === void 0 ? "Icon" : r, n = e.component;
  return function(a) {
    return Ln(Le({
      name: ne + t,
      setup: function(l, i) {
        var s = i.attrs || {}, c = s.fill, u = s.width, d = s.height, f = s["custom-class"], p = s["first-color"], g = s["second-color"], v = Object.assign({}, l, a || null), h = Me(v, i), b = h === "mobile-first", y = {
          "data-tag": b ? "tiny-svg" : null
        }, T = y, k = "tiny-svg";
        b && (k = ye("h-4 w-4 inline-block", f || "", v.class || ""));
        var I = Object.assign({
          style: {
            fill: c,
            width: u,
            height: d,
            "--tiny-first-color": p || "",
            "--tiny-second-color": g || ""
          },
          class: k,
          isSvg: !0
        }, T);
        if (I.nativeOn = i.listeners, Yn.includes(t)) {
          var S = n.render;
          n.render = function() {
            for (var x = S.bind(this), C = arguments.length, A = new Array(C), E = 0; E < C; E++)
              A[E] = arguments[E];
            var N = x(A);
            return Kn(N), N;
          };
        }
        return St({
          component: n,
          props: v,
          context: i,
          extend: I
        });
      }
    }));
  };
}
var oo = function(r, t, n) {
  var a = {}, o = function(s) {
    var c = t.some(function(u) {
      return new RegExp(u).test(s);
    });
    (n && c || !n && !c) && (a[s] = r[s]);
  };
  for (var l in r)
    o(l);
  return a;
}, ue = {}, ao = function() {
  for (var r in ue) {
    var t = ue[r];
    typeof t.install == "function" && t.install(On()), typeof t.init == "function" && t.init(Pn());
  }
  ue = {};
};
const io = ({ emit: e, props: r, state: t, designConfig: n }) => (a) => {
  var o, l;
  const i = pn.filterUrl(r.href), s = 1e3;
  let c = s;
  r.resetTime !== s ? c = r.resetTime : c = (l = (o = n == null ? void 0 : n.props) == null ? void 0 : o.resetTime) != null ? l : r.resetTime, i ? location.href = i : r.nativeType === "button" && c > 0 && (t.disabled = !0, t.timer = window.setTimeout(() => {
    t.disabled = !1;
  }, c)), e("click", a);
}, lo = (e) => () => clearTimeout(e.timer), so = ["state", "handleClick"], co = (e, { computed: r, onBeforeUnmount: t, reactive: n, watch: a, inject: o }, { emit: l, parent: i, designConfig: s }) => {
  i.tinyForm = i.tinyForm || o("form", null);
  const c = n({
    timer: 0,
    disabled: e.disabled,
    plain: r(() => e.plain || (i.buttonGroup || {}).plain),
    round: r(() => {
      var d, f, p;
      return (p = (f = e.round) != null ? f : (d = s == null ? void 0 : s.props) == null ? void 0 : d.round) != null ? p : !1;
    }),
    formDisabled: r(() => (i.tinyForm || {}).disabled),
    buttonDisabled: r(
      () => e.disabled || c.disabled || (i.buttonGroup || {}).disabled || c.formDisabled
    )
  });
  a(
    () => e.disabled,
    (d) => {
      c.disabled = d;
    },
    { immediate: !0 }
  );
  const u = {
    state: c,
    clearTimer: lo(c),
    handleClick: io({ emit: l, props: e, state: c, designConfig: s })
  };
  return t(u.clearTimer), u;
};
var uo = {
  viewBox: "0 0 15.8 15.8",
  xmlns: "http://www.w3.org/2000/svg"
}, fo = /* @__PURE__ */ O(
  "defs",
  {
    fill: "none"
  },
  [/* @__PURE__ */ O("linearGradient", {
    x1: "20.263",
    y1: "7.9",
    x2: "4.236",
    y2: "0",
    id: "loading-shadow_svg__a",
    gradientUnits: "userSpaceOnUse"
  }, [/* @__PURE__ */ O("stop", {
    offset: ".001",
    "stop-color": "#FFF",
    "stop-opacity": "0"
  }), /* @__PURE__ */ O("stop", {
    offset: ".975",
    "stop-color": "#FFF"
  })])],
  -1
  /* HOISTED */
), po = /* @__PURE__ */ O(
  "mask",
  {
    fill: "none",
    id: "loading-shadow_svg__b",
    "mask-type": "alpha",
    maskUnits: "userSpaceOnUse",
    x: "0",
    y: "0"
  },
  [/* @__PURE__ */ O("path", {
    d: "M7.9 0c.49 0 .9.4.9.89 0 .5-.41.91-.9.91-3.37 0-6.1 2.73-6.1 6.09C1.8 11.26 4.53 14 7.9 14c3.36 0 6.1-2.74 6.1-6.11a.9.9 0 0 1 1.8 0c0 4.37-3.54 7.91-7.9 7.91-4.37 0-7.9-3.54-7.9-7.91C0 3.53 3.53 0 7.9 0Z",
    fill: "url(#loading-shadow_svg__a)"
  }, [/* @__PURE__ */ O("animateTransform", {
    attributeName: "transform",
    attributeType: "XML",
    type: "rotate",
    from: "0 7.9 7.9",
    to: "360 7.9 7.9",
    dur: "1s",
    repeatCount: "indefinite"
  })])],
  -1
  /* HOISTED */
), mo = /* @__PURE__ */ O(
  "g",
  {
    mask: "url(#loading-shadow_svg__b)"
  },
  [/* @__PURE__ */ O("path", {
    d: "M-.1 15.89h16v-16h-16v16Z",
    "fill-rule": "evenodd"
  })],
  -1
  /* HOISTED */
), ho = [fo, po, mo];
function go(e, r) {
  return J(), He("svg", uo, [].concat(ho));
}
var vo = {
  render: go
}, yo = function() {
  return no({
    name: "IconLoadingShadow",
    component: vo
  })();
};
function bo(e, r) {
  var t = typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (t) return (t = t.call(e)).next.bind(t);
  if (Array.isArray(e) || (t = wo(e)) || r) {
    t && (e = t);
    var n = 0;
    return function() {
      return n >= e.length ? { done: !0 } : { done: !1, value: e[n++] };
    };
  }
  throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function wo(e, r) {
  if (e) {
    if (typeof e == "string") return qe(e, r);
    var t = {}.toString.call(e).slice(8, -1);
    return t === "Object" && e.constructor && (t = e.constructor.name), t === "Map" || t === "Set" ? Array.from(e) : t === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? qe(e, r) : void 0;
  }
}
function qe(e, r) {
  (r == null || r > e.length) && (r = e.length);
  for (var t = 0, n = Array(r); t < r; t++) n[t] = e[t];
  return n;
}
var To = function(r, t) {
  for (var n = r.__vccOpts || r, a = bo(t), o; !(o = a()).done; ) {
    var l = o.value, i = l[0], s = l[1];
    n[i] = s;
  }
  return n;
}, So = Le({
  emits: ["click"],
  props: [].concat(Xn, ["type", "text", "size", "icon", "resetTime", "nativeType", "loading", "disabled", "plain", "autofocus", "round", "circle", "tabindex", "customClass", "ghost"]),
  components: {
    IconLoading: yo()
  },
  setup: function(r, t) {
    return ro({
      props: r,
      context: t,
      renderless: co,
      api: so
    });
  }
}), xo = ["disabled", "autofocus", "type", "tabindex"];
function Co(e, r, t, n, a, o) {
  var l = Ot("icon-loading");
  return J(), He("button", Pt({
    class: ["tiny-button", [e.type ? "tiny-button--" + e.type : "", e.size ? "tiny-button--" + e.size : "", {
      "is-disabled": e.state.buttonDisabled,
      "is-loading": e.loading,
      "is-plain": e.state.plain,
      "is-ghost": e.ghost,
      "is-round": e.state.round,
      "is-circle": e.circle,
      "is-icon": e.icon && !e.loading && (e.text || e.slots.default),
      "is-only-icon": e.icon && !e.loading && !(e.text || e.slots.default)
    }]],
    onClick: r[0] || (r[0] = function() {
      return e.handleClick && e.handleClick.apply(e, arguments);
    }),
    disabled: e.state.buttonDisabled || e.loading,
    autofocus: e.autofocus,
    type: e.nativeType,
    tabindex: e.tabindex
  }, e.a(e.$attrs, ["class", "style", "title", "id"], !0)), [e.loading ? (J(), Oe(l, {
    key: 0,
    class: "tiny-icon-loading tiny-svg-size"
  })) : Pe("v-if", !0), e.icon && !e.loading ? (J(), Oe(Dt(e.icon), {
    key: 1,
    class: Nt({
      "is-text": e.text || e.slots.default
    })
  }, null, 8, ["class"])) : Pe("v-if", !0), Ft(e.$slots, "default", {}, function() {
    return [O(
      "span",
      null,
      zt(e.text),
      1
      /* TEXT */
    )];
  })], 16, xo);
}
var K = /* @__PURE__ */ To(So, [["render", Co]]);
function be() {
  return be = Object.assign ? Object.assign.bind() : function(e) {
    for (var r = 1; r < arguments.length; r++) {
      var t = arguments[r];
      for (var n in t) ({}).hasOwnProperty.call(t, n) && (e[n] = t[n]);
    }
    return e;
  }, be.apply(null, arguments);
}
var Ao = function(r) {
  var t, n = typeof process == "object" ? (t = process.env) == null ? void 0 : t.TINY_MODE : null;
  return K;
}, ko = be({}, Jn, {
  /** 展示按钮不同的状态，设置为text则展示为文本按钮。可取值为：'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'  */
  type: {
    type: String,
    default: "default"
  },
  /** 设置原生的tabindex属性 */
  tabindex: {
    type: String,
    default: "0"
  },
  /** 按钮左侧展示的图标，接收为Icon组件  */
  icon: {
    type: [Object, String],
    default: ""
  },
  /** 按钮显示的文本 */
  text: {
    type: String,
    default: ""
  },
  /** 设置按钮禁用时间，防止重复提交，单位毫秒 */
  resetTime: {
    type: Number,
    default: 1e3
  },
  /** 对应按钮原生 type 属性  */
  nativeType: {
    type: String,
    default: "button"
  },
  /** 当配置href后，点击按钮则更新 location.href 进行页面跳转  */
  href: {
    type: String,
    default: ""
  },
  /** 定义按钮尺寸 */
  size: {
    type: String,
    default: "",
    validator: function(r) {
      return ["large", "medium", "small", "mini", ""].includes(r);
    }
  },
  /** 是否圆角按钮 */
  round: {
    type: Boolean,
    default: void 0
  },
  /** 是否朴素按钮  */
  plain: Boolean,
  /** 是否圆形按钮  */
  circle: Boolean,
  /** 是否加载中状态 */
  loading: Boolean,
  /** 是否被禁用按钮 */
  disabled: Boolean,
  /** 是否默认聚焦 */
  autofocus: Boolean,
  /** 自定义类名， 仅 mobile-first 模板时有效 */
  customClass: {
    type: String,
    default: ""
  },
  /** 设置通栏按钮,宽度充满水平方向， 仅 mobile-first 模板时有效  */
  banner: {
    type: Boolean,
    default: !1
  },
  /** 是否幽灵按钮 */
  ghost: Boolean,
  /** 点击事件 */
  onClick: {
    type: Function
  }
}), Z = Le({
  name: ne + "Button",
  inject: {
    buttonGroup: {
      default: ""
    }
  },
  props: ko,
  slots: Object,
  setup: function(r, t) {
    return eo({
      props: r,
      context: t,
      template: Ao
    });
  }
}), Io = "3.21.0";
Z.install = function(e) {
  e.component(Z.name, Z);
};
Z.version = Io;
export {
  ne as $,
  Z as B,
  Po as a,
  Fo as b,
  Do as c,
  wn as d,
  yn as e,
  Le as f,
  Mo as g,
  _o as h,
  Te as i,
  $o as j,
  Bo as k,
  ve as l,
  ro as m,
  Uo as n,
  Oo as o,
  Ro as p,
  Jn as q,
  No as r,
  no as s,
  de as t,
  eo as u,
  zo as v,
  Lo as w,
  Xn as x,
  jo as y
};
