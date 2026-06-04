import * as k from "vue";
var _r = Object.defineProperty, Or = (r, e, n) => e in r ? _r(r, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : r[e] = n, te = (r, e, n) => Or(r, typeof e != "symbol" ? e + "" : e, n), Oe = { exports: {} }, P = {}, Me = { exports: {} }, Q = {}, at;
function Lt() {
  if (at) return Q;
  at = 1;
  function r() {
    var t = {};
    return t["align-content"] = !1, t["align-items"] = !1, t["align-self"] = !1, t["alignment-adjust"] = !1, t["alignment-baseline"] = !1, t.all = !1, t["anchor-point"] = !1, t.animation = !1, t["animation-delay"] = !1, t["animation-direction"] = !1, t["animation-duration"] = !1, t["animation-fill-mode"] = !1, t["animation-iteration-count"] = !1, t["animation-name"] = !1, t["animation-play-state"] = !1, t["animation-timing-function"] = !1, t.azimuth = !1, t["backface-visibility"] = !1, t.background = !0, t["background-attachment"] = !0, t["background-clip"] = !0, t["background-color"] = !0, t["background-image"] = !0, t["background-origin"] = !0, t["background-position"] = !0, t["background-repeat"] = !0, t["background-size"] = !0, t["baseline-shift"] = !1, t.binding = !1, t.bleed = !1, t["bookmark-label"] = !1, t["bookmark-level"] = !1, t["bookmark-state"] = !1, t.border = !0, t["border-bottom"] = !0, t["border-bottom-color"] = !0, t["border-bottom-left-radius"] = !0, t["border-bottom-right-radius"] = !0, t["border-bottom-style"] = !0, t["border-bottom-width"] = !0, t["border-collapse"] = !0, t["border-color"] = !0, t["border-image"] = !0, t["border-image-outset"] = !0, t["border-image-repeat"] = !0, t["border-image-slice"] = !0, t["border-image-source"] = !0, t["border-image-width"] = !0, t["border-left"] = !0, t["border-left-color"] = !0, t["border-left-style"] = !0, t["border-left-width"] = !0, t["border-radius"] = !0, t["border-right"] = !0, t["border-right-color"] = !0, t["border-right-style"] = !0, t["border-right-width"] = !0, t["border-spacing"] = !0, t["border-style"] = !0, t["border-top"] = !0, t["border-top-color"] = !0, t["border-top-left-radius"] = !0, t["border-top-right-radius"] = !0, t["border-top-style"] = !0, t["border-top-width"] = !0, t["border-width"] = !0, t.bottom = !1, t["box-decoration-break"] = !0, t["box-shadow"] = !0, t["box-sizing"] = !0, t["box-snap"] = !0, t["box-suppress"] = !0, t["break-after"] = !0, t["break-before"] = !0, t["break-inside"] = !0, t["caption-side"] = !1, t.chains = !1, t.clear = !0, t.clip = !1, t["clip-path"] = !1, t["clip-rule"] = !1, t.color = !0, t["color-interpolation-filters"] = !0, t["column-count"] = !1, t["column-fill"] = !1, t["column-gap"] = !1, t["column-rule"] = !1, t["column-rule-color"] = !1, t["column-rule-style"] = !1, t["column-rule-width"] = !1, t["column-span"] = !1, t["column-width"] = !1, t.columns = !1, t.contain = !1, t.content = !1, t["counter-increment"] = !1, t["counter-reset"] = !1, t["counter-set"] = !1, t.crop = !1, t.cue = !1, t["cue-after"] = !1, t["cue-before"] = !1, t.cursor = !1, t.direction = !1, t.display = !0, t["display-inside"] = !0, t["display-list"] = !0, t["display-outside"] = !0, t["dominant-baseline"] = !1, t.elevation = !1, t["empty-cells"] = !1, t.filter = !1, t.flex = !1, t["flex-basis"] = !1, t["flex-direction"] = !1, t["flex-flow"] = !1, t["flex-grow"] = !1, t["flex-shrink"] = !1, t["flex-wrap"] = !1, t.float = !1, t["float-offset"] = !1, t["flood-color"] = !1, t["flood-opacity"] = !1, t["flow-from"] = !1, t["flow-into"] = !1, t.font = !0, t["font-family"] = !0, t["font-feature-settings"] = !0, t["font-kerning"] = !0, t["font-language-override"] = !0, t["font-size"] = !0, t["font-size-adjust"] = !0, t["font-stretch"] = !0, t["font-style"] = !0, t["font-synthesis"] = !0, t["font-variant"] = !0, t["font-variant-alternates"] = !0, t["font-variant-caps"] = !0, t["font-variant-east-asian"] = !0, t["font-variant-ligatures"] = !0, t["font-variant-numeric"] = !0, t["font-variant-position"] = !0, t["font-weight"] = !0, t.grid = !1, t["grid-area"] = !1, t["grid-auto-columns"] = !1, t["grid-auto-flow"] = !1, t["grid-auto-rows"] = !1, t["grid-column"] = !1, t["grid-column-end"] = !1, t["grid-column-start"] = !1, t["grid-row"] = !1, t["grid-row-end"] = !1, t["grid-row-start"] = !1, t["grid-template"] = !1, t["grid-template-areas"] = !1, t["grid-template-columns"] = !1, t["grid-template-rows"] = !1, t["hanging-punctuation"] = !1, t.height = !0, t.hyphens = !1, t.icon = !1, t["image-orientation"] = !1, t["image-resolution"] = !1, t["ime-mode"] = !1, t["initial-letters"] = !1, t["inline-box-align"] = !1, t["justify-content"] = !1, t["justify-items"] = !1, t["justify-self"] = !1, t.left = !1, t["letter-spacing"] = !0, t["lighting-color"] = !0, t["line-box-contain"] = !1, t["line-break"] = !1, t["line-grid"] = !1, t["line-height"] = !1, t["line-snap"] = !1, t["line-stacking"] = !1, t["line-stacking-ruby"] = !1, t["line-stacking-shift"] = !1, t["line-stacking-strategy"] = !1, t["list-style"] = !0, t["list-style-image"] = !0, t["list-style-position"] = !0, t["list-style-type"] = !0, t.margin = !0, t["margin-bottom"] = !0, t["margin-left"] = !0, t["margin-right"] = !0, t["margin-top"] = !0, t["marker-offset"] = !1, t["marker-side"] = !1, t.marks = !1, t.mask = !1, t["mask-box"] = !1, t["mask-box-outset"] = !1, t["mask-box-repeat"] = !1, t["mask-box-slice"] = !1, t["mask-box-source"] = !1, t["mask-box-width"] = !1, t["mask-clip"] = !1, t["mask-image"] = !1, t["mask-origin"] = !1, t["mask-position"] = !1, t["mask-repeat"] = !1, t["mask-size"] = !1, t["mask-source-type"] = !1, t["mask-type"] = !1, t["max-height"] = !0, t["max-lines"] = !1, t["max-width"] = !0, t["min-height"] = !0, t["min-width"] = !0, t["move-to"] = !1, t["nav-down"] = !1, t["nav-index"] = !1, t["nav-left"] = !1, t["nav-right"] = !1, t["nav-up"] = !1, t["object-fit"] = !1, t["object-position"] = !1, t.opacity = !1, t.order = !1, t.orphans = !1, t.outline = !1, t["outline-color"] = !1, t["outline-offset"] = !1, t["outline-style"] = !1, t["outline-width"] = !1, t.overflow = !1, t["overflow-wrap"] = !1, t["overflow-x"] = !1, t["overflow-y"] = !1, t.padding = !0, t["padding-bottom"] = !0, t["padding-left"] = !0, t["padding-right"] = !0, t["padding-top"] = !0, t.page = !1, t["page-break-after"] = !1, t["page-break-before"] = !1, t["page-break-inside"] = !1, t["page-policy"] = !1, t.pause = !1, t["pause-after"] = !1, t["pause-before"] = !1, t.perspective = !1, t["perspective-origin"] = !1, t.pitch = !1, t["pitch-range"] = !1, t["play-during"] = !1, t.position = !1, t["presentation-level"] = !1, t.quotes = !1, t["region-fragment"] = !1, t.resize = !1, t.rest = !1, t["rest-after"] = !1, t["rest-before"] = !1, t.richness = !1, t.right = !1, t.rotation = !1, t["rotation-point"] = !1, t["ruby-align"] = !1, t["ruby-merge"] = !1, t["ruby-position"] = !1, t["shape-image-threshold"] = !1, t["shape-outside"] = !1, t["shape-margin"] = !1, t.size = !1, t.speak = !1, t["speak-as"] = !1, t["speak-header"] = !1, t["speak-numeral"] = !1, t["speak-punctuation"] = !1, t["speech-rate"] = !1, t.stress = !1, t["string-set"] = !1, t["tab-size"] = !1, t["table-layout"] = !1, t["text-align"] = !0, t["text-align-last"] = !0, t["text-combine-upright"] = !0, t["text-decoration"] = !0, t["text-decoration-color"] = !0, t["text-decoration-line"] = !0, t["text-decoration-skip"] = !0, t["text-decoration-style"] = !0, t["text-emphasis"] = !0, t["text-emphasis-color"] = !0, t["text-emphasis-position"] = !0, t["text-emphasis-style"] = !0, t["text-height"] = !0, t["text-indent"] = !0, t["text-justify"] = !0, t["text-orientation"] = !0, t["text-overflow"] = !0, t["text-shadow"] = !0, t["text-space-collapse"] = !0, t["text-transform"] = !0, t["text-underline-position"] = !0, t["text-wrap"] = !0, t.top = !1, t.transform = !1, t["transform-origin"] = !1, t["transform-style"] = !1, t.transition = !1, t["transition-delay"] = !1, t["transition-duration"] = !1, t["transition-property"] = !1, t["transition-timing-function"] = !1, t["unicode-bidi"] = !1, t["vertical-align"] = !1, t.visibility = !1, t["voice-balance"] = !1, t["voice-duration"] = !1, t["voice-family"] = !1, t["voice-pitch"] = !1, t["voice-range"] = !1, t["voice-rate"] = !1, t["voice-stress"] = !1, t["voice-volume"] = !1, t.volume = !1, t["white-space"] = !1, t.widows = !1, t.width = !0, t["will-change"] = !1, t["word-break"] = !0, t["word-spacing"] = !0, t["word-wrap"] = !0, t["wrap-flow"] = !1, t["wrap-through"] = !1, t["writing-mode"] = !1, t["z-index"] = !1, t;
  }
  function e(t, a, s) {
  }
  function n(t, a, s) {
  }
  var o = /javascript\s*\:/img;
  function i(t, a) {
    return o.test(a) ? "" : a;
  }
  return Q.whiteList = r(), Q.getDefaultWhiteList = r, Q.onAttr = e, Q.onIgnoreAttr = n, Q.safeAttrValue = i, Q;
}
var st, lt;
function zt() {
  return lt || (lt = 1, st = {
    indexOf: function(r, e) {
      var n, o;
      if (Array.prototype.indexOf)
        return r.indexOf(e);
      for (n = 0, o = r.length; n < o; n++)
        if (r[n] === e)
          return n;
      return -1;
    },
    forEach: function(r, e, n) {
      var o, i;
      if (Array.prototype.forEach)
        return r.forEach(e, n);
      for (o = 0, i = r.length; o < i; o++)
        e.call(n, r[o], o, r);
    },
    trim: function(r) {
      return String.prototype.trim ? r.trim() : r.replace(/(^\s*)|(\s*$)/g, "");
    },
    trimRight: function(r) {
      return String.prototype.trimRight ? r.trimRight() : r.replace(/(\s*$)/g, "");
    }
  }), st;
}
var Ie, ct;
function Mr() {
  if (ct) return Ie;
  ct = 1;
  var r = zt();
  function e(n, o) {
    n = r.trimRight(n), n[n.length - 1] !== ";" && (n += ";");
    var i = n.length, t = !1, a = 0, s = 0, c = "";
    function d() {
      if (!t) {
        var p = r.trim(n.slice(a, s)), u = p.indexOf(":");
        if (u !== -1) {
          var T = r.trim(p.slice(0, u)), w = r.trim(p.slice(u + 1));
          if (T) {
            var h = o(a, c.length, T, w, p);
            h && (c += h + "; ");
          }
        }
      }
      a = s + 1;
    }
    for (; s < i; s++) {
      var f = n[s];
      if (f === "/" && n[s + 1] === "*") {
        var l = n.indexOf("*/", s + 2);
        if (l === -1) break;
        s = l + 1, a = s + 1, t = !1;
      } else f === "(" ? t = !0 : f === ")" ? t = !1 : f === ";" ? t || d() : f === `
` && d();
    }
    return r.trim(c);
  }
  return Ie = e, Ie;
}
var Pe, ut;
function Ir() {
  if (ut) return Pe;
  ut = 1;
  var r = Lt(), e = Mr();
  zt();
  function n(t) {
    return t == null;
  }
  function o(t) {
    var a = {};
    for (var s in t)
      a[s] = t[s];
    return a;
  }
  function i(t) {
    t = o(t || {}), t.whiteList = t.whiteList || r.whiteList, t.onAttr = t.onAttr || r.onAttr, t.onIgnoreAttr = t.onIgnoreAttr || r.onIgnoreAttr, t.safeAttrValue = t.safeAttrValue || r.safeAttrValue, this.options = t;
  }
  return i.prototype.process = function(t) {
    if (t = t || "", t = t.toString(), !t) return "";
    var a = this, s = a.options, c = s.whiteList, d = s.onAttr, f = s.onIgnoreAttr, l = s.safeAttrValue, p = e(t, function(u, T, w, h, S) {
      var g = c[w], v = !1;
      if (g === !0 ? v = g : typeof g == "function" ? v = g(h) : g instanceof RegExp && (v = g.test(h)), v !== !0 && (v = !1), h = l(w, h), !!h) {
        var E = {
          position: T,
          sourcePosition: u,
          source: S,
          isWhite: v
        };
        if (v) {
          var x = d(w, h, E);
          return n(x) ? w + ":" + h : x;
        } else {
          var x = f(w, h, E);
          if (!n(x))
            return x;
        }
      }
    });
    return p;
  }, Pe = i, Pe;
}
var dt;
function Be() {
  return dt || (dt = 1, function(r, e) {
    var n = Lt(), o = Ir();
    function i(a, s) {
      var c = new o(s);
      return c.process(a);
    }
    e = r.exports = i, e.FilterCSS = o;
    for (var t in n) e[t] = n[t];
    typeof window < "u" && (window.filterCSS = r.exports);
  }(Me, Me.exports)), Me.exports;
}
var ft, pt;
function Ze() {
  return pt || (pt = 1, ft = {
    indexOf: function(r, e) {
      var n, o;
      if (Array.prototype.indexOf)
        return r.indexOf(e);
      for (n = 0, o = r.length; n < o; n++)
        if (r[n] === e)
          return n;
      return -1;
    },
    forEach: function(r, e, n) {
      var o, i;
      if (Array.prototype.forEach)
        return r.forEach(e, n);
      for (o = 0, i = r.length; o < i; o++)
        e.call(n, r[o], o, r);
    },
    trim: function(r) {
      return String.prototype.trim ? r.trim() : r.replace(/(^\s*)|(\s*$)/g, "");
    },
    spaceIndex: function(r) {
      var e = /\s|\n|\t/, n = e.exec(r);
      return n ? n.index : -1;
    }
  }), ft;
}
var ht;
function Rt() {
  if (ht) return P;
  ht = 1;
  var r = Be().FilterCSS, e = Be().getDefaultWhiteList, n = Ze();
  function o() {
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
  var i = new r();
  function t(y, A, m) {
  }
  function a(y, A, m) {
  }
  function s(y, A, m) {
  }
  function c(y, A, m) {
  }
  function d(y) {
    return y.replace(l, "&lt;").replace(p, "&gt;");
  }
  function f(y, A, m, I) {
    if (m = M(m), A === "href" || A === "src") {
      if (m = n.trim(m), m === "#") return "#";
      if (!(m.substr(0, 7) === "http://" || m.substr(0, 8) === "https://" || m.substr(0, 7) === "mailto:" || m.substr(0, 4) === "tel:" || m.substr(0, 11) === "data:image/" || m.substr(0, 6) === "ftp://" || m.substr(0, 2) === "./" || m.substr(0, 3) === "../" || m[0] === "#" || m[0] === "/"))
        return "";
    } else if (A === "background") {
      if (g.lastIndex = 0, g.test(m))
        return "";
    } else if (A === "style") {
      if (v.lastIndex = 0, v.test(m) || (E.lastIndex = 0, E.test(m) && (g.lastIndex = 0, g.test(m))))
        return "";
      I !== !1 && (I = I || i, m = I.process(m));
    }
    return m = L(m), m;
  }
  var l = /</g, p = />/g, u = /"/g, T = /&quot;/g, w = /&#([a-zA-Z0-9]*);?/gim, h = /&colon;?/gim, S = /&newline;?/gim, g = /((j\s*a\s*v\s*a|v\s*b|l\s*i\s*v\s*e)\s*s\s*c\s*r\s*i\s*p\s*t\s*|m\s*o\s*c\s*h\s*a):/gi, v = /e\s*x\s*p\s*r\s*e\s*s\s*s\s*i\s*o\s*n\s*\(.*/gi, E = /u\s*r\s*l\s*\(.*/gi;
  function x(y) {
    return y.replace(u, "&quot;");
  }
  function b(y) {
    return y.replace(T, '"');
  }
  function C(y) {
    return y.replace(w, function(A, m) {
      return m[0] === "x" || m[0] === "X" ? String.fromCharCode(parseInt(m.substr(1), 16)) : String.fromCharCode(parseInt(m, 10));
    });
  }
  function _(y) {
    return y.replace(h, ":").replace(S, " ");
  }
  function O(y) {
    for (var A = "", m = 0, I = y.length; m < I; m++)
      A += y.charCodeAt(m) < 32 ? " " : y.charAt(m);
    return n.trim(A);
  }
  function M(y) {
    return y = b(y), y = C(y), y = _(y), y = O(y), y;
  }
  function L(y) {
    return y = x(y), y = d(y), y;
  }
  function U() {
    return "";
  }
  function j(y, A) {
    typeof A != "function" && (A = function() {
    });
    var m = !Array.isArray(y);
    function I(K) {
      return m ? !0 : n.indexOf(y, K) !== -1;
    }
    var $ = [], N = !1;
    return {
      onIgnoreTag: function(K, ae, q) {
        if (I(K))
          if (q.isClosing) {
            var se = "[/removed]", Ar = q.position + se.length;
            return $.push([
              N !== !1 ? N : q.position,
              Ar
            ]), N = !1, se;
          } else
            return N || (N = q.position), "[removed]";
        else
          return A(K, ae, q);
      },
      remove: function(K) {
        var ae = "", q = 0;
        return n.forEach($, function(se) {
          ae += K.slice(q, se[0]), q = se[1];
        }), ae += K.slice(q), ae;
      }
    };
  }
  function J(y) {
    for (var A = "", m = 0; m < y.length; ) {
      var I = y.indexOf("<!--", m);
      if (I === -1) {
        A += y.slice(m);
        break;
      }
      A += y.slice(m, I);
      var $ = y.indexOf("-->", I);
      if ($ === -1)
        break;
      m = $ + 3;
    }
    return A;
  }
  function he(y) {
    var A = y.split("");
    return A = A.filter(function(m) {
      var I = m.charCodeAt(0);
      return I === 127 ? !1 : I <= 31 ? I === 10 || I === 13 : !0;
    }), A.join("");
  }
  return P.whiteList = o(), P.getDefaultWhiteList = o, P.onTag = t, P.onIgnoreTag = a, P.onTagAttr = s, P.onIgnoreTagAttr = c, P.safeAttrValue = f, P.escapeHtml = d, P.escapeQuote = x, P.unescapeQuote = b, P.escapeHtmlEntities = C, P.escapeDangerHtml5Entities = _, P.clearNonPrintableCharacter = O, P.friendlyAttrValue = M, P.escapeAttrValue = L, P.onIgnoreTagStripAll = U, P.StripTagBody = j, P.stripCommentTag = J, P.stripBlankChar = he, P.cssFilter = i, P.getDefaultCSSWhiteList = e, P;
}
var me = {}, mt;
function Dt() {
  if (mt) return me;
  mt = 1;
  var r = Ze();
  function e(l) {
    var p = r.spaceIndex(l), u;
    return p === -1 ? u = l.slice(1, -1) : u = l.slice(1, p + 1), u = r.trim(u).toLowerCase(), u.slice(0, 1) === "/" && (u = u.slice(1)), u.slice(-1) === "/" && (u = u.slice(0, -1)), u;
  }
  function n(l) {
    return l.slice(0, 2) === "</";
  }
  function o(l, p, u) {
    var T = "", w = 0, h = !1, S = !1, g = 0, v = l.length, E = "", x = "";
    e: for (g = 0; g < v; g++) {
      var b = l.charAt(g);
      if (h === !1) {
        if (b === "<") {
          h = g;
          continue;
        }
      } else if (S === !1) {
        if (b === "<") {
          T += u(l.slice(w, g)), h = g, w = g;
          continue;
        }
        if (b === ">" || g === v - 1) {
          T += u(l.slice(w, h)), x = l.slice(h, g + 1), E = e(x), T += p(
            h,
            T.length,
            E,
            x,
            n(x)
          ), w = g + 1, h = !1;
          continue;
        }
        if (b === '"' || b === "'")
          for (var C = 1, _ = l.charAt(g - C); _.trim() === "" || _ === "="; ) {
            if (_ === "=") {
              S = b;
              continue e;
            }
            _ = l.charAt(g - ++C);
          }
      } else if (b === S) {
        S = !1;
        continue;
      }
    }
    return w < v && (T += u(l.substr(w))), T;
  }
  var i = /[^a-zA-Z0-9\\_:.-]/gim;
  function t(l, p) {
    var u = 0, T = 0, w = [], h = !1, S = l.length;
    function g(C, _) {
      if (C = r.trim(C), C = C.replace(i, "").toLowerCase(), !(C.length < 1)) {
        var O = p(C, _ || "");
        O && w.push(O);
      }
    }
    for (var v = 0; v < S; v++) {
      var E = l.charAt(v), x, b;
      if (h === !1 && E === "=") {
        h = l.slice(u, v), u = v + 1, T = l.charAt(u) === '"' || l.charAt(u) === "'" ? u : s(l, v + 1);
        continue;
      }
      if (h !== !1 && v === T) {
        if (b = l.indexOf(E, v + 1), b === -1)
          break;
        x = r.trim(l.slice(T + 1, b)), g(h, x), h = !1, v = b, u = v + 1;
        continue;
      }
      if (/\s|\n|\t/.test(E))
        if (l = l.replace(/\s|\n|\t/g, " "), h === !1)
          if (b = a(l, v), b === -1) {
            x = r.trim(l.slice(u, v)), g(x), h = !1, u = v + 1;
            continue;
          } else {
            v = b - 1;
            continue;
          }
        else if (b = c(l, v - 1), b === -1) {
          x = r.trim(l.slice(u, v)), x = f(x), g(h, x), h = !1, u = v + 1;
          continue;
        } else
          continue;
    }
    return u < l.length && (h === !1 ? g(l.slice(u)) : g(h, f(r.trim(l.slice(u))))), r.trim(w.join(" "));
  }
  function a(l, p) {
    for (; p < l.length; p++) {
      var u = l[p];
      if (u !== " ")
        return u === "=" ? p : -1;
    }
  }
  function s(l, p) {
    for (; p < l.length; p++) {
      var u = l[p];
      if (u !== " ")
        return u === "'" || u === '"' ? p : -1;
    }
  }
  function c(l, p) {
    for (; p > 0; p--) {
      var u = l[p];
      if (u !== " ")
        return u === "=" ? p : -1;
    }
  }
  function d(l) {
    return l[0] === '"' && l[l.length - 1] === '"' || l[0] === "'" && l[l.length - 1] === "'";
  }
  function f(l) {
    return d(l) ? l.substr(1, l.length - 2) : l;
  }
  return me.parseTag = o, me.parseAttr = t, me;
}
var Fe, gt;
function Pr() {
  if (gt) return Fe;
  gt = 1;
  var r = Be().FilterCSS, e = Rt(), n = Dt(), o = n.parseTag, i = n.parseAttr, t = Ze();
  function a(l) {
    return l == null;
  }
  function s(l) {
    var p = t.spaceIndex(l);
    if (p === -1)
      return {
        html: "",
        closing: l[l.length - 2] === "/"
      };
    l = t.trim(l.slice(p + 1, -1));
    var u = l[l.length - 1] === "/";
    return u && (l = t.trim(l.slice(0, -1))), {
      html: l,
      closing: u
    };
  }
  function c(l) {
    var p = {};
    for (var u in l)
      p[u] = l[u];
    return p;
  }
  function d(l) {
    var p = {};
    for (var u in l)
      Array.isArray(l[u]) ? p[u.toLowerCase()] = l[u].map(function(T) {
        return T.toLowerCase();
      }) : p[u.toLowerCase()] = l[u];
    return p;
  }
  function f(l) {
    l = c(l || {}), l.stripIgnoreTag && (l.onIgnoreTag && console.error(
      'Notes: cannot use these two options "stripIgnoreTag" and "onIgnoreTag" at the same time'
    ), l.onIgnoreTag = e.onIgnoreTagStripAll), l.whiteList || l.allowList ? l.whiteList = d(l.whiteList || l.allowList) : l.whiteList = e.whiteList, l.onTag = l.onTag || e.onTag, l.onTagAttr = l.onTagAttr || e.onTagAttr, l.onIgnoreTag = l.onIgnoreTag || e.onIgnoreTag, l.onIgnoreTagAttr = l.onIgnoreTagAttr || e.onIgnoreTagAttr, l.safeAttrValue = l.safeAttrValue || e.safeAttrValue, l.escapeHtml = l.escapeHtml || e.escapeHtml, this.options = l, l.css === !1 ? this.cssFilter = !1 : (l.css = l.css || {}, this.cssFilter = new r(l.css));
  }
  return f.prototype.process = function(l) {
    if (l = l || "", l = l.toString(), !l) return "";
    var p = this, u = p.options, T = u.whiteList, w = u.onTag, h = u.onIgnoreTag, S = u.onTagAttr, g = u.onIgnoreTagAttr, v = u.safeAttrValue, E = u.escapeHtml, x = p.cssFilter;
    u.stripBlankChar && (l = e.stripBlankChar(l)), u.allowCommentTag || (l = e.stripCommentTag(l));
    var b = !1;
    u.stripIgnoreTagBody && (b = e.StripTagBody(
      u.stripIgnoreTagBody,
      h
    ), h = b.onIgnoreTag);
    var C = o(
      l,
      function(_, O, M, L, U) {
        var j = {
          sourcePosition: _,
          position: O,
          isClosing: U,
          isWhite: Object.prototype.hasOwnProperty.call(T, M)
        }, J = w(M, L, j);
        if (!a(J)) return J;
        if (j.isWhite) {
          if (j.isClosing)
            return "</" + M + ">";
          var he = s(L), y = T[M], A = i(he.html, function(m, I) {
            var $ = t.indexOf(y, m) !== -1, N = S(M, m, I, $);
            return a(N) ? $ ? (I = v(M, m, I, x), I ? m + '="' + I + '"' : m) : (N = g(M, m, I, $), a(N) ? void 0 : N) : N;
          });
          return L = "<" + M, A && (L += " " + A), he.closing && (L += " /"), L += ">", L;
        } else
          return J = h(M, L, j), a(J) ? E(L) : J;
      },
      E
    );
    return b && (C = b.remove(C)), C;
  }, Fe = f, Fe;
}
var vt;
function Fr() {
  return vt || (vt = 1, function(r, e) {
    var n = Rt(), o = Dt(), i = Pr();
    function t(s, c) {
      var d = new i(c);
      return d.process(s);
    }
    e = r.exports = t, e.filterXSS = t, e.FilterXSS = i, function() {
      for (var s in n)
        e[s] = n[s];
      for (var c in o)
        e[c] = o[c];
    }(), typeof window < "u" && (window.filterXSS = r.exports);
    function a() {
      return typeof self < "u" && typeof DedicatedWorkerGlobalScope < "u" && self instanceof DedicatedWorkerGlobalScope;
    }
    a() && (self.filterXSS = r.exports);
  }(Oe, Oe.exports)), Oe.exports;
}
var Ue = Fr();
let $e = {
  html: {
    whiteList: {
      a: ["class", "style", "contenteditable", "data-id", "data-title", "data-size", "href", "data-last-modified"],
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
      img: ["class", "style", "devui-editorx-image", "style", "data-image-id", "src"],
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
const Lr = Ue.getDefaultWhiteList && Ue.getDefaultWhiteList() || {};
$e.html.whiteList = Object.assign(Lr, $e.html.whiteList);
new Ue.FilterXSS($e.html);
const Nt = Object.prototype.toString, jt = Object.prototype.hasOwnProperty, zr = Object.getPrototypeOf, Bt = jt.toString, Rr = Bt.call(Object), Dr = {
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
}, Ut = (r) => r == null, Te = (r) => Ut(r) ? String(r) : Dr[Nt.call(r)] || "object", yt = (r) => Te(r) === "object", ne = (r) => {
  if (!r || Nt.call(r) !== "[object Object]")
    return !1;
  const e = zr(r);
  if (!e)
    return !0;
  const n = jt.call(e, "constructor") && e.constructor;
  return typeof n == "function" && Bt.call(n) === Rr;
}, F = typeof window > "u", Nr = () => {
  let r = 8;
  return document.addEventListener && window.performance && (r = 9, window.atob && window.matchMedia && (r = 10, !window.attachEvent && !document.all && (r = 11))), r;
}, jr = (r) => {
  r.chrome && ~navigator.userAgent.indexOf("Edg") ? (r.name = "edge", r.edge = !0, delete r.chrome) : !document.documentMode && window.StyleMedia && (r.name = "edge", r.edge = !0);
};
(() => {
  if (F) return null;
  const r = {
    name: "",
    version: 0,
    isDoc: typeof document < "u",
    isMobile: !1,
    isPC: !0,
    isNode: F,
    chrome: !1,
    ie: !1,
    firefox: !1,
    safari: !1,
    opera: !1,
    edge: !1
  }, e = /(Android|webOS|iPhone|iPad|iPod|SymbianOS|BlackBerry|Windows Phone)/.test(navigator.userAgent);
  r.isMobile = e, r.isPC = !e;
  let n;
  if (window.chrome && (window.chrome.webstore || /^Google\b/.test(window.navigator.vendor)) ? (r.name = "chrome", r.chrome = !0, n = navigator.userAgent.match(/chrome\/(\d+)/i), r.version = !!n && !!n[1] && parseInt(n[1], 10), n = void 0) : document.all || document.documentMode ? (r.name = "ie", r.version = Nr(), r.ie = !0) : typeof window.InstallTrigger < "u" ? (r.name = "firefox", r.firefox = !0) : Object.prototype.toString.call(window.HTMLElement).indexOf("Constructor") > 0 ? (r.name = "safari", r.safari = !0) : (window.opr && window.opr.addons || window.opera) && (r.name = "opera", r.opera = !0), jr(r), !~["ie", "chrome"].indexOf(r.name)) {
    const o = r.name + "/(\\d+)";
    n = navigator.userAgent.match(new RegExp(o, "i")), r.version = !!n && !!n[1] && parseInt(n[1], 10), n = void 0;
  }
  if (r.isDoc) {
    const o = document.body || document.documentElement;
    ["webkit", "khtml", "moz", "ms", "o"].forEach((i) => {
      r["-" + i] = !!o[i + "MatchesSelector"];
    });
  }
  return r;
})();
const B = (r, e, n, o = !1) => {
  r && e && n && r.addEventListener(e, n, o);
}, Z = (r, e, n, o = !1) => {
  r && e && r.removeEventListener(e, n, o);
}, ge = (r, e = "") => {
  r && e.split(" ").filter((n) => n).forEach((n) => r.classList.add(n));
}, ve = (r, e) => {
  !r || !e || e.split(" ").filter((n) => n).forEach((n) => r.classList.remove(n));
}, $t = (r) => {
  if (F) return !1;
  if (r) {
    const e = getComputedStyle(r);
    if (e.getPropertyValue("position") === "fixed") {
      if (e.getPropertyValue("display") === "none")
        return !0;
      if (r.parentNode !== document.body)
        return $t(r.parentNode);
    } else
      return r.offsetParent === null;
  }
  return !1;
}, qt = function() {
  if (typeof Map < "u")
    return Map;
  const r = (e, n) => {
    let o = -1;
    return e.some((i, t) => i[0] === n ? (o = t, !0) : !1), o;
  };
  return function() {
    function e() {
      this.__entries__ = [];
    }
    return Object.defineProperty(e.prototype, "size", {
      get() {
        return this.__entries__.length;
      },
      enumerable: !0,
      configurable: !0
    }), e.prototype.get = function(n) {
      const o = r(this.__entries__, n), i = this.__entries__[o];
      return i && i[1];
    }, e.prototype.set = function(n, o) {
      const i = r(this.__entries__, n);
      ~i ? this.__entries__[i][1] = o : this.__entries__.push([n, o]);
    }, e.prototype.delete = function(n) {
      const o = this.__entries__, i = r(o, n);
      ~i && o.splice(i, 1);
    }, e.prototype.clear = function() {
      this.__entries__.splice(0);
    }, e.prototype.has = function(n) {
      return !!~r(this.__entries__, n);
    }, e.prototype.forEach = function(n, o) {
      o === void 0 && (o = null);
      for (let i = 0, t = this.__entries__; i < t.length; i++) {
        const a = t[i];
        n.call(o, a[1], a[0]);
      }
    }, e;
  }();
}(), Br = globalThis.Function, xe = function() {
  const r = (e) => e.Math === Math;
  return typeof global < "u" && r(global) ? global : typeof self < "u" && r(self) ? self : typeof window < "u" && r(window) ? window : Br("return this")();
}(), Ur = function() {
  return typeof requestAnimationFrame == "function" ? requestAnimationFrame.bind(xe) : function(r) {
    return setTimeout(() => r(Date.now()), 1e3 / 60);
  };
}();
let $r = 2;
function qr(r, e) {
  let n = !1, o = !1, i = 0, t;
  const a = () => {
    n && (n = !1, r()), o && t();
  }, s = () => {
    Ur(a);
  };
  return t = () => {
    const c = Date.now();
    if (n) {
      if (c - i < $r)
        return;
      o = !0;
    } else
      n = !0, o = !1, setTimeout(s, e);
    i = c;
  }, t;
}
const Vr = 20, Hr = ["top", "right", "bottom", "left", "width", "height", "size", "weight"], Wr = typeof MutationObserver < "u", Gr = function() {
  function r() {
    this.observers_ = [], this.connected_ = !1, this.mutationEventsAdded_ = !1, this.mutationsObserver_ = null, this.onTransitionEnd_ = this.onTransitionEnd_.bind(this), this.refresh = qr(this.refresh.bind(this), Vr);
  }
  return r.prototype.addObserver = function(e) {
    !~this.observers_.indexOf(e) && this.observers_.push(e), !this.connected_ && this.connect_();
  }, r.prototype.removeObserver = function(e) {
    const n = this.observers_, o = n.indexOf(e);
    ~o && n.splice(o, 1), !n.length && this.connected_ && this.disconnect_();
  }, r.prototype.refresh = function() {
    this.updateObservers_() && this.refresh();
  }, r.prototype.updateObservers_ = function() {
    const e = this.observers_.filter((n) => (n.gatherActive(), n.hasActive()));
    return e.forEach((n) => n.broadcastActive()), e.length > 0;
  }, r.prototype.connect_ = function() {
    if (!(F || this.connected_)) {
      if (B(document, "transitionend", this.onTransitionEnd_), B(window, "resize", this.refresh), Wr) {
        this.mutationsObserver_ = new MutationObserver(this.refresh);
        const e = {
          attributes: !0,
          childList: !0,
          characterData: !0,
          subtree: !0
        };
        this.mutationsObserver_.observe(document, e);
      } else
        B(document, "DOMSubtreeModified", this.refresh), this.mutationEventsAdded_ = !0;
      this.connected_ = !0;
    }
  }, r.prototype.disconnect_ = function() {
    F || !this.connected_ || (Z(document, "transitionend", this.onTransitionEnd_), Z(window, "resize", this.refresh), this.mutationsObserver_ && this.mutationsObserver_.disconnect(), this.mutationEventsAdded_ && Z(document, "DOMSubtreeModified", this.refresh), this.mutationsObserver_ = null, this.mutationEventsAdded_ = !1, this.connected_ = !1);
  }, r.prototype.onTransitionEnd_ = function(e) {
    const n = e.propertyName, o = n === void 0 ? "" : n;
    Hr.some((i) => !!~o.indexOf(i)) && this.refresh();
  }, r.getInstance = function() {
    return this._instance || (this._instance = new r()), this._instance;
  }, r._instance = null, r;
}(), Vt = function(r, e) {
  for (let n = 0, o = Object.keys(e); n < o.length; n++) {
    const i = o[n];
    Object.defineProperty(r, i, {
      value: e[i],
      configurable: !0,
      writable: !1,
      enumerable: !1
    });
  }
  return r;
}, Ce = function(r, e, n, o) {
  return { x: r, y: e, width: n, height: o };
}, oe = function(r) {
  return r && r.ownerDocument && r.ownerDocument.defaultView || xe;
}, Ht = Ce(0, 0, 0, 0), Se = (r) => parseFloat(r) || 0, bt = function(r) {
  let e = [];
  for (let n = 1; n < arguments.length; n++)
    e[n - 1] = arguments[n];
  return e.reduce((n, o) => {
    const i = r[`border-${o}-width`];
    return n + Se(i);
  }, 0);
}, Yr = function(r) {
  const e = ["top", "right", "bottom", "left"];
  let n = {};
  for (let o = 0, i = e; o < i.length; o++) {
    const t = i[o], a = r[`padding-${t}`];
    n[t] = Se(a);
  }
  return n;
}, Jr = function(r) {
  const e = r.getBBox();
  return Ce(0, 0, e.width, e.height);
}, Kr = function(r) {
  return r === oe(r).document.documentElement;
}, Qr = function(r) {
  const e = r.clientWidth, n = r.clientHeight;
  if (!n && !e)
    return Ht;
  const o = oe(r).getComputedStyle(r), i = Yr(o), t = i.top + i.bottom, a = i.left + i.right;
  let s = Se(o.width), c = Se(o.height);
  if (o.boxSizing === "border-box" && (Math.round(c + t) !== n && (c -= bt(o, "top", "bottom") + t), Math.round(s + a) !== e && (s -= bt(o, "left", "right") + a)), !Kr(r)) {
    const d = Math.round(c + t) - n, f = Math.round(s + a) - e;
    Math.abs(d) !== 1 && (c -= d), Math.abs(f) !== 1 && (s -= f);
  }
  return Ce(i.left, i.top, s, c);
}, Zr = /* @__PURE__ */ function() {
  return typeof SVGGraphicsElement < "u" ? (r) => r instanceof oe(r).SVGGraphicsElement : (r) => r instanceof oe(r).SVGElement && typeof r.getBBox == "function";
}(), Xr = function(r) {
  return F ? Ht : Zr(r) ? Jr(r) : Qr(r);
}, en = function(r) {
  const e = r.x, n = r.y, o = r.width, i = r.height, t = Object.create((typeof DOMRectReadOnly < "u" ? DOMRectReadOnly : Object).prototype);
  return Vt(t, {
    x: e,
    y: n,
    width: o,
    height: i,
    top: n,
    right: e + o,
    bottom: i + n,
    left: e
  }), t;
}, tn = function() {
  function r(e) {
    this.broadcastWidth = 0, this.broadcastHeight = 0, this.contentRect_ = Ce(0, 0, 0, 0), this.target = e;
  }
  return r.prototype.broadcastRect = function() {
    const e = this.contentRect_;
    return this.broadcastWidth = e.width, this.broadcastHeight = e.height, e;
  }, r.prototype.isActive = function() {
    const e = Xr(this.target);
    return this.contentRect_ = e, e.width !== this.broadcastWidth || e.height !== this.broadcastHeight;
  }, r;
}(), rn = /* @__PURE__ */ function() {
  function r(e, n) {
    const o = en(n);
    Vt(this, { target: e, contentRect: o });
  }
  return r;
}(), nn = function() {
  function r(e, n, o) {
    if (this.observations_ = new qt(), this.activeObservations_ = [], typeof e != "function")
      throw new TypeError("[TINY-Resize] The callback provided as parameter 1 is not a function.");
    this.callback_ = e, this.controller_ = n, this.callbackCtx_ = o;
  }
  return r.prototype.observe = function(e) {
    if (!arguments.length)
      throw new TypeError("[TINY-Resize] 1 argument required, but only 0 present.");
    if (typeof Element > "u" || !(Element instanceof Object))
      return;
    if (!(e instanceof oe(e).Element))
      throw new TypeError('[TINY-Resize] parameter 1 is not of type "Element".');
    const n = this.observations_;
    n.has(e) || (n.set(e, new tn(e)), this.controller_.addObserver(this), this.controller_.refresh());
  }, r.prototype.unobserve = function(e) {
    if (!arguments.length)
      throw new TypeError("[TINY-Resize]1 argument required, but only 0 present.");
    if (typeof Element > "u" || !(Element instanceof Object))
      return;
    if (!(e instanceof oe(e).Element))
      throw new TypeError('[TINY-Resize] parameter 1 is not of type "Element".');
    const n = this.observations_;
    n.has(e) && (n.delete(e), !n.size && this.controller_.removeObserver(this));
  }, r.prototype.gatherActive = function() {
    const e = this;
    this.clearActive(), this.observations_.forEach((n) => {
      n.isActive() && e.activeObservations_.push(n);
    });
  }, r.prototype.disconnect = function() {
    this.clearActive(), this.observations_.clear(), this.controller_.removeObserver(this);
  }, r.prototype.broadcastActive = function() {
    if (!this.hasActive())
      return;
    const e = this.callbackCtx_, n = this.activeObservations_.map(
      (o) => new rn(o.target, o.broadcastRect())
    );
    this.callback_.call(e, n, e), this.clearActive();
  }, r.prototype.hasActive = function() {
    return this.activeObservations_.length > 0;
  }, r.prototype.clearActive = function() {
    this.activeObservations_.splice(0);
  }, r;
}(), Wt = typeof WeakMap < "u" ? /* @__PURE__ */ new WeakMap() : new qt(), Gt = /* @__PURE__ */ function() {
  function r(e) {
    if (!(this instanceof r))
      throw new TypeError("[TINY-Resize] Cannot call a class as a function.");
    if (!arguments.length)
      throw new TypeError("[TINY-Resize] 1 argument required, but only 0 present.");
    const n = Gr.getInstance(), o = new nn(e, n, this);
    Wt.set(this, o);
  }
  return r;
}();
["observe", "unobserve", "disconnect"].forEach((r) => {
  Gt.prototype[r] = function() {
    let e;
    return (e = Wt.get(this))[r].apply(e, arguments);
  };
});
(function() {
  return typeof xe.ResizeObserver < "u" ? xe.ResizeObserver : Gt;
})();
const on = "tcirzywvqlkjhgfbZQG_FLOWHSUBDNIMYREVKCAJxp57XP043891T62-modnaesu";
on.split("").reverse().join("");
function an(r) {
  return !F && (r.document.all || r.document.documentMode) && !r.crypto && r.msCrypto;
}
function sn(r) {
  if (an(r)) {
    r.crypto = r.msCrypto;
    const e = r.crypto.getRandomValues;
    r.crypto.getRandomValues = function(n) {
      const o = e.call(r.crypto, n), i = [];
      for (let t = 0; t < n.length; t++)
        i[t] = o[t];
      return i;
    };
  }
}
const ln = globalThis;
sn(ln);
let Ee;
const cn = (r, e, n) => {
  if (!r || !ne(r) || !e || typeof e != "string")
    return;
  const o = e.split(".");
  let i = r;
  const t = o.length;
  if (t > 1) {
    for (let s = 0; s < t; s++)
      if (i = i[o[s]], Ut(i))
        return i;
    return i;
  } else
    return i[o[0]];
}, un = (r, e, n, o) => {
  if (!r || !ne(r) || !e || typeof e != "string")
    return r;
  const i = e.split("."), t = r;
  let a = i.length, s = i[0];
  if (a > 1) {
    a--;
    let c = t, d, f;
    for (let l = 0; l < a; l++)
      d = i[l], f = c[d], (f === null || !ne(f)) && (c[d] = {}, f = c[d]), c = f;
    s = i[a], c[s] = n;
  } else
    t[s] = n;
  return t;
}, dn = (r, e, n, o) => {
  const i = (t, a, s, c) => {
    const d = {};
    return a.forEach((f) => un(d, f, cn(t, f))), d;
  };
  return ne(r) ? Array.isArray(e) ? i(r, e) : Ee(n !== !1, {}, r) : r;
}, fn = (r) => Array.isArray(r) ? r.map((e) => dn(e)) : r, pn = (r, e, n, o, i) => {
  let t;
  if (n && o && (ne(o) || (t = Array.isArray(o))))
    if (t)
      t = !1, r[e] = fn(o);
    else {
      const a = i && ne(i) ? i : {};
      r[e] = Ee(n, a, o);
    }
  else if (o !== void 0)
    try {
      r[e] = o;
    } catch {
    }
};
Ee = function(...r) {
  const e = r.length;
  let n = r[0] || {}, o = 1, i = !1;
  for (Te(n) === "boolean" && (i = n, n = r[o] || {}, o++), !yt(n) && Te(n) !== "function" && (n = {}); o < e; o++) {
    const t = r[o];
    if (t !== null && yt(t)) {
      const a = Object.keys(t);
      for (const s of a) {
        const c = n[s], d = t[s];
        n !== d && pn(n, s, i, d, c);
      }
    }
  }
  return n;
};
function Xe(r) {
  let e = /* @__PURE__ */ Object.create(null);
  return function(n) {
    return e[n] || (e[n] = r(n));
  };
}
const hn = /-(\w)/g, mn = Xe((r) => r.replace(hn, (e, n) => n ? n.toUpperCase() : "")), gn = Xe((r) => r.charAt(0).toUpperCase() + r.slice(1)), vn = /\B([A-Z])/g, yn = Xe((r) => r.replace(vn, "-$1").toLowerCase()), bn = () => globalThis.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296, Vo = (r = "", e = 8) => r + bn().toString().substr(2, e), wn = {
  Escape: 27
}, Yt = {
  fullMonths: "January,February,March,April,May,June,July,August,September,October,November,December".split(","),
  fullWeeks: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
}, et = ["\\d\\d?", "\\d{3}", "\\d{4}"], G = et[0], Tn = et[1], xn = et[2], le = "[^\\s]+", wt = () => {
}, Jt = (r, e) => {
  let n = [];
  for (let o = 0, i = r.length; o < i; o++)
    n.push(r[o].substr(0, e));
  return n;
}, Tt = (r) => (e, n, o) => {
  const i = o[r].indexOf(n.charAt(0).toUpperCase() + n.substr(1).toLowerCase());
  ~i && (e.month = i);
}, Sn = Yt.fullWeeks, kn = Yt.fullMonths;
Jt(kn, 3);
Jt(Sn, 3);
const re = {
  d: [
    G,
    (r, e) => {
      r.day = e;
    }
  ],
  Do: [
    G + le,
    (r, e) => {
      r.day = parseInt(e, 10);
    }
  ],
  M: [
    G,
    (r, e) => {
      r.month = e - 1;
    }
  ],
  yy: [
    G,
    (r, e) => {
      const n = Number(String((/* @__PURE__ */ new Date()).getFullYear()).substr(0, 2));
      r.year = String(e > 68 ? n - 1 : n) + e;
    }
  ],
  h: [
    G,
    (r, e) => {
      r.hour = e;
    }
  ],
  m: [
    G,
    (r, e) => {
      r.minute = e;
    }
  ],
  s: [
    G,
    (r, e) => {
      r.second = e;
    }
  ],
  yyyy: [
    xn,
    (r, e) => {
      r.year = e;
    }
  ],
  S: [
    "\\d",
    (r, e) => {
      r.millisecond = e * 100;
    }
  ],
  SS: [
    "\\d{2}",
    (r, e) => {
      r.millisecond = e * 10;
    }
  ],
  SSS: [
    Tn,
    (r, e) => {
      r.millisecond = e;
    }
  ],
  D: [G, wt],
  ddd: [le, wt],
  MMM: [le, Tt("monthNamesShort")],
  MMMM: [le, Tt("monthNames")],
  a: [
    le,
    (r, e, n) => {
      const o = e.toLowerCase();
      o === n.amPm[0] ? r.isPm = !1 : o === n.amPm[1] && (r.isPm = !0);
    }
  ],
  ZZ: [
    "[^\\s]*?[\\+\\-]\\d\\d:?\\d\\d|[^\\s]*?Z",
    (r, e) => {
      let n = String(e).match(/([+-]|\d\d)/gi), o;
      n && (o = Number(n[1] * 60) + parseInt(n[2], 10), r.timezoneOffset = n[0] === "+" ? o : -o);
    }
  ]
}, Cn = ["A", "DD", "dd", "mm", "hh", "MM", "ss", "hh", "H", "HH"];
re.dddd = re.ddd;
Cn.forEach((r) => {
  r === "MM" ? re[r] = re[r.substr(0, 1)] : re[r] = re[r.substr(0, 1).toLowerCase()];
});
const En = () => {
}, An = function() {
  return F ? function(r) {
    setTimeout(() => r(Date.now()), 1e3 / 60);
  } : window.requestAnimationFrame.bind(window);
}(), qe = (r) => {
  r.scheduled || (r.scheduled = !0, r.raf(_n.bind(null, r)));
}, _n = (r) => {
  const { reads: e, writes: n } = r;
  let o;
  try {
    r.runTasks(e), r.runTasks(n);
  } catch (i) {
    o = i;
  }
  if (r.scheduled = !1, (e.length || n.length) && qe(r), o)
    if (r.catch)
      r.catch(o);
    else
      throw o;
}, xt = (r, e) => {
  const n = r.indexOf(e);
  return !!~n && !!r.splice(n, 1);
}, On = (r, e) => {
  for (let n in e)
    Object.hasOwnProperty.call(e, n) && (r[n] = e[n]);
};
class Mn {
  constructor() {
    this.reads = [], this.writes = [], this.raf = An.bind(window);
  }
  runTasks(e) {
    let n;
    for (; n = e.shift(); ) n();
  }
  measure(e, n) {
    const o = n ? e.bind(n) : e;
    return this.reads.push(o), qe(this), o;
  }
  mutate(e, n) {
    const o = n ? e.bind(n) : e;
    return this.writes.push(o), qe(this), o;
  }
  clear(e) {
    return xt(this.reads, e) || xt(this.writes, e);
  }
  extend(e) {
    if (!e || typeof e != "object") throw new Error("[TINY][FastDom] expected object");
    const n = Object.create(this);
    return On(n, e), n.fastdom = this, n.initialize && n.initialize(), n;
  }
}
const Kt = new Mn(), St = (r, e, n, o) => {
  const i = r._tasks, t = r.fastdom;
  let a;
  const s = new Promise(function(c, d) {
    a = t[e](function() {
      i.delete(s);
      try {
        c(o ? n.call(o) : n());
      } catch (f) {
        d(f);
      }
    }, o);
  });
  return i.set(s, a), s;
}, In = {
  initialize() {
    this._tasks = /* @__PURE__ */ new Map();
  },
  mutate(r, e) {
    return St(this, "mutate", r, e);
  },
  measure(r, e) {
    return St(this, "measure", r, e);
  },
  clear(r) {
    const e = this._tasks, n = e.get(r);
    this.fastdom.clear(n), e.delete(r);
  }
};
Kt.extend(In);
const Pn = (r, e) => {
  let n = e.length;
  for (; n--; )
    r.clear(e[n]), e.splice(n, 1);
}, Fn = (r, e) => {
  const n = r.indexOf(e);
  return !!~n && !!r.splice(n, 1);
};
class Ln {
  constructor(e) {
    this.fastdom = e, this.tasks = [];
  }
  measure(e, n) {
    const o = this.tasks, i = this.fastdom.measure(function() {
      return o.splice(o.indexOf(i)), e.call(n);
    });
    return o.push(i), i;
  }
  mutate(e, n) {
    const o = this.tasks, i = this.fastdom.mutate(function() {
      return o.splice(o.indexOf(i)), e.call(n);
    });
    return this.tasks.push(i), i;
  }
  clear(e) {
    return arguments.length || Pn(this.fastdom, this.tasks), Fn(this.tasks, e), this.fastdom.clear(e);
  }
}
const zn = {
  sandbox() {
    return new Ln(this.fastdom);
  }
};
Kt.extend(zn);
const Rn = [
  "fullscreenElement",
  "fullscreenEnabled",
  "requestFullscreen",
  "exitFullscreen",
  "fullscreenchange",
  "fullscreenerror"
], Dn = [
  "mozFullScreenElement",
  "mozFullScreenEnabled",
  "mozRequestFullScreen",
  "mozCancelFullScreen",
  "mozfullscreenchange",
  "mozfullscreenerror"
], Nn = [
  "webkitFullscreenElement",
  "webkitFullscreenEnabled",
  "webkitRequestFullscreen",
  "webkitExitFullscreen",
  "webkitfullscreenchange",
  "webkitfullscreenerror"
], jn = [
  "msFullscreenElement",
  "msFullscreenEnabled",
  "msRequestFullscreen",
  "msExitFullscreen",
  "MSFullscreenChange",
  "MSFullscreenError"
], Le = [Rn, Nn, Dn, jn], V = typeof window < "u" && typeof window.document < "u" ? window.document : {};
let z = null;
const Bn = () => {
  if (!F)
    for (let r = 0, e = Le.length; r < e; r++) {
      let n = Le[r];
      if (n && n[1] in V) {
        for (z = {}, r = 0; r < n.length; r++)
          z[Le[0][r]] = n[r];
        return;
      }
    }
};
Bn();
const kt = {
  change: z && z.fullscreenchange,
  error: z && z.fullscreenerror
}, Ve = {
  request(r, e) {
    return new Promise((n, o) => {
      const i = () => {
        this.off("change", i), n();
      };
      if (this.on("change", i), r = r || (F ? null : V.documentElement), r && z && r[z.requestFullscreen]) {
        const t = r[z.requestFullscreen](e);
        t instanceof Promise && t.then(i).catch(o);
      } else
        o(new Error("Fullscreen API not supported or element is null."));
    });
  },
  exit() {
    return new Promise((r, e) => {
      if (!this.isFullscreen) {
        r();
        return;
      }
      const n = () => {
        this.off("change", n), r();
      };
      if (this.on("change", n), !F && z && V[z.exitFullscreen]) {
        const o = V[z.exitFullscreen]();
        o instanceof Promise && o.then(n).catch(e);
      } else
        e(new Error("Fullscreen API not supported."));
    });
  },
  toggle(r, e) {
    return this.isFullscreen ? this.exit() : this.request(r, e);
  },
  onchange(r) {
    this.on("change", r);
  },
  onerror(r) {
    this.on("error", r);
  },
  on(r, e) {
    const n = kt[r];
    n && !F && B(V, n, e);
  },
  off(r, e) {
    const n = kt[r];
    n && !F && Z(V, n, e);
  },
  raw: z || {}
};
F ? Object.defineProperties(Ve, {
  isFullscreen: {
    get() {
      return !1;
    }
  },
  element: {
    enumerable: !0,
    get() {
      return null;
    }
  },
  isEnabled: {
    enumerable: !0,
    get() {
      return !1;
    }
  }
}) : Object.defineProperties(Ve, {
  isFullscreen: {
    get() {
      return !!V[z && z.fullscreenElement];
    }
  },
  element: {
    enumerable: !0,
    get() {
      return V[z && z.fullscreenElement];
    }
  },
  isEnabled: {
    enumerable: !0,
    get() {
      return !!V[z && z.fullscreenEnabled];
    }
  }
});
Ve.isEnabled;
function Un(r, e, n, o) {
  let i, t = 0;
  typeof e != "boolean" && (o = n, n = e, e = void 0);
  function a() {
    const c = this, d = (/* @__PURE__ */ new Date()).valueOf() - t, f = arguments;
    function l() {
      t = (/* @__PURE__ */ new Date()).valueOf(), n.apply(c, f);
    }
    function p() {
      i = void 0;
    }
    o && !i && l(), i && clearTimeout(i);
    const u = o === void 0;
    u && d > r ? l() : e !== !0 && (i = setTimeout(o ? p : l, u ? r - d : r));
  }
  function s() {
    i && (clearTimeout(i), i = null);
  }
  return a._cancel = s, a;
}
function $n(r, e, n) {
  return Un(r, e, !1);
}
let X = null;
const qn = "ws://localhost", Ct = [27197, 27198, 27199];
let ze = 0, ee, Qt = 1e3, Zt = 3e4, Vn = 0, tt = {}, Xt;
const Hn = 20 * 1e3;
let Et = null, er = null, He = {}, tr = {}, D = {}, rr = () => {
}, nr = () => {
};
const or = function(r) {
  clearTimeout(He[r]), delete tt[r], delete He[r];
}, Wn = function() {
  er = setTimeout(() => {
    X.close();
  }, 5e3);
}, W = function(r, e) {
  let n = Vn++;
  if (n = String(n), r.cid = n, !ee) {
    e && setTimeout(e, 0, { ok: !1, message: "eSpace is not logged in." });
    return;
  }
  typeof e == "function" && (tt[n] = e, He[n] = setTimeout(() => {
    e({ ok: !1, message: "time out" }), or(n);
  }, Zt)), X.send(JSON.stringify(r));
}, ir = function() {
  Et = setTimeout(() => {
    ee ? W(
      {
        type: "heartbeat"
      },
      () => {
        ir();
      }
    ) : clearTimeout(Et);
  }, Hn);
}, Gn = function(r) {
  ee = !0, ir(), clearTimeout(Xt), clearTimeout(er), nr(r);
}, Yn = function(r) {
  let e = r.data;
  if (typeof e == "string" && (e = e.replace(/^\d+/, ""), !!e)) {
    try {
      e = JSON.parse(e);
    } catch (n) {
      return !n;
    }
    if (ee) {
      let n = tr[e.type];
      if (n)
        return n(e.data);
      let o = e.cid, i = tt[o];
      i && (e.ok ? i(null, e.data) : i({ ok: e.ok }), or(o));
    } else
      e.type === "eSpace-ctrl-connection-success" ? Gn(e.data) : X.close();
  }
}, Jn = function() {
  X.onopen = Wn, X.onclose = Kn, X.onmessage = Yn;
}, ar = function(r) {
  Xt = setTimeout(() => {
    ze >= Ct.length && (ze = 0), X = new WebSocket(qn + ":" + Ct[ze++]), Jn();
  }, r || 0);
}, Kn = function() {
  (ee || typeof ee > "u") && (ee = !1, rr()), ar(Qt);
};
D.init = function(r) {
  r && (Zt = r.timeout || 3e4, Qt = r.pollingInterval || 0), ar();
};
D.ready = function(r) {
  nr = r;
};
D.error = function(r) {
  rr = r;
};
const At = function(r, e, n) {
  let o = [];
  for (let i = 0; i < e; i++) {
    let t = r;
    i && (t += i);
    let a = n[t];
    a && o.push(a);
  }
  return o;
};
D.on = function(r, e) {
  tr[r] = e;
};
D.getUserInfo = function(r, e) {
  W(
    {
      type: "get-user-info",
      param: r
    },
    function(n, o) {
      if (n)
        return e(n);
      const i = function(t) {
        return {
          account: t.account,
          name: t.name,
          mobile: At("mobile", 6, t),
          office_phone: At("office_phone", 6, t),
          home_phone: t.home_phone,
          ip_phone: t.ip_phone,
          other_phone: t.other_phone
        };
      };
      if (o.account)
        e(null, i(o));
      else {
        let t = {};
        for (let a in o)
          if (Object.prototype.hasOwnProperty.call(o, a)) {
            let s = o[a];
            t[a] = s && i(s);
          }
        e(null, t);
      }
    }
  );
};
D.subscribeUserStatus = function(r, e) {
  Array.isArray(r) && r.forEach((n) => {
  }), W(
    {
      type: "subscribe-user-status",
      param: r
    },
    e
  );
};
D.eSpaceCall = function(r, e, n) {
  W(
    {
      type: "espace-call",
      param: {
        account: r,
        number: e
      }
    },
    n
  );
};
D.eSpaceCallByAccount = function(r, e) {
  W(
    {
      type: "espace-call",
      param: {
        account: r
      }
    },
    e
  );
};
D.eSpaceCallByNumber = function(r, e) {
  W(
    {
      type: "espace-call",
      param: {
        number: r
      }
    },
    e
  );
};
D.showImDialog = function(r, e) {
  W(
    {
      type: "show-espace-im-dialog",
      param: r
    },
    e
  );
};
D.showGroupDialog = function(r, e) {
  W(
    {
      type: "show-espace-im-group-dialog",
      param: r
    },
    e
  );
};
D.addContactList = function(r, e) {
  W(
    {
      type: "add-contact-list",
      param: r
    },
    e
  );
};
if (F || !window.WebSocket) {
  const r = function() {
  };
  for (let e in D)
    Object.prototype.hasOwnProperty.call(D, e) && typeof D[e] == "function" && (D[e] = r);
}
const ye = {}, ce = {
  leave: "v-modal-leave",
  enter: "v-modal-enter",
  modal: "v-modal"
}, Qn = (r, e) => {
  for (let n = r.length - 1; n >= 0; n--)
    if (r[n].id === e) {
      r.splice(n, 1);
      break;
    }
};
let We;
const R = {
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
    const r = window.innerWidth - document.documentElement.clientWidth;
    r && (this.oldBodyBorder = document.documentElement.style.borderRight, document.body.style.borderRight = `${r}px solid transparent`);
  },
  resetBodyBorder() {
    document.body.style.borderRight = this.oldBodyBorder, this.oldBodyBorder = "";
  },
  /** 全局反注册 */
  deregister: (r) => {
    r && (ye[r] = null, delete ye[r]);
  },
  /** 返回全局实例 */
  getInstance: (r) => ye[r],
  /** 全局注册   仅vue-popup.ts中使用，instance就是vm, 把vm注册到 vm._popupId 这个键值上 */
  register: (r, e) => {
    r && e && (ye[r] = e);
  },
  nextZIndex: () => {
    const r = R.zIndex;
    return R.zIndex += R.step, r;
  },
  /** 打开遮罩层， 仅vue-popup.ts中使用。 dom = vm.$el 或者 undefined (appendtoBody时)  */
  openModal(r, e, n, o, i) {
    if (F || !r || e === void 0)
      return;
    this.modalFade = i;
    for (let s = 0, c = this.modalStack.length; s < c; s++)
      if (this.modalStack[s].id === r)
        return;
    const t = We();
    ge(t, ce.modal), this.modalFade && !R.hasModal && ge(t, ce.enter), o && o.trim().split(/\s+/).forEach((s) => ge(t, s)), setTimeout(() => {
      ve(t, ce.enter);
    }, 200), e && (t.style.zIndex = e.toString()), t.style.display = "", t.tabIndex = 0;
    let a;
    n && n.parentNode && n.parentNode.nodeType !== 11 ? a = n.parentNode : a = document.body, a.appendChild(t), this.modalStack.push({ id: r, zIndex: e, modalClass: o });
  },
  /** 点击背景遮罩层时，调用栈顶的popup，调用它的close() */
  doOnModalClick: () => {
    const r = R.modalStack, e = r[r.length - 1];
    if (!e)
      return;
    const n = R.getInstance(e.id);
    n && n.closeOnClickModal && typeof n.close == "function" && n.close();
  },
  closeModal(r) {
    const e = this.modalStack, n = We();
    if (e.length > 0) {
      const o = e[e.length - 1];
      if (o.id === r) {
        o.modalClass && o.modalClass.trim().split(/\s+/).forEach((t) => ve(n, t)), e.pop();
        const i = e.length;
        i > 0 && (n.style.zIndex = e[i - 1].zIndex.toString());
      } else
        Qn(e, r);
    }
    e.length === 0 && (this.modalFade && ge(n, ce.leave), ve(document.body, this.popLockClass), this.resetBodyBorder(), setTimeout(() => {
      e.length === 0 && (n.parentNode && n.parentNode.removeChild(n), n.style.display = "none", R.modalDom = null), ve(n, ce.leave);
    }, 200));
  }
};
We = () => {
  if (F)
    return null;
  let r = R.modalDom;
  return r ? R.hasModal = !0 : (R.hasModal = !1, r = document.createElement("div"), R.modalDom = r, r.addEventListener(
    "touchmove",
    (e) => {
      e.preventDefault(), e.stopPropagation();
    },
    { passive: !0 }
  ), B(r, "click", () => {
    R.doOnModalClick();
  })), r;
};
F || B(window, "keydown", (r) => {
  if (r.keyCode === wn.Escape) {
    const e = R.modalStack;
    if (e.length > 0) {
      const n = e[e.length - 1];
      if (!n)
        return;
      const o = R.getInstance(n.id);
      o && o.closeOnPressEscape && (o.handleClose ? o.handleClose("esc") : o.handleAction ? o.handleAction("cancel") : o.close());
    }
  }
});
const Zn = ["left", "right", "top", "bottom"], sr = ["shift", "offset", "preventOverflow", "keepTogether", "arrow", "flip", "applyStyle"], Xn = {
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
  preventOverflowOrder: Zn,
  modifiers: sr,
  // 此处是string数组， 构造函数调用之后转为函数数组
  updateHiddenPopperOnScroll: !1
  // 滚动过程中是否更新隐藏的弹出层位置
}, be = (r, e) => {
  const n = (o) => o !== "" && !isNaN(parseFloat(o)) && isFinite(o);
  Object.keys(e).forEach((o) => {
    let i = "";
    ~["width", "height", "top", "right", "bottom", "left"].indexOf(o) && n(e[o]) && (i = "px"), r.style[o] = e[o] + i;
  });
}, Re = (r) => {
  let e = r.offsetParent;
  return e === window.document.body || !e ? window.document.documentElement : e;
}, de = (r, e) => !r || r.nodeType !== 1 ? void 0 : window.getComputedStyle(r, null)[e], lr = (r) => r === window.document.body ? !1 : de(r, "position") === "fixed" ? !0 : (r.host && (r = r.host), r.parentNode ? lr(r.parentNode) : !1), Ge = (r) => {
  let e = r.getBoundingClientRect();
  return {
    left: e.left,
    top: e.top,
    right: e.right,
    bottom: e.bottom,
    width: e.right - e.left,
    height: e.bottom - e.top
  };
}, cr = (r) => {
  const e = ["scroll", "auto"];
  return e.includes(de(r, "overflow")) || e.includes(de(r, "overflow-x")) || e.includes(de(r, "overflow-y"));
}, eo = (r) => {
  const e = document.createElement("div");
  be(e, {
    opacity: 0,
    position: "fixed",
    width: 1,
    height: 1,
    top: 0,
    left: 0,
    "z-index": "-99"
  }), r.appendChild(e);
  const n = Ge(e);
  return r.removeChild(e), n;
}, we = (r) => {
  let e = r.parentNode;
  return e ? e === window.document ? window.document.body.scrollTop || window.document.body.scrollLeft ? window.document.body : window.document.documentElement : cr(e) ? e : we(e) : r;
}, to = (r, e, n, o) => {
  let { top: i, left: t, width: a, height: s } = Ge(r);
  if (n) {
    if (o.parentElement) {
      const { top: d, left: f } = eo(o.parentElement);
      i -= d, t -= f;
    }
    return {
      top: i,
      left: t,
      bottom: i + s,
      right: t + a,
      width: a,
      height: s
    };
  }
  let c = Ge(e);
  return {
    top: i - c.top,
    left: t - c.left,
    bottom: i - c.top + s,
    right: t - c.left + a,
    width: a,
    height: s
  };
}, ro = (r) => r === document.body ? Math.max(document.documentElement.scrollTop, document.body.scrollTop) : r.scrollTop, no = (r) => r === document.body ? Math.max(document.documentElement.scrollLeft, document.body.scrollLeft) : r.scrollLeft, oo = (r, e) => {
  const n = Math.max(r.scrollHeight, r.offsetHeight, e.clientHeight, e.scrollHeight, e.offsetHeight);
  return { width: Math.max(r.scrollWidth, r.offsetWidth, e.clientWidth, e.scrollWidth, e.offsetWidth), height: n };
}, De = (r) => {
  let e = r.style.display, n = r.style.visibility;
  r.style.display = "block", r.style.visibility = "hidden";
  let o = window.getComputedStyle(r), i = parseFloat(o.marginTop) + parseFloat(o.marginBottom), t = parseFloat(o.marginLeft) + parseFloat(o.marginRight), a = { width: r.offsetWidth + t, height: r.offsetHeight + i };
  return r.style.display = e, r.style.visibility = n, a;
}, _t = (r) => {
  let e = { left: "right", right: "left", bottom: "top", top: "bottom" };
  return r.replace(/left|right|bottom|top/g, (n) => e[n]);
}, ue = (r) => {
  let e = { ...r };
  return e.right = e.left + e.width, e.bottom = e.top + e.height, e;
}, ur = (r, e = []) => {
  const n = r.parentNode;
  return n ? (cr(n) && e.push(n), de(n, "position") === "fixed" ? e : ur(n, e)) : e;
}, Ot = (r) => {
  const e = {
    width: r.offsetWidth,
    height: r.offsetHeight,
    left: r.offsetLeft,
    top: r.offsetTop,
    right: 0,
    bottom: 0
  };
  return e.right = e.left + e.width, e.bottom = e.top + e.height, e;
}, Mt = (r) => {
  r.stopPropagation();
}, It = !F && typeof ResizeObserver == "function" ? new ResizeObserver((r) => {
  r.forEach((e) => {
    e.target.popperVm && e.contentRect.height > 50 && e.target.popperVm.update();
  });
}) : null;
class Ho {
  constructor(e, n, o) {
    te(this, "_reference"), te(this, "_popper"), te(this, "state"), te(this, "_options"), te(this, "modifiers", {}), te(this, "popperOuterSize", null), this._reference = e, this._popper = n, this.state = {}, this._options = { ...Xn, ...o }, this._options.modifierFns = sr.map((i) => this[i]), F || (this._popper.setAttribute("x-placement", this._options.placement), this.state.position = this._getPopperPositionByRefernce(this._reference), be(this._popper, { position: this.state.position, top: 0 }), this._popper && (this._popper.popperVm = this, It && It.observe(this._popper)), this.update(), this._setupEventListeners());
  }
  destroy() {
    return this._popper.removeAttribute("x-placement"), this._popper.style.display = "none", this._removeEventListeners(), this._options.removeOnDestroy && this._popper.remove(), this;
  }
  onUpdate(e) {
    return this.state.updateCallback = e, this;
  }
  update() {
    let e = { instance: this, styles: {} };
    this.stopEventBubble(), this.popperOuterSize = null, e.placement = e._originalPlacement = this._options.placement, e.offsets = this._getRefPopOffsets(this._popper, this._reference, e.placement), e.boundaries = this._getBoundaries(e, this._options.boundariesPadding, this._options.boundariesElement), e = this.runModifiers(e, this._options.modifierFns), typeof this.state.updateCallback == "function" && this.state.updateCallback(e);
  }
  // 阻止popper的mousewheel等事件冒泡。 通过 onxxx 绑定，是为了避免重复绑定事件
  stopEventBubble() {
    this._popper && (this._popper.onmousewheel || (this._popper.onmousewheel = Mt), this._popper.onwheel || (this._popper.onwheel = Mt));
  }
  /** 按顺序执行Modifiers， 如果传入终点modifier,则执行到指定位置 */
  runModifiers(e, n, o) {
    let i = n.slice();
    const t = this._options;
    return o !== void 0 && (i = this._options.modifierFns.slice(
      0,
      t.modifierFns.findIndex((a) => a === o)
    )), i.forEach((a) => {
      Te(a) === "function" && (e = a.call(this, e));
    }), e;
  }
  // 此时才把offsets.popper 赋值给popper dom,  offsets.array赋值给array dom
  applyStyle(e) {
    let n = { position: e.offsets.popper.position }, o = Math.round(e.offsets.popper.left), i = Math.round(e.offsets.popper.top);
    return this._options.gpuAcceleration ? (n.transform = `translate3d(${o}px, ${i}px, 0)`, Object.assign(n, { top: 0, left: 0 })) : Object.assign(n, { top: i, left: o }), Object.assign(n, e.styles), be(this._popper, n), this._popper.setAttribute("x-placement", e.placement), e.offsets.arrow && be(e.arrowElement, e.offsets.arrow), e;
  }
  // 判断 placement是不是2段式的，是则处理一下偏移。 修改data.offsets.popper的值
  shift(e) {
    let n = e.placement, o = n.split("-")[0], i = n.split("-")[1];
    if (i) {
      let { top: t, left: a, height: s, width: c } = e.offsets.reference, d = ue(e.offsets.popper), f = {
        y: {
          start: { top: t },
          end: { top: t + s - d.height }
        },
        x: {
          start: { left: a },
          end: { left: a + c - d.width }
        }
      }, l = ~["bottom", "top"].indexOf(o) ? "x" : "y";
      e.offsets.popper = Object.assign(d, f[l][i]);
    }
    return e;
  }
  // 校正popper的位置在boundaries 的内部
  preventOverflow(e) {
    if (this._options.ignoreBoundaries)
      return e;
    let n = this._options.preventOverflowOrder, o = ue(e.offsets.popper), i = {
      top: () => {
        let { top: t } = o;
        return t < e.boundaries.top && (t = Math.max(t, e.boundaries.top)), { top: t };
      },
      right: () => {
        let { left: t } = o;
        return o.right > e.boundaries.right && (t = Math.min(t, e.boundaries.right - o.width)), { left: t };
      },
      bottom: () => {
        let { top: t } = o;
        return o.bottom > e.boundaries.bottom && (t = Math.min(t, e.boundaries.bottom - o.height)), { top: t };
      },
      left: () => {
        let { left: t } = o;
        return o.left < e.boundaries.left && (t = Math.max(t, e.boundaries.left)), { left: t };
      }
    };
    return n.forEach((t) => {
      e.offsets.popper = Object.assign(o, i[t]());
    }), e;
  }
  // 校正popper的位置在reference的边上。 如果2个分离了，重新调整popper的位置。 可能是担心 modifiers.offset 带来的副作用吧
  keepTogether(e) {
    let n = ue(e.offsets.popper), o = e.offsets.reference;
    return n.right < Math.floor(o.left) && (e.offsets.popper.left = Math.floor(o.left) - n.width), n.left > Math.floor(o.right) && (e.offsets.popper.left = Math.floor(o.right)), n.bottom < Math.floor(o.top) && (e.offsets.popper.top = Math.floor(o.top) - n.height), n.top > Math.floor(o.bottom) && (e.offsets.popper.top = Math.floor(o.bottom)), e;
  }
  // 根据flip的策略，计算当前应该显示的位置。 空间不够要计算出flip的位置。 可能是担心preventOverflow 时，造成pop, reference会重叠。 重叠了就要flip一下
  flip(e) {
    if (e.flipped && e.placement === e._originalPlacement)
      return e;
    const n = e.placement.split("-");
    let o = n[0], i = _t(o), t = n[1] || "", a = [o, i];
    return a.forEach((s, c) => {
      if (o !== s || a.length === c + 1)
        return;
      o = e.placement.split("-")[0], i = _t(o);
      let d = ue(e.offsets.popper), f = ~["right", "bottom"].indexOf(o), l = Math.floor(e.offsets.reference[o]), p = Math.floor(d[i]);
      (f && l > p || !f && l < p) && (e.flipped = !0, e.placement = a[c + 1], t && (e.placement += `-${t}`), e.offsets.popper = this._getRefPopOffsets(this._popper, this._reference, e.placement).popper, e = this.runModifiers(e, this._options.modifierFns, this.flip));
    }), e;
  }
  // 根据入参option上的offset, 给data.offset.popper进行校正
  offset(e) {
    let n = this._options.offset, o = e.offsets.popper;
    return ~e.placement.indexOf("left") ? o.top -= n : ~e.placement.indexOf("right") ? o.top += n : ~e.placement.indexOf("top") ? o.left -= n : ~e.placement.indexOf("bottom") && (o.left += n), e;
  }
  // 计算arrow的位置,保存在data.offsets.arrow ={top,left}
  arrow(e) {
    let n = this._options.arrowElement, o = this._options.arrowOffset;
    if (typeof n == "string" && (n = this._popper.querySelector(n)), !n || !this._popper.contains(n))
      return e;
    let i = {}, t = e.placement.split("-")[0], a = ue(e.offsets.popper), s = e.offsets.reference, c = ~["left", "right"].indexOf(t), d = c ? "height" : "width", f = c ? "bottom" : "right", l = c ? "left" : "top", p = c ? "top" : "left", u = this.popperOuterSize ? this.popperOuterSize : this.popperOuterSize = De(this._popper), T = De(n), w = T[d];
    s[f] - w < a[p] && (e.offsets.popper[p] -= a[p] - (s[f] - w)), s[p] + w > a[f] && (e.offsets.popper[p] += s[p] + w - a[f]);
    let h = s[p] + (o || s[d] / 2 - w / 2) - a[p];
    h = Math.max(Math.min(a[d] - w - 8, h), 8), i[p] = h, i[l] = "";
    const S = this._options.placement.split("-");
    return this._options.adjustArrow && ~["top", "bottom"].indexOf(S[0]) && p === "left" && (S[1] === "start" ? i.left = 8 : S[1] || (i.left = (u.width - T.width) / 2)), e.offsets.arrow = i, e.arrowElement = n, e;
  }
  /** 判断 reference 的 offsetParent 元素是fix还是abs, 这个值会赋值给popper 的dom */
  _getPopperPositionByRefernce(e) {
    return this._options.forceAbsolute ? "absolute" : lr(e) ? "fixed" : "absolute";
  }
  /** 实时计算一下popper, reference的 位置信息， 用于 */
  _getRefPopOffsets(e, n, o) {
    o = o.split("-")[0];
    let i = { position: this.state.position }, t = i.position === "fixed", a = to(
      n,
      Re(e),
      t,
      e
    );
    const { width: s, height: c } = this.popperOuterSize ? this.popperOuterSize : this.popperOuterSize = De(e);
    return ~["right", "left"].indexOf(o) ? (i.top = a.top + a.height / 2 - c / 2, o === "left" ? i.left = a.left - s : i.left = a.right) : (i.left = a.left + a.width / 2 - s / 2, o === "top" ? i.top = a.top - c : i.top = a.bottom), i.width = s, i.height = c, {
      popper: i,
      reference: a
    };
  }
  _setupEventListeners() {
    var e, n;
    if (this.state.updateBoundFn = this.update.bind(this), this.state.scrollUpdate = () => {
      if (this._options.updateHiddenPopperOnScroll)
        this.state.updateBoundFn();
      else {
        if ($t(this._reference)) return;
        this.state.updateBoundFn();
      }
    }, B(window, "resize", this.state.updateBoundFn), this._options.boundariesElement !== "window") {
      let o = this._options.scrollParent || we(this._reference);
      const i = [];
      if ((n = (e = o == null ? void 0 : o.dataset) == null ? void 0 : e.tag) != null && n.includes("-form")) {
        i.push(o);
        let t = we(o);
        (t === window.document.body || t === window.document.documentElement) && (t = window), i.push(t);
      }
      if ((o === window.document.body || o === window.document.documentElement) && (o = window), this.state.scrollTarget = o, this._options.bubbling || R.globalScroll) {
        let t = ur(this._reference);
        this.state.scrollTargets = t || [], t.forEach((a) => {
          B(a, "scroll", this.state.scrollUpdate);
        });
      } else
        i.length ? (this.state.scrollTargets = i, i.forEach((t) => {
          B(t, "scroll", this.state.scrollUpdate);
        })) : B(o, "scroll", this.state.scrollUpdate);
    }
  }
  _removeEventListeners() {
    Z(window, "resize", this.state.updateBoundFn), this._options.boundariesElement !== "window" && this.state.scrollTarget && (Z(this.state.scrollTarget, "scroll", this.state.scrollUpdate), this.state.scrollTarget = null, (this._options.bubbling || R.globalScroll) && ((this.state.scrollTargets || []).forEach((e) => {
      Z(e, "scroll", this.state.scrollUpdate);
    }), this.state.scrollTargets = null)), this.state.updateBoundFn = null, this.state.scrollUpdate = null;
  }
  /** 实时计算一下Boundary的位置 */
  _getBoundaries(e, n, o) {
    let i = { right: 0, left: 0, top: 0, bottom: 0 };
    if (o === "window" || o === "body") {
      let t = window.document.body, a = window.document.documentElement, { width: s, height: c } = oo(t, a);
      i = { top: 0, right: s, bottom: c, left: 0 };
    } else if (o === "viewport") {
      let t = Re(this._popper), a = we(this._popper), s = Ot(t);
      const c = e.offsets.popper.position === "fixed" || !this._options.appendToBody && ["right", "left"].includes(this._options.placement);
      let d = c ? 0 : ro(a), f = c ? 0 : no(a);
      const l = window;
      i = {
        top: 0 - (s.top - d),
        right: l.document.documentElement.clientWidth - (s.left - f),
        bottom: l.document.documentElement.clientHeight - (s.top - d),
        left: 0 - (s.left - f)
      };
    } else if (Re(this._popper) === o) {
      const { clientWidth: t, clientHeight: a } = o;
      i = {
        right: t,
        bottom: a,
        top: 0,
        left: 0
      };
    } else
      i = Ot(o);
    return i.right -= n, i.left += n, i.bottom = i.bottom - n, i.top = i.top + n, i;
  }
  // https://popper.js.org/docs/v2/lifecycle/#set-new-options
  setOptions(e) {
    Object.assign(this._options, e);
  }
}
var Ae = {
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
      exceed: "{fileName} 文件大小超过限制（{maxSize}）",
      largeFile: "文件大小超出限制 2G ！！",
      fileSize: "{fileName} 文件大小低于限制（{minSize}{sizeUnit}）",
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
      len: "长度必须为 %s",
      min: "长度不能小于 %s",
      max: "长度不能大于 %s",
      range: "长度必须介于 %s 和 %s 之间"
    },
    date: {
      format: "日期 %s 对于格式 %s 无效",
      invalid: "日期 %s 无效",
      parse: "无法分析 %s 日期， %s 无效"
    },
    default: "%s 字段校验错误",
    enum: "必须是 %s 中的一个",
    number: {
      len: "必须等于 %s",
      min: "不能小于 %s",
      max: "不能大于 %s",
      range: "必须介于 %s 和 %s 之间"
    },
    pattern: {
      mismatch: "值%s 与模式 %s 不匹配"
    },
    required: "必填",
    string: {
      len: "必须是 %s 个字符",
      min: "必须至少为 %s 个字符",
      max: "不能大于 %s 个字符",
      range: "必须介于 %s 和 %s 个字符之间"
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
    whitespace: "不能为空"
  }
}, rt = {
  "en-US": "English",
  "zh-CN": "Chinese",
  "zh-TW": "China Taiwan",
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
      title: "Messages",
      placeholder: "Enter a keyword.",
      sure: "OK",
      cancel: "Cancel"
    },
    todoList: {
      add: "Add",
      placeholder: "Please enter content..."
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
      noMatch: "No matches.",
      loading: "Loading",
      placeholder: "--Select--",
      noData: "No data available."
    },
    chart: {
      auxiliary: "Auxiliary",
      emptyText: "No Data",
      kName: "Daily K-line",
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
      choose: "Select Picture",
      zoomOut: "Reduced by 10%",
      zoomIn: "Zoom in by 10%",
      rotate_45: "rotate -45°",
      rotate45: "rotate 45°",
      closeCropArea: "hide selection",
      reset: "reset",
      closeCrop: "Exit cropping",
      cropImage: "Selecting a Region"
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
      year: "",
      hour: "Hour",
      minute: "Minute",
      second: "Second",
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
      nodeDelete: "Delete Node",
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
      build: "The module is under construction.",
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
      exceed: "{fileName} The file size exceeds the upper limit ({maxSize}).",
      largeFile: "The file exceeds 2 GB.",
      fileSize: "{fileName} The file is less than the minimum size ({minSize} {sizeUnit}).",
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
      in: "Login",
      out: "Logout"
    },
    page: {
      goto: "Go to",
      item: "items",
      next: "Next",
      page: "Records/Page",
      pageClassifier: "page",
      pagesize: "Records/Page",
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
      confirmDeleteTips: "Delete This File?",
      delete: "Delete",
      waitUpload: "Waiting for upload",
      operation: "Operation",
      success: "Upload successful",
      listTip: "There are a total of {0} pieces of data: ",
      errorListTip: "There are {0} errors in them. Please modify them and try again",
      limitUploadFileType: "Supported file formats",
      limitUploadFileNumber: "Maximum files allowed",
      limitUploadFileSize: "Maximum file size",
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
      deleteTip1: "Deleted data cannot be restored. Continue?",
      deleteTip2: "This node has child nodes. Retain them?",
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
      invalid: "%s field verification error.",
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
      dateYM: "The date format (yyyy-mm) does not comply with the rule.",
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
}, io = /(%|)\{([0-9a-zA-Z_]+)\}/g;
function ao(r) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), o = 1; o < e; o++)
    n[o - 1] = arguments[o];
  return n.length === 1 && typeof n[0] == "object" && (n = n[0]), (!n || !n.hasOwnProperty) && (n = {}), r.replace(io, function(i, t, a, s) {
    var c;
    return r[s - 1] === "{" && r[s + i.length] === "}" ? a : (c = Object.prototype.hasOwnProperty.call(n, a) ? n[a] : null, c ?? "");
  });
}
var fe = Ae, pe = null, _e = function(e, n) {
  if (n === void 0 && (n = void 0), pe) return pe.apply(this, arguments);
  for (var o = e.split("."), i = null, t = fe, a = 0, s = o.length; a < s; a++) {
    var c = o[a];
    if (i = t[c] || "", a === s - 1) return ao(i, n);
    if (!i) return "";
    t = i;
  }
  return "";
}, dr = function(e) {
  return fe = e || fe, fe;
}, so = function() {
  return fe.code;
}, fr = function(e) {
  return pe = e || _e, pe;
}, nt = Ee, pr = function(e) {
  var n = e.app, o = e.createI18n, i = e.messages, t = i === void 0 ? {} : i, a = e.i18n, s = a === void 0 ? {} : a, c = e.merge;
  typeof c != "function" && (c = function(p) {
    var u = p.lang, T = p.i18n, w = p.messages;
    return nt(!0, u, T.messages, w);
  });
  var d = {
    zhCN: Ae,
    enUS: rt
  };
  if (typeof o == "function") {
    var f = o({
      legacy: s.legacy,
      locale: s.locale || "zhCN",
      messages: c({
        lang: d,
        i18n: s,
        messages: t
      })
    });
    return pe = function(p, u) {
      return f.global.t(p, u);
    }, f;
  }
  return n && n.config && n.config.globalProperties && (n.config.globalProperties.$t = _e), c({
    lang: d,
    i18n: s,
    messages: t
  });
}, hr = !0, mr = !1, lo = {
  isVue2: hr,
  isVue3: mr,
  use: dr,
  t: _e,
  i18n: fr,
  initI18n: pr,
  extend: nt,
  zhCN: Ae,
  enUS: rt
}, Y = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: lo,
  enUS: rt,
  extend: nt,
  i18n: fr,
  initI18n: pr,
  isVue2: hr,
  isVue3: mr,
  language: so,
  t: _e,
  use: dr,
  zhCN: Ae
}, Symbol.toStringTag, {
  value: "Module"
}));
Y.use;
var Pt = Y.t;
Y.i18n;
Y.initI18n;
Y.extend;
Y.zhCN;
Y.enUS;
Y.language;
const co = ({ onMounted: r, onActivated: e, nextTick: n }) => (o) => {
  let i;
  r(() => {
    o(), n(() => i = !0);
  }), e(() => i && o());
}, uo = ({ getCurrentInstance: r, isVue2: e, nextTick: n, onUnmounted: o }) => () => {
  const i = r().proxy;
  e || Object.defineProperty(i, "$scopedSlots", { configurable: !0, value: null }), Object.defineProperty(i, "instanceSlots", {
    configurable: !0,
    get: () => i.$scopedSlots || i.$slots
  }), o(() => {
    n(() => {
      e || delete i.$scopedSlots, delete i.instanceSlots;
    });
  });
}, fo = ({
  computed: r,
  getCurrentInstance: e,
  inject: n,
  markRaw: o,
  nextTick: i,
  onMounted: t,
  onActivated: a,
  onUnmounted: s,
  provide: c,
  reactive: d,
  toRef: f
}) => ({ relationKey: l, relationContainer: p, onChange: u, childrenKey: T, delivery: w } = {}) => {
  if (!l)
    throw new Error("[TINY Error]<relationKey> must exist.");
  const h = e(), S = d({ children: [], indexInParent: -1 }), g = n(l, null);
  let v = [];
  if (g) {
    const { link: b, unlink: C, callbacks: _, childrenKey: O, delivery: M } = g;
    v = _, T = T || O || "instanceChildren", w = M, S.indexInParent = b(h), s(() => C(h));
  } else {
    T = T || "instanceChildren";
    const b = co({ onMounted: t, onActivated: a, nextTick: i }), C = u ? () => i(u) : En;
    let _;
    i(() => {
      const O = typeof p == "function" ? p() : p;
      O && (_ = new MutationObserver((M, L) => {
        const U = [];
        gr(O.childNodes, U), v.forEach((j) => j(U, M, L)), C();
      }), _.observe(O, { attributes: !0, childList: !0, subtree: !0 }));
    }), b(() => C()), s(() => {
      _ && (_.disconnect(), _ = null), v = null;
    });
  }
  const E = (b) => {
    const C = b.proxy;
    return S.children.push(o(C)), r(() => S.children.indexOf(C));
  }, x = (b) => {
    const C = S.children.indexOf(b.proxy);
    C > -1 && S.children.splice(C, 1);
  };
  return v.push((b) => po(S.children, b)), c(l, { link: E, unlink: x, callbacks: v, childrenKey: T, delivery: w }), Object.defineProperty(h.proxy, T, { configurable: !0, get: () => S.children }), s(() => delete h.proxy[T]), { children: f(S, "children"), index: f(S, "indexInParent"), delivery: w };
}, gr = (r, e) => {
  r.length && r.forEach((n) => {
    e.push(n), n.childNodes && gr(n.childNodes, e);
  });
}, po = (r, e) => {
  r.sort((n, o) => e.indexOf(n.$el) - e.indexOf(o.$el));
};
function ie() {
  return ie = Object.assign ? Object.assign.bind() : function(r) {
    for (var e = 1; e < arguments.length; e++) {
      var n = arguments[e];
      for (var o in n) ({}).hasOwnProperty.call(n, o) && (r[o] = n[o]);
    }
    return r;
  }, ie.apply(null, arguments);
}
var vr = function() {
  var e = {}, n = function(t, a, s) {
    if (s === void 0 && (s = !1), t && typeof t == "string" && typeof a == "function") {
      var c = e[t] || [];
      e[t] = c, c.push(a), a.once = s;
    }
  }, o = {
    emit: function(t) {
      var a = arguments, s = e[t];
      s && (s.forEach(function(c) {
        return c.apply(null, [].slice.call(a, 1));
      }), e[t] = s.filter(function(c) {
        return !c.once;
      }));
    },
    on: n,
    once: function(t, a) {
      n(t, a, !0);
    },
    off: function(t, a) {
      if (t && typeof t == "string") {
        var s = e[t];
        typeof a == "function" ? e[t] = s.filter(function(c) {
          return c !== a;
        }) : delete e[t];
      } else
        e = {};
    }
  };
  return o;
}, ho = function(e, n) {
  n === void 0 && (n = {});
  var o = {};
  for (var i in e)
    i.indexOf("_") !== 0 && (o[i] = e[i]);
  for (var t in n)
    o[t] = n[t];
  return o;
}, mo = function(e, n) {
  if (e === void 0 && (e = {}), typeof n == "object") {
    var o = Array.isArray(n) ? n : Object.keys(n).filter(function(t) {
      return n[t];
    }), i = "";
    return o.forEach(function(t) {
      e[t] && (i += e[t] + " ");
    }), i;
  } else
    return e[n] || "";
}, go = k.defineAsyncComponent, vo = k.markRaw, yr = function(e) {
  var n = e.view, o = n === void 0 ? void 0 : n, i = e.component, t = i === void 0 ? void 0 : i, a = e.props, s = e.context, c = s.attrs, d = s.slots, f = e.extend, l = f === void 0 ? {} : f;
  return function() {
    return k.h(o && o.value || t, ie({
      ref: "modeTemplate"
    }, a, c, l), d);
  };
}, ot = function(e) {
  var n = k.getCurrentInstance();
  return e && br(n), n == null ? void 0 : n.appContext.config.globalProperties;
}, yo = function() {
  var e, n = k.getCurrentInstance(), o = n == null || (e = n.type) == null ? void 0 : e.name;
  if (!o) {
    var i, t;
    o = n == null || (i = n.parent) == null || (t = i.type) == null ? void 0 : t.name;
  }
  return o || "";
}, bo = function() {
  var e;
  return ((e = k.getCurrentInstance()) == null ? void 0 : e.appContext) || {
    component: function() {
    }
  };
}, wo = function() {
  var e = k.getCurrentInstance();
  return (e == null ? void 0 : e.appContext.config.globalProperties) || {};
}, To = function(e) {
  var n;
  e === void 0 && (e = k.getCurrentInstance());
  var o = (n = e) == null ? void 0 : n.appContext.config.globalProperties.$router, i = o && o.currentRoute.value;
  return {
    route: i,
    router: o
  };
}, br = function(e) {
  var n = vr();
  typeof e.$emitter > "u" && Object.defineProperty(e, "$emitter", {
    get: function() {
      return n;
    }
  });
}, xo = function(e) {
  var n = function(i, t, a, s) {
    var c = i.subTree && i.subTree.children || i.children;
    Array.isArray(c) && c.forEach(function(d) {
      var f = d.type && d.type.componentName, l = d.component;
      f === t ? (l.emit(a, s), l.$emitter && l.$emitter.emit(a, s)) : n(d, t, a, s);
    });
  };
  return {
    dispatch: function(i, t, a) {
      for (var s = e.parent || e.root, c = s.type && s.type.componentName; s && (!c || c !== i); )
        s = s.parent, s && (c = s.type && s.type.componentName);
      if (s) {
        var d, f;
        (d = s).emit.apply(d, [t].concat(a)), s.$emitter && (f = s.$emitter).emit.apply(f, [t].concat(a));
      }
    },
    broadcast: function(i, t, a) {
      n(e, i, t, a);
    }
  };
}, ke = function(e) {
  if (e && e.parent) return e.parent.type.name === "AsyncComponentWrapper" && e.parent.parent ? e.parent.parent : e.parent;
}, So = function(e) {
  return function(n) {
    var o = ke(e), i = 0, t = function(s) {
      return {
        level: i,
        vm: H({}, s),
        el: s.vnode.el,
        options: s.type
      };
    };
    if (typeof n != "function") return o ? t(o) : {};
    for (i++; o && !n(t(o)); )
      o = ke(o), i++;
  };
}, ko = function(e) {
  return function(n) {
    if (typeof n != "function") return wr(e.subTree);
    var o = 1, i = function(a) {
      if (a) {
        var s = a.children || a.dynamicChildren, c = o++;
        if (Array.isArray(s)) {
          if (s.some(function(d) {
            return d.component && n({
              level: c,
              vm: H({}, d.component),
              el: d.el,
              options: d.type,
              isLevel1: !0
            });
          })) return;
          s.forEach(function(d) {
            return i(d);
          });
        }
      }
    };
    i(e.subTree);
  };
}, Co = /^on[A-Z]/, Eo = function(e) {
  var n = {}, o = {};
  for (var i in e) {
    var t = e[i];
    if (Co.test(i) && typeof t == "function") {
      o[yn(i.substr(2))] = t;
      continue;
    }
    n[i] = t;
  }
  return {
    $attrs: n,
    $listeners: o
  };
}, wr = function(e) {
  var n = [];
  if (n.refs = {}, e) {
    var o = e.dynamicChildren || e.children;
    Array.isArray(o) ? o.forEach(function(i) {
      if (i.component) {
        var t = H({}, i.component);
        n.push(t), i.props.ref && (n.refs[i.props.ref] = t);
      }
    }) : e.component && n.push(H({}, e.component));
  }
  return n;
}, Ne = function(e, n, o, i) {
  var t = function(c) {
    if (typeof i == "function" && i(c)) return 1;
    Object.defineProperty(e, c, {
      configurable: !0,
      enumerable: !0,
      get: function() {
        return n[o][c];
      },
      set: function(f) {
        return n[o][c] = f;
      }
    });
  };
  for (var a in n[o])
    t(a);
  return e;
}, Ft = function(e) {
  return e.indexOf("_") === 0;
}, Tr = function(e, n) {
  return Ne(e, n, "setupState", null), Ne(e, n, "props", Ft), Ne(e, n, "ctx", Ft), e;
}, H = function(e, n, o) {
  o === void 0 && (o = null);
  var i = Eo(n.attrs), t = i.$attrs, a = i.$listeners, s = n.$emitter;
  s || (br(n), s = n.$emitter);
  var c = function() {
    for (var l = arguments.length, p = new Array(l), u = 0; u < l; u++)
      p[u] = arguments[u];
    n.emit.apply(n, p), s.emit.apply(e, p);
  }, d = function(l, p, u) {
    return l[p] = u;
  };
  return o || Tr(e, n), Object.defineProperties(e, {
    $attrs: {
      get: function() {
        return t;
      }
    },
    $children: {
      get: function() {
        return wr(n.subTree);
      }
    },
    $constants: {
      get: function() {
        return n.props._constants;
      }
    },
    $emit: {
      get: function() {
        return c;
      }
    },
    $el: {
      get: function() {
        return n.vnode.el;
      }
    },
    $listeners: {
      get: function() {
        return a;
      }
    },
    $mode: {
      get: function() {
        return n._tiny_mode;
      }
    },
    $nextTick: {
      get: function() {
        return k.nextTick;
      }
    },
    $off: {
      get: function() {
        return s.off;
      }
    },
    $on: {
      get: function() {
        return s.on;
      }
    },
    $once: {
      get: function() {
        return s.once;
      }
    },
    $options: {
      get: function() {
        return {
          componentName: n.type.componentName
        };
      }
    },
    $parent: {
      get: function() {
        return n.parent && H({}, ke(n));
      }
    },
    $refs: {
      get: function() {
        return n.refs;
      }
    },
    $renderless: {
      get: function() {
        return n.props.tiny_renderless;
      }
    },
    $scopedSlots: {
      get: function() {
        return n.slots;
      }
    },
    $set: {
      get: function() {
        return d;
      }
    },
    $slots: {
      get: function() {
        return n.slots;
      }
    },
    $template: {
      get: function() {
        return n.props.tiny_template;
      }
    }
  }), e;
}, Ao = function(e, n) {
  for (var o in e.refs)
    Object.prototype.hasOwnProperty.call(e.refs, o) && (n[o] = e.refs[o]);
}, _o = function(e, n) {
  var o, i, t = k.getCurrentInstance(), a = t == null ? void 0 : t.appContext.config.globalProperties, s = To(t), c = s.route, d = s.router, f = t == null || (o = t.proxy) == null || (i = o.$root) == null ? void 0 : i.$i18n, l = xo(t), p = l.dispatch, u = l.broadcast, T = So(t), w = ko(t), h = H({}, t, e), S = e.emit, g = {}, v = typeof t.props.tiny_template > "u" && ke(t), E = v ? H({}, v) : t.parent ? H({}, t.parent) : null, x = function(O) {
    var M, L = O.name, U = O.value, j = v ? v.ctx : t == null || (M = t.parent) == null ? void 0 : M.ctx;
    j[L] = U, E[L] = U;
  }, b = function(O) {
    Object.defineProperties(h, O), Object.defineProperties(t == null ? void 0 : t.ctx, O);
  }, C = function(O) {
    E && Object.defineProperties(E, O);
  };
  return k.onBeforeMount(function() {
    return Tr(h, t);
  }), k.onMounted(function() {
    return Ao(t, g);
  }), {
    framework: "vue3",
    vm: h,
    emit: S,
    emitter: vr,
    route: c,
    router: d,
    dispatch: p,
    broadcast: u,
    parentHandler: T,
    childrenHandler: w,
    i18n: f,
    refs: g,
    slots: t == null ? void 0 : t.slots,
    scopedSlots: t == null ? void 0 : t.slots,
    attrs: e.attrs,
    parent: E,
    nextTick: k.nextTick,
    constants: t == null ? void 0 : t.props._constants,
    mode: n,
    isPCMode: n === "pc",
    isMobileMode: n === "mobile",
    service: a == null ? void 0 : a.$service,
    getService: function() {
      return a == null ? void 0 : a.$getService(h);
    },
    setParentAttribute: x,
    defineInstanceProperties: b,
    defineParentInstanceProperties: C
  };
}, Wo = function(e) {
  return e;
}, Oo = k.Text, Mo = k.Comment, Go = function(e) {
  return !e || !e.type || [Oo, Mo].includes(e.type);
}, Io = function(e) {
  var n = {};
  for (var o in e)
    if (o === "class" || o === "style")
      n[o] = e[o];
    else if (o === "on" || o === "nativeOn") {
      var i = e[o];
      for (var t in i) n["on" + gn(mn(t))] = i[t];
    } else if (o === "attrs" || o === "props" || o === "domProps") {
      var a = e[o];
      for (var s in a) n[s] = a[s];
    } else
      n[o] = e[o];
  return n;
}, Po = function(e) {
  var n = e, o = !1;
  if (typeof e == "string" && typeof document < "u") {
    var i = document.createElement(e), t = ["SVG", "CIRCLE", "PATH"];
    i instanceof HTMLUnknownElement && !t.includes(i.nodeName) || e.includes("-") ? (e = e.toLowerCase(), o = !0, e === "transition" ? n = k.Transition : e === "transition-group" ? n = k.TransitionGroup : n = k.resolveComponent(e)) : n = e;
  }
  return {
    type: n,
    component: e,
    customElement: o
  };
}, Yo = function(e, n, o) {
  var i = {}, t = o, a = Po(e), s = a.customElement, c = a.type;
  return e = a.component, n && typeof n == "object" && !Array.isArray(n) ? (i = Io(n), n.scopedSlots && (t = n.scopedSlots)) : (typeof n == "string" || Array.isArray(n)) && (o = n), (typeof o == "string" || Array.isArray(o)) && (t = typeof e != "string" || s ? function() {
    return o;
  } : o), k.h(c, i, t);
}, Fo = function(e) {
  return function(n) {
    var o, i = n.component, t = n.propsData, a = n.el, s = Object.assign(i, {
      provide: (o = {}, o[e.configKey] = e.configInstance, o)
    }), c = k.createVNode(s, t);
    return k.render(c, a), H({}, c.component);
  };
}, Lo = k.defineComponent, xr = !1, Ye = function(e) {
  var n = [];
  return Object.keys(e).forEach(function(o) {
    return e[o] && n.push(o);
  }), n.join(" ");
}, zo = function(e) {
  var n = [];
  return e.forEach(function(o) {
    typeof o == "string" ? n.push(o) : typeof o == "object" && n.push(Ye(o));
  }), n.join(" ");
}, Je = function(e) {
  if (!e)
    return "";
  if (typeof e == "string")
    return e;
  if (Array.isArray(e) && e.length > 0) {
    var n = [];
    return e.forEach(function(o) {
      o && (typeof o == "string" ? n.push(o) : Array.isArray(o) ? n.push(zo(o)) : typeof o == "object" && n.push(Ye(o)));
    }), n.join(" ");
  }
  return typeof e == "object" ? Ye(e) : "";
}, Jo = function(e) {
  var n = Je(e), o = Array.from(new Set(n.split(" "))).filter(function(i) {
    return i;
  });
  return Je(o);
}, Ro = function() {
  var e = k.ref(""), n = ["2xl", "xl", "lg", "md", "sm"], o = function(c) {
    return F || typeof matchMedia != "function" ? {
      matches: !1,
      media: c,
      addEventListener: function() {
      },
      removeEventListener: function() {
      }
    } : window.matchMedia(c);
  }, i = {
    "2xl": o("(min-width:1536px)"),
    xl: o("(min-width:1280px)"),
    lg: o("(min-width:1024px)"),
    md: o("(min-width:768px)"),
    sm: o("(min-width:640px)")
  }, t = function() {
    for (var c = 0; c < n.length; c++) {
      var d = n[c];
      if (i[d].matches) {
        e.value = d;
        return;
      }
    }
    e.value = "default";
  }, a = $n(0, function() {
    return t();
  });
  return t(), n.forEach(function(s) {
    return i[s].addEventListener("change", a);
  }), k.onBeforeUnmount(function() {
    n.forEach(function(s) {
      return i[s].removeEventListener("change", a);
    });
  }), {
    current: e
  };
}, Do = ["IconLoadingShadow", "IconNoData"], Sr = 0, kr = function(e, n) {
  {
    var o;
    if ((o = e.props) != null && o.id) {
      var i = "" + e.props.id + Sr;
      n[e.props.id] = i, e.props.id = i;
    }
  }
  Array.isArray(e == null ? void 0 : e.children) && e.children.forEach(function(t) {
    kr(t, n);
  });
}, Cr = function(e, n) {
  var o = ["fill", "mask", "filter"];
  o.forEach(function(i) {
    {
      var t, a;
      if ((t = e.props) != null && (a = t[i]) != null && a.includes("url(#")) {
        var s = e.props[i].replace("url(#", "").replace(")", ""), c = n[s];
        c && (e.props[i] = "url(#" + c + ")");
      }
    }
  }), Array.isArray(e == null ? void 0 : e.children) && e.children.forEach(function(i) {
    Cr(i, n);
  });
}, No = function(e) {
  if (e) {
    var n = {};
    kr(e, n), Cr(e, n), Sr++;
  }
};
uo(ie({}, k, {
  isVue2: xr
}));
fo(ie({}, k, {
  isVue2: xr
}));
var Ke = "Tiny", Ko = {
  tiny_mode: String,
  tiny_mode_root: Boolean,
  tiny_template: [Function, Object],
  tiny_renderless: Function,
  tiny_theme: String,
  tiny_chart_theme: Object
}, it = function(e, n) {
  var o = function(l) {
    return ~["pc", "mobile", "mobile-first"].indexOf(l);
  }, i = ot(n), t = typeof e.tiny_mode == "string" ? e.tiny_mode : null, a = k.inject("TinyMode", null), s;
  typeof i.tiny_mode == "string" ? s = i.tiny_mode : i.tiny_mode && (s = i.tiny_mode.value), o(t) || (t = null), o(a) || (a = null), o(s) || (s = null);
  var c = t || a || s || "pc";
  e.tiny_mode_root && k.provide("TinyMode", c);
  var d = k.getCurrentInstance();
  return Object.defineProperty(d, "_tiny_mode", {
    value: c
  }), c;
}, jo = function(e, n) {
  var o = function(f) {
    return ~["tiny", "saas"].indexOf(f);
  }, i = ot(n), t = typeof e.tiny_theme == "string" ? e.tiny_theme : null, a = k.inject("TinyTheme", null), s = i.tiny_theme && i.tiny_theme.value;
  o(t) || (t = null), o(a) || (a = null), o(s) || (s = null);
  var c = t || a || s || "tiny";
  return c;
}, Bo = function(e, n) {
  var o = ot(n), i = typeof e.tiny_chart_theme == "object" ? e.tiny_chart_theme : null, t = k.inject("TinyChartTheme", null), a = o.tiny_chart_theme && o.tiny_chart_theme.value, s = i || t || a || null;
  return s;
}, Qo = function(e) {
  var n = e.props, o = e.context, i = e.template, t = e.extend, a = t === void 0 ? {} : t, s = it(n, o), c = k.computed(function() {
    if (typeof n.tiny_template < "u") return n.tiny_template;
    var d = i(s, n);
    return typeof d == "function" ? go(d) : d;
  });
  return yr({
    view: c,
    props: n,
    context: o,
    extend: a
  });
}, Er = {
  configKey: Symbol("designConfigKey"),
  configInstance: null
}, Zo = Fo(Er), Uo = {
  designConfig: null,
  twMerge: function() {
    return "";
  }
}, Qe = function() {
  for (var e = arguments.length, n = new Array(e), o = 0; o < e; o++)
    n[o] = arguments[o];
  return Uo.twMerge(Je(n));
}, Xo = function(e) {
  var n, o, i, t = e.props, a = e.context, s = e.renderless, c = e.api, d = e.extendOptions, f = d === void 0 ? {} : d, l = e.mono, p = l === void 0 ? !1 : l, u = e.classes, T = u === void 0 ? {} : u, w = typeof t.tiny_renderless == "function" ? t.tiny_renderless : s, h = k.inject(Er.configKey, {});
  h = ((n = h) == null ? void 0 : n.value) || h || {};
  var S = (o = h) == null || (i = o.components) == null ? void 0 : i[yo().replace(Ke, "")], g = ie({
    $prefix: Ke,
    t: Pt
  }, _o(a, it(t, a)), {
    designConfig: S,
    globalDesignConfig: h,
    useBreakpoint: Ro,
    mergeClass: Qe
  });
  g.vm.theme = jo(t, a), g.vm.chartTheme = Bo(t, a);
  var v = w(t, k, g, f);
  typeof (S == null ? void 0 : S.renderless) == "function" && Object.assign(v, S.renderless(t, k, g, v));
  var E = {
    t: Pt,
    vm: g.vm,
    f: ho,
    a: $o,
    d: g.defineInstanceProperties,
    dp: g.defineParentInstanceProperties,
    gcls: function(b) {
      return mo(T, b);
    },
    m: Qe
  };
  return E.d({
    slots: {
      get: function() {
        return g.vm.$slots;
      },
      configurable: !0
    },
    scopedSlots: {
      get: function() {
        return g.vm.$scopedSlots;
      },
      configurable: !0
    }
  }), E.dp({
    slots: {
      get: function() {
        return g.parent.$slots;
      },
      configurable: !0
    },
    scopedSlots: {
      get: function() {
        return g.parent.$scopedSlots;
      },
      configurable: !0
    }
  }), qo(), Array.isArray(c) && (Array.isArray(S == null ? void 0 : S.api) && (c = c.concat(S.api)), c.forEach(function(x) {
    var b = v[x];
    typeof b < "u" && (E[x] = b, p || g.setParentAttribute({
      name: x,
      value: b
    }));
  })), E;
};
function ei(r) {
  var e = r.name, n = e === void 0 ? "Icon" : e, o = r.component;
  return function(i) {
    return vo(Lo({
      name: Ke + n,
      setup: function(a, s) {
        var c = s.attrs || {}, d = c.fill, f = c.width, l = c.height, p = c["custom-class"], u = c["first-color"], T = c["second-color"], w = Object.assign({}, a, i || null), h = it(w, s), S = h === "mobile-first", g = {
          "data-tag": S ? "tiny-svg" : null
        }, v = g, E = "tiny-svg";
        S && (E = Qe("h-4 w-4 inline-block", p || "", w.class || ""));
        var x = Object.assign({
          style: {
            fill: d,
            width: f,
            height: l,
            "--tiny-first-color": u || "",
            "--tiny-second-color": T || ""
          },
          class: E,
          isSvg: !0
        }, v);
        if (x.nativeOn = s.listeners, Do.includes(n)) {
          var b = o.render;
          o.render = function() {
            for (var C = b.bind(this), _ = arguments.length, O = new Array(_), M = 0; M < _; M++)
              O[M] = arguments[M];
            var L = C(O);
            return No(L), L;
          };
        }
        return yr({
          component: o,
          props: w,
          context: s,
          extend: x
        });
      }
    }));
  };
}
var $o = function(e, n, o) {
  var i = {}, t = function(c) {
    var d = n.some(function(f) {
      return new RegExp(f).test(c);
    });
    (o && d || !o && !d) && (i[c] = e[c]);
  };
  for (var a in e)
    t(a);
  return i;
}, je = {}, qo = function() {
  for (var e in je) {
    var n = je[e];
    typeof n.install == "function" && n.install(bo()), typeof n.init == "function" && n.init(wo());
  }
  je = {};
};
export {
  R as $,
  $n as G,
  Vo as P,
  Ho as Q,
  F as S,
  B as Z,
  ve as a,
  $t as b,
  Zo as c,
  Lo as d,
  Jo as e,
  Je as f,
  Xo as g,
  Yo as h,
  Ke as i,
  Go as j,
  Ko as k,
  Qo as l,
  Z as n,
  Wo as p,
  ei as s,
  ge as t
};
