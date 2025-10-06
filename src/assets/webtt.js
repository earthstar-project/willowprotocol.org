var ae = Object.defineProperty;
var fe = (t, e) => {
  for (var n in e) ae(t, n, { get: e[n], enumerable: !0 });
};
var st = {};
fe(st, {
  arrow: () => Ne,
  autoPlacement: () => ke,
  autoUpdate: () => Ie,
  computePosition: () => Ve,
  detectOverflow: () => it,
  flip: () => Be,
  getOverflowAncestors: () => rt,
  hide: () => He,
  inline: () => We,
  limitShift: () => je,
  offset: () => Yt,
  platform: () => ce,
  shift: () => Fe,
  size: () => $e,
});
var Et = ["top", "right", "bottom", "left"],
  Pt = ["start", "end"],
  Lt = Et.reduce((t, e) => t.concat(e, e + "-" + Pt[0], e + "-" + Pt[1]), []),
  j = Math.min,
  P = Math.max,
  gt = Math.round,
  pt = Math.floor,
  J = (t) => ({ x: t, y: t }),
  ue = { left: "right", right: "left", bottom: "top", top: "bottom" },
  me = { start: "end", end: "start" };
function vt(t, e, n) {
  return P(t, j(e, n));
}
function Y(t, e) {
  return typeof t == "function" ? t(e) : t;
}
function H(t) {
  return t.split("-")[0];
}
function X(t) {
  return t.split("-")[1];
}
function xt(t) {
  return t === "x" ? "y" : "x";
}
function bt(t) {
  return t === "y" ? "height" : "width";
}
function ot(t) {
  return ["top", "bottom"].includes(H(t)) ? "y" : "x";
}
function Rt(t) {
  return xt(ot(t));
}
function St(t, e, n) {
  n === void 0 && (n = !1);
  let o = X(t),
    i = Rt(t),
    r = bt(i),
    s = i === "x"
      ? o === (n ? "end" : "start") ? "right" : "left"
      : o === "start"
      ? "bottom"
      : "top";
  return e.reference[r] > e.floating[r] && (s = ht(s)), [s, ht(s)];
}
function Dt(t) {
  let e = ht(t);
  return [dt(t), e, dt(e)];
}
function dt(t) {
  return t.replace(/start|end/g, (e) => me[e]);
}
function de(t, e, n) {
  let o = ["left", "right"],
    i = ["right", "left"],
    r = ["top", "bottom"],
    s = ["bottom", "top"];
  switch (t) {
    case "top":
    case "bottom":
      return n ? e ? i : o : e ? o : i;
    case "left":
    case "right":
      return e ? r : s;
    default:
      return [];
  }
}
function It(t, e, n, o) {
  let i = X(t), r = de(H(t), n === "start", o);
  return i && (r = r.map((s) => s + "-" + i), e && (r = r.concat(r.map(dt)))),
    r;
}
function ht(t) {
  return t.replace(/left|right|bottom|top/g, (e) => ue[e]);
}
function he(t) {
  return { top: 0, right: 0, bottom: 0, left: 0, ...t };
}
function At(t) {
  return typeof t != "number"
    ? he(t)
    : { top: t, right: t, bottom: t, left: t };
}
function Q(t) {
  return {
    ...t,
    top: t.y,
    left: t.x,
    right: t.x + t.width,
    bottom: t.y + t.height,
  };
}
function kt(t, e, n) {
  let { reference: o, floating: i } = t,
    r = ot(e),
    s = Rt(e),
    a = bt(s),
    l = H(e),
    u = r === "y",
    h = o.x + o.width / 2 - i.width / 2,
    m = o.y + o.height / 2 - i.height / 2,
    g = o[a] / 2 - i[a] / 2,
    d;
  switch (l) {
    case "top":
      d = { x: h, y: o.y - i.height };
      break;
    case "bottom":
      d = { x: h, y: o.y + o.height };
      break;
    case "right":
      d = { x: o.x + o.width, y: m };
      break;
    case "left":
      d = { x: o.x - i.width, y: m };
      break;
    default:
      d = { x: o.x, y: o.y };
  }
  switch (X(e)) {
    case "start":
      d[s] -= g * (n && u ? -1 : 1);
      break;
    case "end":
      d[s] += g * (n && u ? -1 : 1);
      break;
  }
  return d;
}
var $t = async (t, e, n) => {
  let {
      placement: o = "bottom",
      strategy: i = "absolute",
      middleware: r = [],
      platform: s,
    } = n,
    a = r.filter(Boolean),
    l = await (s.isRTL == null ? void 0 : s.isRTL(e)),
    u = await s.getElementRects({ reference: t, floating: e, strategy: i }),
    { x: h, y: m } = kt(u, o, l),
    g = o,
    d = {},
    w = 0;
  for (let p = 0; p < a.length; p++) {
    let { name: c, fn: f } = a[p],
      { x: y, y: x, data: b, reset: R } = await f({
        x: h,
        y: m,
        initialPlacement: o,
        placement: g,
        strategy: i,
        middlewareData: d,
        rects: u,
        platform: s,
        elements: { reference: t, floating: e },
      });
    h = y ?? h,
      m = x ?? m,
      d = { ...d, [c]: { ...d[c], ...b } },
      R && w <= 50 && (w++,
        typeof R == "object" &&
        (R.placement && (g = R.placement),
          R.rects && (u = R.rects === !0
            ? await s.getElementRects({
              reference: t,
              floating: e,
              strategy: i,
            })
            : R.rects),
          { x: h, y: m } = kt(u, g, l)),
        p = -1);
  }
  return { x: h, y: m, placement: g, strategy: i, middlewareData: d };
};
async function it(t, e) {
  var n;
  e === void 0 && (e = {});
  let { x: o, y: i, platform: r, rects: s, elements: a, strategy: l } = t,
    {
      boundary: u = "clippingAncestors",
      rootBoundary: h = "viewport",
      elementContext: m = "floating",
      altBoundary: g = !1,
      padding: d = 0,
    } = Y(e, t),
    w = At(d),
    c = a[g ? m === "floating" ? "reference" : "floating" : m],
    f = Q(
      await r.getClippingRect({
        element:
          (n = await (r.isElement == null ? void 0 : r.isElement(c))) == null ||
            n
            ? c
            : c.contextElement ||
              await (r.getDocumentElement == null
                ? void 0
                : r.getDocumentElement(a.floating)),
        boundary: u,
        rootBoundary: h,
        strategy: l,
      }),
    ),
    y = m === "floating" ? { ...s.floating, x: o, y: i } : s.reference,
    x =
      await (r.getOffsetParent == null
        ? void 0
        : r.getOffsetParent(a.floating)),
    b = await (r.isElement == null ? void 0 : r.isElement(x))
      ? await (r.getScale == null ? void 0 : r.getScale(x)) || { x: 1, y: 1 }
      : { x: 1, y: 1 },
    R = Q(
      r.convertOffsetParentRelativeRectToViewportRelativeRect
        ? await r.convertOffsetParentRelativeRectToViewportRelativeRect({
          elements: a,
          rect: y,
          offsetParent: x,
          strategy: l,
        })
        : y,
    );
  return {
    top: (f.top - R.top + w.top) / b.y,
    bottom: (R.bottom - f.bottom + w.bottom) / b.y,
    left: (f.left - R.left + w.left) / b.x,
    right: (R.right - f.right + w.right) / b.x,
  };
}
var Ht = (t) => ({
  name: "arrow",
  options: t,
  async fn(e) {
    let {
        x: n,
        y: o,
        placement: i,
        rects: r,
        platform: s,
        elements: a,
        middlewareData: l,
      } = e,
      { element: u, padding: h = 0 } = Y(t, e) || {};
    if (u == null) return {};
    let m = At(h),
      g = { x: n, y: o },
      d = Rt(i),
      w = bt(d),
      p = await s.getDimensions(u),
      c = d === "y",
      f = c ? "top" : "left",
      y = c ? "bottom" : "right",
      x = c ? "clientHeight" : "clientWidth",
      b = r.reference[w] + r.reference[d] - g[d] - r.floating[w],
      R = g[d] - r.reference[d],
      v = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(u)),
      C = v ? v[x] : 0;
    (!C || !await (s.isElement == null ? void 0 : s.isElement(v))) &&
      (C = a.floating[x] || r.floating[w]);
    let I = b / 2 - R / 2,
      B = C / 2 - p[w] / 2 - 1,
      T = j(m[f], B),
      M = j(m[y], B),
      L = T,
      D = C - p[w] - M,
      E = C / 2 - p[w] / 2 + I,
      k = vt(L, E, D),
      F = !l.arrow && X(i) != null && E !== k &&
        r.reference[w] / 2 - (E < L ? T : M) - p[w] / 2 < 0,
      W = F ? E < L ? E - L : E - D : 0;
    return {
      [d]: g[d] + W,
      data: { [d]: k, centerOffset: E - k - W, ...F && { alignmentOffset: W } },
      reset: F,
    };
  },
});
function ge(t, e, n) {
  return (t
    ? [...n.filter((i) => X(i) === t), ...n.filter((i) => X(i) !== t)]
    : n.filter((i) => H(i) === i)).filter((i) =>
      t ? X(i) === t || (e ? dt(i) !== i : !1) : !0
    );
}
var Nt = function (t) {
    return t === void 0 && (t = {}), {
      name: "autoPlacement",
      options: t,
      async fn(e) {
        var n, o, i;
        let {
            rects: r,
            middlewareData: s,
            placement: a,
            platform: l,
            elements: u,
          } = e,
          {
            crossAxis: h = !1,
            alignment: m,
            allowedPlacements: g = Lt,
            autoAlignment: d = !0,
            ...w
          } = Y(t, e),
          p = m !== void 0 || g === Lt ? ge(m || null, d, g) : g,
          c = await it(e, w),
          f = ((n = s.autoPlacement) == null ? void 0 : n.index) || 0,
          y = p[f];
        if (y == null) return {};
        let x = St(
          y,
          r,
          await (l.isRTL == null ? void 0 : l.isRTL(u.floating)),
        );
        if (a !== y) return { reset: { placement: p[0] } };
        let b = [c[H(y)], c[x[0]], c[x[1]]],
          R = [
            ...((o = s.autoPlacement) == null ? void 0 : o.overflows) || [],
            { placement: y, overflows: b },
          ],
          v = p[f + 1];
        if (v) {
          return {
            data: { index: f + 1, overflows: R },
            reset: { placement: v },
          };
        }
        let C = R.map((T) => {
            let M = X(T.placement);
            return [
              T.placement,
              M && h
                ? T.overflows.slice(0, 2).reduce((L, D) => L + D, 0)
                : T.overflows[0],
              T.overflows,
            ];
          }).sort((T, M) => T[1] - M[1]),
          B = ((i = C.filter((T) =>
              T[2].slice(0, X(T[0]) ? 2 : 3).every((M) =>
                M <= 0
              )
            )[0]) == null
            ? void 0
            : i[0]) || C[0][0];
        return B !== a
          ? { data: { index: f + 1, overflows: R }, reset: { placement: B } }
          : {};
      },
    };
  },
  Wt = function (t) {
    return t === void 0 && (t = {}), {
      name: "flip",
      options: t,
      async fn(e) {
        var n, o;
        let {
            placement: i,
            middlewareData: r,
            rects: s,
            initialPlacement: a,
            platform: l,
            elements: u,
          } = e,
          {
            mainAxis: h = !0,
            crossAxis: m = !0,
            fallbackPlacements: g,
            fallbackStrategy: d = "bestFit",
            fallbackAxisSideDirection: w = "none",
            flipAlignment: p = !0,
            ...c
          } = Y(t, e);
        if ((n = r.arrow) != null && n.alignmentOffset) return {};
        let f = H(i),
          y = H(a) === a,
          x = await (l.isRTL == null ? void 0 : l.isRTL(u.floating)),
          b = g || (y || !p ? [ht(a)] : Dt(a));
        !g && w !== "none" && b.push(...It(a, p, w, x));
        let R = [a, ...b],
          v = await it(e, c),
          C = [],
          I = ((o = r.flip) == null ? void 0 : o.overflows) || [];
        if (h && C.push(v[f]), m) {
          let L = St(i, s, x);
          C.push(v[L[0]], v[L[1]]);
        }
        if (
          I = [...I, { placement: i, overflows: C }], !C.every((L) => L <= 0)
        ) {
          var B, T;
          let L = (((B = r.flip) == null ? void 0 : B.index) || 0) + 1,
            D = R[L];
          if (D) {
            return {
              data: { index: L, overflows: I },
              reset: { placement: D },
            };
          }
          let E = (T = I.filter((k) =>
              k.overflows[0] <= 0
            ).sort((k, F) =>
              k.overflows[1] - F.overflows[1]
            )[0]) == null
            ? void 0
            : T.placement;
          if (!E) {
            switch (d) {
              case "bestFit": {
                var M;
                let k = (M = I.map((F) => [
                    F.placement,
                    F.overflows.filter((W) => W > 0).reduce(
                      (W, mt) => W + mt,
                      0,
                    ),
                  ]
                  ).sort((F, W) => F[1] - W[1])[0]) == null
                  ? void 0
                  : M[0];
                k && (E = k);
                break;
              }
              case "initialPlacement":
                E = a;
                break;
            }
          }
          if (i !== E) return { reset: { placement: E } };
        }
        return {};
      },
    };
  };
function Ft(t, e) {
  return {
    top: t.top - e.height,
    right: t.right - e.width,
    bottom: t.bottom - e.height,
    left: t.left - e.width,
  };
}
function Bt(t) {
  return Et.some((e) => t[e] >= 0);
}
var jt = function (t) {
  return t === void 0 && (t = {}), {
    name: "hide",
    options: t,
    async fn(e) {
      let { rects: n } = e,
        { strategy: o = "referenceHidden", ...i } = Y(t, e);
      switch (o) {
        case "referenceHidden": {
          let r = await it(e, { ...i, elementContext: "reference" }),
            s = Ft(r, n.reference);
          return {
            data: { referenceHiddenOffsets: s, referenceHidden: Bt(s) },
          };
        }
        case "escaped": {
          let r = await it(e, { ...i, altBoundary: !0 }),
            s = Ft(r, n.floating);
          return { data: { escapedOffsets: s, escaped: Bt(s) } };
        }
        default:
          return {};
      }
    },
  };
};
function Vt(t) {
  let e = j(...t.map((r) => r.left)),
    n = j(...t.map((r) => r.top)),
    o = P(...t.map((r) => r.right)),
    i = P(...t.map((r) => r.bottom));
  return { x: e, y: n, width: o - e, height: i - n };
}
function pe(t) {
  let e = t.slice().sort((i, r) => i.y - r.y), n = [], o = null;
  for (let i = 0; i < e.length; i++) {
    let r = e[i];
    !o || r.y - o.y > o.height / 2 ? n.push([r]) : n[n.length - 1].push(r),
      o = r;
  }
  return n.map((i) => Q(Vt(i)));
}
var zt = function (t) {
  return t === void 0 && (t = {}), {
    name: "inline",
    options: t,
    async fn(e) {
      let { placement: n, elements: o, rects: i, platform: r, strategy: s } = e,
        { padding: a = 2, x: l, y: u } = Y(t, e),
        h = Array.from(
          await (r.getClientRects == null
            ? void 0
            : r.getClientRects(o.reference)) || [],
        ),
        m = pe(h),
        g = Q(Vt(h)),
        d = At(a);
      function w() {
        if (
          m.length === 2 && m[0].left > m[1].right && l != null && u != null
        ) {
          return m.find((c) =>
            l > c.left - d.left && l < c.right + d.right &&
            u > c.top - d.top && u < c.bottom + d.bottom
          ) || g;
        }
        if (m.length >= 2) {
          if (ot(n) === "y") {
            let T = m[0],
              M = m[m.length - 1],
              L = H(n) === "top",
              D = T.top,
              E = M.bottom,
              k = L ? T.left : M.left,
              F = L ? T.right : M.right,
              W = F - k,
              mt = E - D;
            return {
              top: D,
              bottom: E,
              left: k,
              right: F,
              width: W,
              height: mt,
              x: k,
              y: D,
            };
          }
          let c = H(n) === "left",
            f = P(...m.map((T) => T.right)),
            y = j(...m.map((T) => T.left)),
            x = m.filter((T) => c ? T.left === y : T.right === f),
            b = x[0].top,
            R = x[x.length - 1].bottom,
            v = y,
            C = f,
            I = C - v,
            B = R - b;
          return {
            top: b,
            bottom: R,
            left: v,
            right: C,
            width: I,
            height: B,
            x: v,
            y: b,
          };
        }
        return g;
      }
      let p = await r.getElementRects({
        reference: { getBoundingClientRect: w },
        floating: o.floating,
        strategy: s,
      });
      return i.reference.x !== p.reference.x ||
          i.reference.y !== p.reference.y ||
          i.reference.width !== p.reference.width ||
          i.reference.height !== p.reference.height
        ? { reset: { rects: p } }
        : {};
    },
  };
};
async function we(t, e) {
  let { placement: n, platform: o, elements: i } = t,
    r = await (o.isRTL == null ? void 0 : o.isRTL(i.floating)),
    s = H(n),
    a = X(n),
    l = ot(n) === "y",
    u = ["left", "top"].includes(s) ? -1 : 1,
    h = r && l ? -1 : 1,
    m = Y(e, t),
    { mainAxis: g, crossAxis: d, alignmentAxis: w } = typeof m == "number"
      ? { mainAxis: m, crossAxis: 0, alignmentAxis: null }
      : { mainAxis: 0, crossAxis: 0, alignmentAxis: null, ...m };
  return a && typeof w == "number" && (d = a === "end" ? w * -1 : w),
    l ? { x: d * h, y: g * u } : { x: g * u, y: d * h };
}
var Yt = function (t) {
    return t === void 0 && (t = 0), {
      name: "offset",
      options: t,
      async fn(e) {
        var n, o;
        let { x: i, y: r, placement: s, middlewareData: a } = e,
          l = await we(e, t);
        return s === ((n = a.offset) == null ? void 0 : n.placement) &&
            (o = a.arrow) != null && o.alignmentOffset
          ? {}
          : { x: i + l.x, y: r + l.y, data: { ...l, placement: s } };
      },
    };
  },
  Xt = function (t) {
    return t === void 0 && (t = {}), {
      name: "shift",
      options: t,
      async fn(e) {
        let { x: n, y: o, placement: i } = e,
          {
            mainAxis: r = !0,
            crossAxis: s = !1,
            limiter: a = {
              fn: (c) => {
                let { x: f, y } = c;
                return { x: f, y };
              },
            },
            ...l
          } = Y(t, e),
          u = { x: n, y: o },
          h = await it(e, l),
          m = ot(H(i)),
          g = xt(m),
          d = u[g],
          w = u[m];
        if (r) {
          let c = g === "y" ? "top" : "left",
            f = g === "y" ? "bottom" : "right",
            y = d + h[c],
            x = d - h[f];
          d = vt(y, d, x);
        }
        if (s) {
          let c = m === "y" ? "top" : "left",
            f = m === "y" ? "bottom" : "right",
            y = w + h[c],
            x = w - h[f];
          w = vt(y, w, x);
        }
        let p = a.fn({ ...e, [g]: d, [m]: w });
        return { ...p, data: { x: p.x - n, y: p.y - o } };
      },
    };
  },
  _t = function (t) {
    return t === void 0 && (t = {}), {
      options: t,
      fn(e) {
        let { x: n, y: o, placement: i, rects: r, middlewareData: s } = e,
          { offset: a = 0, mainAxis: l = !0, crossAxis: u = !0 } = Y(t, e),
          h = { x: n, y: o },
          m = ot(i),
          g = xt(m),
          d = h[g],
          w = h[m],
          p = Y(a, e),
          c = typeof p == "number"
            ? { mainAxis: p, crossAxis: 0 }
            : { mainAxis: 0, crossAxis: 0, ...p };
        if (l) {
          let x = g === "y" ? "height" : "width",
            b = r.reference[g] - r.floating[x] + c.mainAxis,
            R = r.reference[g] + r.reference[x] - c.mainAxis;
          d < b ? d = b : d > R && (d = R);
        }
        if (u) {
          var f, y;
          let x = g === "y" ? "width" : "height",
            b = ["top", "left"].includes(H(i)),
            R = r.reference[m] - r.floating[x] +
              (b && ((f = s.offset) == null ? void 0 : f[m]) || 0) +
              (b ? 0 : c.crossAxis),
            v = r.reference[m] + r.reference[x] +
              (b ? 0 : ((y = s.offset) == null ? void 0 : y[m]) || 0) -
              (b ? c.crossAxis : 0);
          w < R ? w = R : w > v && (w = v);
        }
        return { [g]: d, [m]: w };
      },
    };
  },
  Ut = function (t) {
    return t === void 0 && (t = {}), {
      name: "size",
      options: t,
      async fn(e) {
        let { placement: n, rects: o, platform: i, elements: r } = e,
          { apply: s = () => {}, ...a } = Y(t, e),
          l = await it(e, a),
          u = H(n),
          h = X(n),
          m = ot(n) === "y",
          { width: g, height: d } = o.floating,
          w,
          p;
        u === "top" || u === "bottom"
          ? (w = u,
            p = h === (await (i.isRTL == null ? void 0 : i.isRTL(r.floating))
                ? "start"
                : "end")
              ? "left"
              : "right")
          : (p = u, w = h === "end" ? "top" : "bottom");
        let c = d - l[w],
          f = g - l[p],
          y = !e.middlewareData.shift,
          x = c,
          b = f;
        if (m) {
          let v = g - l.left - l.right;
          b = h || y ? j(f, v) : v;
        } else {
          let v = d - l.top - l.bottom;
          x = h || y ? j(c, v) : v;
        }
        if (y && !h) {
          let v = P(l.left, 0),
            C = P(l.right, 0),
            I = P(l.top, 0),
            B = P(l.bottom, 0);
          m
            ? b = g - 2 * (v !== 0 || C !== 0 ? v + C : P(l.left, l.right))
            : x = d - 2 * (I !== 0 || B !== 0 ? I + B : P(l.top, l.bottom));
        }
        await s({ ...e, availableWidth: b, availableHeight: x });
        let R = await i.getDimensions(r.floating);
        return g !== R.width || d !== R.height ? { reset: { rects: !0 } } : {};
      },
    };
  };
function Z(t) {
  return Kt(t) ? (t.nodeName || "").toLowerCase() : "#document";
}
function N(t) {
  var e;
  return (t == null || (e = t.ownerDocument) == null
    ? void 0
    : e.defaultView) || window;
}
function q(t) {
  var e;
  return (e = (Kt(t) ? t.ownerDocument : t.document) || window.document) == null
    ? void 0
    : e.documentElement;
}
function Kt(t) {
  return t instanceof Node || t instanceof N(t).Node;
}
function K(t) {
  return t instanceof Element || t instanceof N(t).Element;
}
function U(t) {
  return t instanceof HTMLElement || t instanceof N(t).HTMLElement;
}
function qt(t) {
  return typeof ShadowRoot > "u"
    ? !1
    : t instanceof ShadowRoot || t instanceof N(t).ShadowRoot;
}
function at(t) {
  let { overflow: e, overflowX: n, overflowY: o, display: i } = V(t);
  return /auto|scroll|overlay|hidden|clip/.test(e + o + n) &&
    !["inline", "contents"].includes(i);
}
function Gt(t) {
  return ["table", "td", "th"].includes(Z(t));
}
function Ot(t) {
  let e = Tt(), n = V(t);
  return n.transform !== "none" || n.perspective !== "none" ||
    (n.containerType ? n.containerType !== "normal" : !1) ||
    !e && (n.backdropFilter ? n.backdropFilter !== "none" : !1) ||
    !e && (n.filter ? n.filter !== "none" : !1) ||
    ["transform", "perspective", "filter"].some((o) =>
      (n.willChange || "").includes(o)
    ) ||
    ["paint", "layout", "strict", "content"].some((o) =>
      (n.contain || "").includes(o)
    );
}
function Jt(t) {
  let e = ct(t);
  for (; U(e) && !wt(e);) {
    if (Ot(e)) return e;
    e = ct(e);
  }
  return null;
}
function Tt() {
  return typeof CSS > "u" || !CSS.supports
    ? !1
    : CSS.supports("-webkit-backdrop-filter", "none");
}
function wt(t) {
  return ["html", "body", "#document"].includes(Z(t));
}
function V(t) {
  return N(t).getComputedStyle(t);
}
function yt(t) {
  return K(t)
    ? { scrollLeft: t.scrollLeft, scrollTop: t.scrollTop }
    : { scrollLeft: t.pageXOffset, scrollTop: t.pageYOffset };
}
function ct(t) {
  if (Z(t) === "html") return t;
  let e = t.assignedSlot || t.parentNode || qt(t) && t.host || q(t);
  return qt(e) ? e.host : e;
}
function Qt(t) {
  let e = ct(t);
  return wt(e)
    ? t.ownerDocument ? t.ownerDocument.body : t.body
    : U(e) && at(e)
    ? e
    : Qt(e);
}
function rt(t, e, n) {
  var o;
  e === void 0 && (e = []), n === void 0 && (n = !0);
  let i = Qt(t),
    r = i === ((o = t.ownerDocument) == null ? void 0 : o.body),
    s = N(i);
  return r
    ? e.concat(
      s,
      s.visualViewport || [],
      at(i) ? i : [],
      s.frameElement && n ? rt(s.frameElement) : [],
    )
    : e.concat(i, rt(i, [], n));
}
function ee(t) {
  let e = V(t),
    n = parseFloat(e.width) || 0,
    o = parseFloat(e.height) || 0,
    i = U(t),
    r = i ? t.offsetWidth : n,
    s = i ? t.offsetHeight : o,
    a = gt(n) !== r || gt(o) !== s;
  return a && (n = r, o = s), { width: n, height: o, $: a };
}
function Mt(t) {
  return K(t) ? t : t.contextElement;
}
function ft(t) {
  let e = Mt(t);
  if (!U(e)) return J(1);
  let n = e.getBoundingClientRect(),
    { width: o, height: i, $: r } = ee(e),
    s = (r ? gt(n.width) : n.width) / o,
    a = (r ? gt(n.height) : n.height) / i;
  return (!s || !Number.isFinite(s)) && (s = 1),
    (!a || !Number.isFinite(a)) && (a = 1),
    { x: s, y: a };
}
var ye = J(0);
function ne(t) {
  let e = N(t);
  return !Tt() || !e.visualViewport
    ? ye
    : { x: e.visualViewport.offsetLeft, y: e.visualViewport.offsetTop };
}
function ve(t, e, n) {
  return e === void 0 && (e = !1), !n || e && n !== N(t) ? !1 : e;
}
function lt(t, e, n, o) {
  e === void 0 && (e = !1), n === void 0 && (n = !1);
  let i = t.getBoundingClientRect(), r = Mt(t), s = J(1);
  e && (o ? K(o) && (s = ft(o)) : s = ft(t));
  let a = ve(r, n, o) ? ne(r) : J(0),
    l = (i.left + a.x) / s.x,
    u = (i.top + a.y) / s.y,
    h = i.width / s.x,
    m = i.height / s.y;
  if (r) {
    let g = N(r), d = o && K(o) ? N(o) : o, w = g, p = w.frameElement;
    for (; p && o && d !== w;) {
      let c = ft(p),
        f = p.getBoundingClientRect(),
        y = V(p),
        x = f.left + (p.clientLeft + parseFloat(y.paddingLeft)) * c.x,
        b = f.top + (p.clientTop + parseFloat(y.paddingTop)) * c.y;
      l *= c.x,
        u *= c.y,
        h *= c.x,
        m *= c.y,
        l += x,
        u += b,
        w = N(p),
        p = w.frameElement;
    }
  }
  return Q({ width: h, height: m, x: l, y: u });
}
var xe = [":popover-open", ":modal"];
function oe(t) {
  return xe.some((e) => {
    try {
      return t.matches(e);
    } catch {
      return !1;
    }
  });
}
function be(t) {
  let { elements: e, rect: n, offsetParent: o, strategy: i } = t,
    r = i === "fixed",
    s = q(o),
    a = e ? oe(e.floating) : !1;
  if (o === s || a && r) return n;
  let l = { scrollLeft: 0, scrollTop: 0 }, u = J(1), h = J(0), m = U(o);
  if ((m || !m && !r) && ((Z(o) !== "body" || at(s)) && (l = yt(o)), U(o))) {
    let g = lt(o);
    u = ft(o), h.x = g.x + o.clientLeft, h.y = g.y + o.clientTop;
  }
  return {
    width: n.width * u.x,
    height: n.height * u.y,
    x: n.x * u.x - l.scrollLeft * u.x + h.x,
    y: n.y * u.y - l.scrollTop * u.y + h.y,
  };
}
function Re(t) {
  return Array.from(t.getClientRects());
}
function ie(t) {
  return lt(q(t)).left + yt(t).scrollLeft;
}
function Ae(t) {
  let e = q(t),
    n = yt(t),
    o = t.ownerDocument.body,
    i = P(e.scrollWidth, e.clientWidth, o.scrollWidth, o.clientWidth),
    r = P(e.scrollHeight, e.clientHeight, o.scrollHeight, o.clientHeight),
    s = -n.scrollLeft + ie(t),
    a = -n.scrollTop;
  return V(o).direction === "rtl" && (s += P(e.clientWidth, o.clientWidth) - i),
    { width: i, height: r, x: s, y: a };
}
function Oe(t, e) {
  let n = N(t),
    o = q(t),
    i = n.visualViewport,
    r = o.clientWidth,
    s = o.clientHeight,
    a = 0,
    l = 0;
  if (i) {
    r = i.width, s = i.height;
    let u = Tt();
    (!u || u && e === "fixed") && (a = i.offsetLeft, l = i.offsetTop);
  }
  return { width: r, height: s, x: a, y: l };
}
function Te(t, e) {
  let n = lt(t, !0, e === "fixed"),
    o = n.top + t.clientTop,
    i = n.left + t.clientLeft,
    r = U(t) ? ft(t) : J(1),
    s = t.clientWidth * r.x,
    a = t.clientHeight * r.y,
    l = i * r.x,
    u = o * r.y;
  return { width: s, height: a, x: l, y: u };
}
function Zt(t, e, n) {
  let o;
  if (e === "viewport") o = Oe(t, n);
  else if (e === "document") o = Ae(q(t));
  else if (K(e)) o = Te(e, n);
  else {
    let i = ne(t);
    o = { ...e, x: e.x - i.x, y: e.y - i.y };
  }
  return Q(o);
}
function re(t, e) {
  let n = ct(t);
  return n === e || !K(n) || wt(n) ? !1 : V(n).position === "fixed" || re(n, e);
}
function Ce(t, e) {
  let n = e.get(t);
  if (n) return n;
  let o = rt(t, [], !1).filter((a) => K(a) && Z(a) !== "body"),
    i = null,
    r = V(t).position === "fixed",
    s = r ? ct(t) : t;
  for (; K(s) && !wt(s);) {
    let a = V(s), l = Ot(s);
    !l && a.position === "fixed" && (i = null),
      (r ? !l && !i : !l && a.position === "static" && !!i &&
            ["absolute", "fixed"].includes(i.position) ||
          at(s) && !l && re(t, s))
        ? o = o.filter((h) => h !== s)
        : i = a,
      s = ct(s);
  }
  return e.set(t, o), o;
}
function Ee(t) {
  let { element: e, boundary: n, rootBoundary: o, strategy: i } = t,
    s = [...n === "clippingAncestors" ? Ce(e, this._c) : [].concat(n), o],
    a = s[0],
    l = s.reduce((u, h) => {
      let m = Zt(e, h, i);
      return u.top = P(m.top, u.top),
        u.right = j(m.right, u.right),
        u.bottom = j(m.bottom, u.bottom),
        u.left = P(m.left, u.left),
        u;
    }, Zt(e, a, i));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top,
  };
}
function Le(t) {
  let { width: e, height: n } = ee(t);
  return { width: e, height: n };
}
function Se(t, e, n) {
  let o = U(e),
    i = q(e),
    r = n === "fixed",
    s = lt(t, !0, r, e),
    a = { scrollLeft: 0, scrollTop: 0 },
    l = J(0);
  if (o || !o && !r) {
    if ((Z(e) !== "body" || at(i)) && (a = yt(e)), o) {
      let m = lt(e, !0, r, e);
      l.x = m.x + e.clientLeft, l.y = m.y + e.clientTop;
    } else i && (l.x = ie(i));
  }
  let u = s.left + a.scrollLeft - l.x, h = s.top + a.scrollTop - l.y;
  return { x: u, y: h, width: s.width, height: s.height };
}
function te(t, e) {
  return !U(t) || V(t).position === "fixed" ? null : e ? e(t) : t.offsetParent;
}
function se(t, e) {
  let n = N(t);
  if (!U(t) || oe(t)) return n;
  let o = te(t, e);
  for (; o && Gt(o) && V(o).position === "static";) o = te(o, e);
  return o &&
      (Z(o) === "html" ||
        Z(o) === "body" && V(o).position === "static" && !Ot(o))
    ? n
    : o || Jt(t) || n;
}
var Me = async function (t) {
  let e = this.getOffsetParent || se, n = this.getDimensions;
  return {
    reference: Se(t.reference, await e(t.floating), t.strategy),
    floating: { x: 0, y: 0, ...await n(t.floating) },
  };
};
function Pe(t) {
  return V(t).direction === "rtl";
}
var ce = {
  convertOffsetParentRelativeRectToViewportRelativeRect: be,
  getDocumentElement: q,
  getClippingRect: Ee,
  getOffsetParent: se,
  getElementRects: Me,
  getClientRects: Re,
  getDimensions: Le,
  getScale: ft,
  isElement: K,
  isRTL: Pe,
};
function De(t, e) {
  let n = null, o, i = q(t);
  function r() {
    var a;
    clearTimeout(o), (a = n) == null || a.disconnect(), n = null;
  }
  function s(a, l) {
    a === void 0 && (a = !1), l === void 0 && (l = 1), r();
    let { left: u, top: h, width: m, height: g } = t.getBoundingClientRect();
    if (a || e(), !m || !g) return;
    let d = pt(h),
      w = pt(i.clientWidth - (u + m)),
      p = pt(i.clientHeight - (h + g)),
      c = pt(u),
      y = {
        rootMargin: -d + "px " + -w + "px " + -p + "px " + -c + "px",
        threshold: P(0, j(1, l)) || 1,
      },
      x = !0;
    function b(R) {
      let v = R[0].intersectionRatio;
      if (v !== l) {
        if (!x) return s();
        v ? s(!1, v) : o = setTimeout(() => {
          s(!1, 1e-7);
        }, 100);
      }
      x = !1;
    }
    try {
      n = new IntersectionObserver(b, { ...y, root: i.ownerDocument });
    } catch {
      n = new IntersectionObserver(b, y);
    }
    n.observe(t);
  }
  return s(!0), r;
}
function Ie(t, e, n, o) {
  o === void 0 && (o = {});
  let {
      ancestorScroll: i = !0,
      ancestorResize: r = !0,
      elementResize: s = typeof ResizeObserver == "function",
      layoutShift: a = typeof IntersectionObserver == "function",
      animationFrame: l = !1,
    } = o,
    u = Mt(t),
    h = i || r ? [...u ? rt(u) : [], ...rt(e)] : [];
  h.forEach((f) => {
    i && f.addEventListener("scroll", n, { passive: !0 }),
      r && f.addEventListener("resize", n);
  });
  let m = u && a ? De(u, n) : null, g = -1, d = null;
  s && (d = new ResizeObserver((f) => {
    let [y] = f;
    y && y.target === u && d &&
    (d.unobserve(e),
      cancelAnimationFrame(g),
      g = requestAnimationFrame(() => {
        var x;
        (x = d) == null || x.observe(e);
      })), n();
  }),
    u && !l && d.observe(u),
    d.observe(e));
  let w, p = l ? lt(t) : null;
  l && c();
  function c() {
    let f = lt(t);
    p &&
    (f.x !== p.x || f.y !== p.y || f.width !== p.width ||
      f.height !== p.height) &&
    n(),
      p = f,
      w = requestAnimationFrame(c);
  }
  return n(), () => {
    var f;
    h.forEach((y) => {
      i && y.removeEventListener("scroll", n),
        r && y.removeEventListener("resize", n);
    }),
      m?.(),
      (f = d) == null || f.disconnect(),
      d = null,
      l && cancelAnimationFrame(w);
  };
}
var ke = Nt,
  Fe = Xt,
  Be = Wt,
  $e = Ut,
  He = jt,
  Ne = Ht,
  We = zt,
  je = _t,
  Ve = (t, e, n) => {
    let o = new Map(), i = { platform: ce, ...n }, r = { ...i.platform, _c: o };
    return $t(t, e, { ...i, platform: r });
  };
function tt(t) {
  return typeof t == "object" && t !== null && !Array.isArray(t);
}
function ut(t, e) {
  return e in t && typeof t[e] == "string";
}
function _(t, e) {
  return e in t && typeof t[e] == "number";
}
(() => {
  function n(c) {
    return tt(c) && Object.hasOwn(c, "anchorOver") ? o(c.anchorOver) : !1;
  }
  function o(c) {
    if (
      !tt(c) || !ut(c, "anchorId") || !Object.hasOwn(c, "clientRect") ||
      !a(c.clientRect)
    ) return !1;
    if (Object.hasOwn(c, "clientRects") && Array.isArray(c.clientRects)) {
      for (let f of c.clientRects) {
        if (!a(f)) return !1;
      }
    } else return !1;
    return !(!ut(c, "url") || !ut(c, "containerClasses"));
  }
  function i(c) {
    return tt(c) && Object.hasOwn(c, "anchorLeave")
      ? ut(c.anchorLeave, "anchorId")
      : !1;
  }
  function r(c) {
    if (!tt(c)) return !1;
    if (Object.hasOwn(c, "mouseMove")) {
      let f = c.mouseMove;
      return !(!tt(f) || !_(f, "clientX") || !_(f, "clientY"));
    } else return !1;
  }
  function s(c) {
    if (!tt(c)) return !1;
    if (Object.hasOwn(c, "tooltipDimensions")) {
      let f = c.tooltipDimensions;
      return !(!tt(f) || !_(f, "height") || !ut(f, "anchorId"));
    } else return !1;
  }
  function a(c) {
    return !(!tt(c) || !_(c, "x") || !_(c, "y") || !_(c, "top") ||
      !_(c, "left") || !_(c, "bottom") || !_(c, "right") || !_(c, "width") ||
      !_(c, "height"));
  }
  function l(c, f, y) {
    return {
      x: c.x + f,
      y: c.y + y,
      top: c.top + y,
      left: c.left + f,
      bottom: c.bottom + y,
      right: c.right + f,
      width: c.width,
      height: c.height,
    };
  }
  let u = window.location.search,
    m = new URLSearchParams(u).get("contextCount") ?? "0",
    g = m !== "0",
    d = 0;
  function w() {
    return d += 1, d - 1;
  }
  function p(c) {
    g ? window.parent.postMessage(c, "*") : postMessage(c, "*");
  }
  if (
    document.body.parentElement.addEventListener("mouseover", (c) => {
      if (!(c.target instanceof HTMLElement)) return;
      let f = c.target;
      for (; !f.dataset.tooltipAnchor && f.parentElement;) f = f.parentElement;
      let y = f.dataset.tooltipAnchor;
      if (y === void 0) return;
      f.anchorCount || (f.anchorCount = `${w()}`);
      let x = f.anchorCount,
        b = `${m}:${x}`,
        R = {
          anchorOver: {
            anchorId: b,
            url: y,
            clientRect: f.getBoundingClientRect(),
            clientRects: [],
            containerClasses: f.dataset.tooltipClass
              ? f.dataset.tooltipClass
              : "",
          },
        },
        v = f.getClientRects();
      for (let C = 0; C < v.length; C++) R.anchorOver.clientRects.push(v[C]);
      p(R),
        f.addEventListener("mouseleave", () => {
          p({ anchorLeave: { anchorId: b } });
        }, { once: !0 });
    }), g
  ) {
    document.body.parentElement.addEventListener("mousemove", (c) => {
      window.parent.postMessage({
        mouseMove: { clientX: c.clientX, clientY: c.clientY },
      }, "*");
    }),
      window.parent.postMessage({
        tooltipDimensions: { height: document.body.scrollHeight, anchorId: m },
      }, "*");
  } else {
    let R = function (A) {
        if (c) {
          let O = c.getBoundingClientRect();
          x = O.left + A.mouseMove.clientX, b = O.top + A.mouseMove.clientY;
        }
        L();
      },
      C = function (A) {
        v.push(A);
      },
      I = function () {
        let A = v.pop();
        if (A) {
          A.fadingTimer !== null && clearTimeout(A.fadingTimer);
          let O = A.container;
          O.classList.add("tooltipFadeout"),
            O.style.pointerEvents = "none",
            setTimeout(() => {
              O.remove();
            }, 200);
        }
      },
      B = function (A) {
        for (let O = 0; O < v.length; O++) if (v[O].anchor === A) return O;
        return null;
      },
      T = function (A) {
        for (; v.length > A;) I();
      },
      M = function (A) {
        for (let O = 0; O <= A; O++) {
          let S = v[O];
          S.active = !0, S.fadingTimer !== null && clearTimeout(S.fadingTimer);
        }
      },
      L = function () {
        for (let A = v.length - 1; A >= 0; A--) {
          let O = v[A];
          if (y !== null && O.anchor === y || f !== null && O.anchor === f) {
            break;
          }
          O.active &&
            (O.active = !1, O.fadingTimer = setTimeout(() => T(A), 200));
        }
      },
      k = function (A) {
        if (D) {
          if (D.anchorId === A.anchorId) return;
          E !== null && clearTimeout(E);
        }
        D = A,
          E = setTimeout(() => {
            for (D = null, E = null; v.length > 0 && !v[v.length - 1].active;) {
              I();
            }
            let O = mt(A.containerClasses);
            document.body.appendChild(O);
            let S = W(),
              z = {
                active: !0,
                fadingTimer: null,
                anchor: A.anchorId,
                container: O,
                clientRect: A.clientRect,
                clientRects: A.clientRects,
                contextCount: `${S}`,
              };
            C(z), le(A, v.length - 1, O, S), O.style.visibility = "hidden";
          }, 200);
      },
      W = function () {
        return F += 1, F - 1;
      },
      mt = function (A) {
        let O = document.createElement("div");
        return O.className = `tooltipContainer${A ? ` ${A}` : ""}`, O;
      },
      le = function (A, O, S, z) {
        let $ = A.url, et = $.split("?");
        if (et.length === 1) $ = `${$}?contextCount=${z}`;
        else {
          let nt = new URLSearchParams(et[1]);
          nt.delete("contextCount"),
            nt.append("contextCount", `${z}`),
            $ = `${et[0]}?${nt.toString()}`;
        }
        let G = document.createElement("iframe");
        G.setAttribute("sandbox", "allow-scripts allow-same-origin"),
          G.src = $,
          S.appendChild(G),
          S.addEventListener("mouseleave", () => {
            c = null, f = null;
          }),
          S.addEventListener("mouseenter", () => {
            M(O), c = G, f = A.anchorId;
          });
      },
      c = null,
      f = null,
      y = null,
      x = 0,
      b = 0;
    addEventListener("mousemove", (A) => {
      x = A.clientX, b = A.clientY, L();
    });
    let v = [], D = null, E, F = 1;
    onmessage = (A) => {
      let O = A.data;
      if (r(O)) R(O);
      else if (i(O)) {
        y = null, D = null, E !== null && (clearTimeout(E), E = null);
      } else if (n(O)) {
        let S = O.anchorOver, z = S.anchorId;
        y = z;
        let $ = B(z);
        if ($ === null) {
          if (c !== null) {
            let et = c.getBoundingClientRect(), G = et.x, nt = et.y;
            S.clientRect = l(S.clientRect, G, nt),
              S.clientRects = S.clientRects.map((Ct) => l(Ct, G, nt));
          }
          k(S);
        } else M($);
      } else if (s(O)) {
        let S = O.tooltipDimensions;
        for (let z = v.length - 1; z >= 0; z--) {
          if (v[z].contextCount === S.anchorId) {
            let $ = v[z], et = $.container.childNodes[0];
            et.style.height = `${S.height}px`;
            let G = {
              getBoundingClientRect: () => $.clientRect,
              getClientRects: () => $.clientRects,
            };
            st.computePosition(G, $.container, {
              middleware: [
                st.offset(6),
                st.flip(),
                st.inline({ x, y: b }),
                st.shift({ padding: 5 }),
              ],
            }).then(({ x: nt, y: Ct }) => {
              Object.assign($.container.style, {
                left: `${nt}px`,
                top: `${Ct}px`,
              });
            }), $.container.style.visibility = "visible";
            break;
          }
        }
      }
    };
  }
})();
