import { onMounted as ee, nextTick as le, watch as C, getCurrentScope as re, onScopeDispose as se, isRef as ue, getCurrentInstance as B, toValue as g, hasInjectionContext as te, inject as ce, shallowRef as S, computed as I, reactive as q, unref as ae, watchEffect as de } from "vue";
function N(e) {
  return re() ? (se(e), !0) : !1;
}
const H = /* @__PURE__ */ new WeakMap(), fe = (...e) => {
  var t;
  const o = e[0], n = (t = B()) == null ? void 0 : t.proxy;
  if (n == null && !te())
    throw new Error("injectLocal must be called in setup");
  return n && H.has(n) && o in H.get(n) ? H.get(n)[o] : ce(...e);
}, ne = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const ve = (e) => e != null, he = Object.prototype.toString, me = (e) => he.call(e) === "[object Object]", x = () => {
}, pe = /* @__PURE__ */ we();
function we() {
  var e, t;
  return ne && ((e = window == null ? void 0 : window.navigator) == null ? void 0 : e.userAgent) && (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) || ((t = window == null ? void 0 : window.navigator) == null ? void 0 : t.maxTouchPoints) > 2 && /iPad|Macintosh/.test(window == null ? void 0 : window.navigator.userAgent));
}
function oe(e, t) {
  function o(...n) {
    return new Promise((m, a) => {
      Promise.resolve(e(() => t.apply(this, n), { fn: t, thisArg: this, args: n })).then(m).catch(a);
    });
  }
  return o;
}
function be(e, t = {}) {
  let o, n, m = x;
  const a = (l) => {
    clearTimeout(l), m(), m = x;
  };
  let d;
  return (l) => {
    const s = g(e), v = g(t.maxWait);
    return o && a(o), s <= 0 || v !== void 0 && v <= 0 ? (n && (a(n), n = null), Promise.resolve(l())) : new Promise((r, c) => {
      m = t.rejectOnCancel ? c : r, d = l, v && !n && (n = setTimeout(() => {
        o && a(o), n = null, r(d());
      }, v)), o = setTimeout(() => {
        n && a(n), n = null, r(l());
      }, s);
    });
  };
}
function ge(...e) {
  let t = 0, o, n = !0, m = x, a, d, i, l, s;
  !ue(e[0]) && typeof e[0] == "object" ? { delay: d, trailing: i = !0, leading: l = !0, rejectOnCancel: s = !1 } = e[0] : [d, i = !0, l = !0, s = !1] = e;
  const v = () => {
    o && (clearTimeout(o), o = void 0, m(), m = x);
  };
  return (c) => {
    const h = g(d), b = Date.now() - t, y = () => a = c();
    return v(), h <= 0 ? (t = Date.now(), y()) : (b > h && (l || !n) ? (t = Date.now(), y()) : i && (a = new Promise((u, f) => {
      m = s ? f : u, o = setTimeout(() => {
        t = Date.now(), n = !0, u(y()), v();
      }, Math.max(0, h - b));
    })), !l && !o && (o = setTimeout(() => n = !0, h)), n = !1, a);
  };
}
function J(e) {
  return e.endsWith("rem") ? Number.parseFloat(e) * 16 : Number.parseFloat(e);
}
function j(e) {
  return Array.isArray(e) ? e : [e];
}
function Se(e) {
  return B();
}
function ye(e, t = 200, o = {}) {
  return oe(
    be(t, o),
    e
  );
}
function Ee(e, t = 200, o = !1, n = !0, m = !1) {
  return oe(
    ge(t, o, n, m),
    e
  );
}
function V(e, t = !0, o) {
  Se() ? ee(e, o) : t ? e() : le(e);
}
function Te(e, t, o) {
  return C(
    e,
    t,
    {
      ...o,
      immediate: !0
    }
  );
}
const R = ne ? window : void 0;
function E(e) {
  var t;
  const o = g(e);
  return (t = o == null ? void 0 : o.$el) != null ? t : o;
}
function M(...e) {
  const t = [], o = () => {
    t.forEach((i) => i()), t.length = 0;
  }, n = (i, l, s, v) => (i.addEventListener(l, s, v), () => i.removeEventListener(l, s, v)), m = I(() => {
    const i = j(g(e[0])).filter((l) => l != null);
    return i.every((l) => typeof l != "string") ? i : void 0;
  }), a = Te(
    () => {
      var i, l;
      return [
        (l = (i = m.value) == null ? void 0 : i.map((s) => E(s))) != null ? l : [R].filter((s) => s != null),
        j(g(m.value ? e[1] : e[0])),
        j(ae(m.value ? e[2] : e[1])),
        // @ts-expect-error - TypeScript gets the correct types, but somehow still complains
        g(m.value ? e[3] : e[2])
      ];
    },
    ([i, l, s, v]) => {
      if (o(), !(i != null && i.length) || !(l != null && l.length) || !(s != null && s.length))
        return;
      const r = me(v) ? { ...v } : v;
      t.push(
        ...i.flatMap(
          (c) => l.flatMap(
            (h) => s.map((b) => n(c, h, b, r))
          )
        )
      );
    },
    { flush: "post" }
  ), d = () => {
    a(), o();
  };
  return N(o), d;
}
let K = !1;
function Pe(e, t, o = {}) {
  const { window: n = R, ignore: m = [], capture: a = !0, detectIframe: d = !1, controls: i = !1 } = o;
  if (!n)
    return i ? { stop: x, cancel: x, trigger: x } : x;
  if (pe && !K) {
    K = !0;
    const u = { passive: !0 };
    Array.from(n.document.body.children).forEach((f) => M(f, "click", x, u)), M(n.document.documentElement, "click", x, u);
  }
  let l = !0;
  const s = (u) => g(m).some((f) => {
    if (typeof f == "string")
      return Array.from(n.document.querySelectorAll(f)).some((p) => p === u.target || u.composedPath().includes(p));
    {
      const p = E(f);
      return p && (u.target === p || u.composedPath().includes(p));
    }
  });
  function v(u) {
    const f = g(u);
    return f && f.$.subTree.shapeFlag === 16;
  }
  function r(u, f) {
    const p = g(u), _ = p.$.subTree && p.$.subTree.children;
    return _ == null || !Array.isArray(_) ? !1 : _.some((D) => D.el === f.target || f.composedPath().includes(D.el));
  }
  const c = (u) => {
    const f = E(e);
    if (u.target != null && !(!(f instanceof Element) && v(e) && r(e, u)) && !(!f || f === u.target || u.composedPath().includes(f))) {
      if ("detail" in u && u.detail === 0 && (l = !s(u)), !l) {
        l = !0;
        return;
      }
      t(u);
    }
  };
  let h = !1;
  const b = [
    M(n, "click", (u) => {
      h || (h = !0, setTimeout(() => {
        h = !1;
      }, 0), c(u));
    }, { passive: !0, capture: a }),
    M(n, "pointerdown", (u) => {
      const f = E(e);
      l = !s(u) && !!(f && !u.composedPath().includes(f));
    }, { passive: !0 }),
    d && M(n, "blur", (u) => {
      setTimeout(() => {
        var f;
        const p = E(e);
        ((f = n.document.activeElement) == null ? void 0 : f.tagName) === "IFRAME" && !(p != null && p.contains(n.document.activeElement)) && t(u);
      }, 0);
    }, { passive: !0 })
  ].filter(Boolean), y = () => b.forEach((u) => u());
  return i ? {
    stop: y,
    cancel: () => {
      l = !1;
    },
    trigger: (u) => {
      l = !0, c(u), l = !1;
    }
  } : y;
}
function xe() {
  const e = S(!1), t = B();
  return t && ee(() => {
    e.value = !0;
  }, t), e;
}
function $(e) {
  const t = xe();
  return I(() => (t.value, !!e()));
}
function Me(e, t, o = {}) {
  const { window: n = R, ...m } = o;
  let a;
  const d = $(() => n && "MutationObserver" in n), i = () => {
    a && (a.disconnect(), a = void 0);
  }, l = I(() => {
    const c = g(e), h = j(c).map(E).filter(ve);
    return new Set(h);
  }), s = C(
    () => l.value,
    (c) => {
      i(), d.value && c.size && (a = new MutationObserver(t), c.forEach((h) => a.observe(h, m)));
    },
    { immediate: !0, flush: "post" }
  ), v = () => a == null ? void 0 : a.takeRecords(), r = () => {
    s(), i();
  };
  return N(r), {
    isSupported: d,
    stop: r,
    takeRecords: v
  };
}
const We = Symbol("vueuse-ssr-width");
function Oe() {
  const e = te() ? fe(We, null) : null;
  return typeof e == "number" ? e : void 0;
}
function Ie(e, t = {}) {
  const { window: o = R, ssrWidth: n = Oe() } = t, m = $(() => o && "matchMedia" in o && typeof o.matchMedia == "function"), a = S(typeof n == "number"), d = S(), i = S(!1), l = (s) => {
    i.value = s.matches;
  };
  return de(() => {
    if (a.value) {
      a.value = !m.value;
      const s = g(e).split(",");
      i.value = s.some((v) => {
        const r = v.includes("not all"), c = v.match(/\(\s*min-width:\s*(-?\d+(?:\.\d*)?[a-z]+\s*)\)/), h = v.match(/\(\s*max-width:\s*(-?\d+(?:\.\d*)?[a-z]+\s*)\)/);
        let b = !!(c || h);
        return c && b && (b = n >= J(c[1])), h && b && (b = n <= J(h[1])), r ? !b : b;
      });
      return;
    }
    m.value && (d.value = o.matchMedia(g(e)), i.value = d.value.matches);
  }), M(d, "change", l, { passive: !0 }), I(() => i.value);
}
function ie(e, t, o = {}) {
  const { window: n = R, ...m } = o;
  let a;
  const d = $(() => n && "ResizeObserver" in n), i = () => {
    a && (a.disconnect(), a = void 0);
  }, l = I(() => {
    const r = g(e);
    return Array.isArray(r) ? r.map((c) => E(c)) : [E(r)];
  }), s = C(
    l,
    (r) => {
      if (i(), d.value && n) {
        a = new ResizeObserver(t);
        for (const c of r)
          c && a.observe(c, m);
      }
    },
    { immediate: !0, flush: "post" }
  ), v = () => {
    i(), s();
  };
  return N(v), {
    isSupported: d,
    stop: v
  };
}
function Ae(e, t = {}) {
  const {
    reset: o = !0,
    windowResize: n = !0,
    windowScroll: m = !0,
    immediate: a = !0,
    updateTiming: d = "sync"
  } = t, i = S(0), l = S(0), s = S(0), v = S(0), r = S(0), c = S(0), h = S(0), b = S(0);
  function y() {
    const f = E(e);
    if (!f) {
      o && (i.value = 0, l.value = 0, s.value = 0, v.value = 0, r.value = 0, c.value = 0, h.value = 0, b.value = 0);
      return;
    }
    const p = f.getBoundingClientRect();
    i.value = p.height, l.value = p.bottom, s.value = p.left, v.value = p.right, r.value = p.top, c.value = p.width, h.value = p.x, b.value = p.y;
  }
  function u() {
    d === "sync" ? y() : d === "next-frame" && requestAnimationFrame(() => y());
  }
  return ie(e, u), C(() => E(e), (f) => !f && u()), Me(e, u, {
    attributeFilter: ["style", "class"]
  }), m && M("scroll", u, { capture: !0, passive: !0 }), n && M("resize", u, { passive: !0 }), V(() => {
    a && u();
  }), {
    height: i,
    bottom: l,
    left: s,
    right: v,
    top: r,
    width: c,
    x: h,
    y: b,
    update: u
  };
}
function _e(e, t = { width: 0, height: 0 }, o = {}) {
  const { window: n = R, box: m = "content-box" } = o, a = I(() => {
    var r, c;
    return (c = (r = E(e)) == null ? void 0 : r.namespaceURI) == null ? void 0 : c.includes("svg");
  }), d = S(t.width), i = S(t.height), { stop: l } = ie(
    e,
    ([r]) => {
      const c = m === "border-box" ? r.borderBoxSize : m === "content-box" ? r.contentBoxSize : r.devicePixelContentBoxSize;
      if (n && a.value) {
        const h = E(e);
        if (h) {
          const b = h.getBoundingClientRect();
          d.value = b.width, i.value = b.height;
        }
      } else if (c) {
        const h = j(c);
        d.value = h.reduce((b, { inlineSize: y }) => b + y, 0), i.value = h.reduce((b, { blockSize: y }) => b + y, 0);
      } else
        d.value = r.contentRect.width, i.value = r.contentRect.height;
    },
    o
  );
  V(() => {
    const r = E(e);
    r && (d.value = "offsetWidth" in r ? r.offsetWidth : t.width, i.value = "offsetHeight" in r ? r.offsetHeight : t.height);
  });
  const s = C(
    () => E(e),
    (r) => {
      d.value = r ? t.width : 0, i.value = r ? t.height : 0;
    }
  );
  function v() {
    l(), s();
  }
  return {
    width: d,
    height: i,
    stop: v
  };
}
const Z = 1;
function Ce(e, t = {}) {
  const {
    throttle: o = 0,
    idle: n = 200,
    onStop: m = x,
    onScroll: a = x,
    offset: d = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    },
    eventListenerOptions: i = {
      capture: !1,
      passive: !0
    },
    behavior: l = "auto",
    window: s = R,
    onError: v = (w) => {
      console.error(w);
    }
  } = t, r = S(0), c = S(0), h = I({
    get() {
      return r.value;
    },
    set(w) {
      y(w, void 0);
    }
  }), b = I({
    get() {
      return c.value;
    },
    set(w) {
      y(void 0, w);
    }
  });
  function y(w, P) {
    var T, k, L, F;
    if (!s)
      return;
    const W = g(e);
    if (!W)
      return;
    (L = W instanceof Document ? s.document.body : W) == null || L.scrollTo({
      top: (T = g(P)) != null ? T : b.value,
      left: (k = g(w)) != null ? k : h.value,
      behavior: g(l)
    });
    const O = ((F = W == null ? void 0 : W.document) == null ? void 0 : F.documentElement) || (W == null ? void 0 : W.documentElement) || W;
    h != null && (r.value = O.scrollLeft), b != null && (c.value = O.scrollTop);
  }
  const u = S(!1), f = q({
    left: !0,
    right: !1,
    top: !0,
    bottom: !1
  }), p = q({
    left: !1,
    right: !1,
    top: !1,
    bottom: !1
  }), _ = (w) => {
    u.value && (u.value = !1, p.left = !1, p.right = !1, p.top = !1, p.bottom = !1, m(w));
  }, D = ye(_, o + n), z = (w) => {
    var P;
    if (!s)
      return;
    const T = ((P = w == null ? void 0 : w.document) == null ? void 0 : P.documentElement) || (w == null ? void 0 : w.documentElement) || E(w), { display: k, flexDirection: L, direction: F } = getComputedStyle(T), W = F === "rtl" ? -1 : 1, O = T.scrollLeft;
    p.left = O < r.value, p.right = O > r.value;
    const Y = Math.abs(O * W) <= (d.left || 0), Q = Math.abs(O * W) + T.clientWidth >= T.scrollWidth - (d.right || 0) - Z;
    k === "flex" && L === "row-reverse" ? (f.left = Q, f.right = Y) : (f.left = Y, f.right = Q), r.value = O;
    let A = T.scrollTop;
    w === s.document && !A && (A = s.document.body.scrollTop), p.top = A < c.value, p.bottom = A > c.value;
    const X = Math.abs(A) <= (d.top || 0), U = Math.abs(A) + T.clientHeight >= T.scrollHeight - (d.bottom || 0) - Z;
    k === "flex" && L === "column-reverse" ? (f.top = U, f.bottom = X) : (f.top = X, f.bottom = U), c.value = A;
  }, G = (w) => {
    var P;
    if (!s)
      return;
    const T = (P = w.target.documentElement) != null ? P : w.target;
    z(T), u.value = !0, D(w), a(w);
  };
  return M(
    e,
    "scroll",
    o ? Ee(G, o, !0, !1) : G,
    i
  ), V(() => {
    try {
      const w = g(e);
      if (!w)
        return;
      z(w);
    } catch (w) {
      v(w);
    }
  }), M(
    e,
    "scrollend",
    _,
    i
  ), {
    x: h,
    y: b,
    isScrolling: u,
    arrivedState: f,
    directions: p,
    measure() {
      const w = g(e);
      s && w && z(w);
    }
  };
}
function ke(e = {}) {
  const {
    window: t = R,
    initialWidth: o = Number.POSITIVE_INFINITY,
    initialHeight: n = Number.POSITIVE_INFINITY,
    listenOrientation: m = !0,
    includeScrollbar: a = !0,
    type: d = "inner"
  } = e, i = S(o), l = S(n), s = () => {
    if (t)
      if (d === "outer")
        i.value = t.outerWidth, l.value = t.outerHeight;
      else if (d === "visual" && t.visualViewport) {
        const { width: r, height: c, scale: h } = t.visualViewport;
        i.value = Math.round(r * h), l.value = Math.round(c * h);
      } else a ? (i.value = t.innerWidth, l.value = t.innerHeight) : (i.value = t.document.documentElement.clientWidth, l.value = t.document.documentElement.clientHeight);
  };
  s(), V(s);
  const v = { passive: !0 };
  if (M("resize", s, v), t && d === "visual" && t.visualViewport && M(t.visualViewport, "resize", s, v), m) {
    const r = Ie("(orientation: portrait)");
    C(r, () => s());
  }
  return { width: i, height: l };
}
export {
  _e as a,
  ke as b,
  Ie as c,
  Ce as d,
  Pe as o,
  Ae as u
};
