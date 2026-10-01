/* giacomofrisoni.github.io: site-wide behaviour (no dependencies). */
(function () {
  "use strict";
  var GF = window.GF || { terminal: "/terminal/", data: "/assets/data/" };
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function el(tag, attrs, html) { var e = document.createElement(tag); for (var k in attrs || {}) e.setAttribute(k, attrs[k]); if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function inField(t) { return t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable); }

  /* 1. navbar "cli" item: terminal pill with a blinking cursor */
  function navCli() {
    document.querySelectorAll('#navbar a.nav-link[href$="/cli/"]').forEach(function (a) {
      a.classList.add("gf-cli-link");
      a.setAttribute("href", GF.terminal);
      a.setAttribute("title", "Interactive terminal mode (shortcut: ` key)");
      if (!a.querySelector(".gf-term-cursor")) a.insertAdjacentHTML("beforeend", '<span class="gf-term-cursor" aria-hidden="true"></span>');
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key !== "`" || e.ctrlKey || e.metaKey || e.altKey || inField(e.target)) return;
    window.location.href = GF.terminal;
  });

  /* 2. page titles are typed like a shell path */
  function typeTitle() {
    var h = document.querySelector(".post-header .post-title");
    if (!h || !h.parentNode.querySelector(".post-description") || reduce) return;
    var text = h.textContent.trim(); if (!text || text.length > 40) return;
    h.textContent = "";
    var cur = el("span", { class: "gf-title-cursor", "aria-hidden": "true" });
    var txt = document.createTextNode(""); h.appendChild(txt); h.appendChild(cur);
    h.setAttribute("aria-label", text);
    var i = 0;
    (function tick() {
      txt.data = text.slice(0, ++i);
      if (i < text.length) setTimeout(tick, 55 + Math.random() * 40);
      else setTimeout(function () { cur.style.opacity = "0"; setTimeout(function () { cur.remove(); }, 700); }, 1600);
    })();
  }

  /* 3. home hero terminal: types a short session when it scrolls into view */
  function heroTerminal() {
    var box = document.querySelector("[data-gf-term]"); if (!box) return;
    /* the whole box opens the terminal (it is a div, so the theme's link colours never apply to it) */
    var href = box.getAttribute("data-href");
    if (href) {
      box.addEventListener("click", function (e) { if (!e.target.closest("a")) window.location.href = href; });
      box.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); window.location.href = href; } });
    }
    var body = box.querySelector(".gf-term-body"), script;
    try { script = JSON.parse(box.querySelector("script[type='application/json']").textContent); } catch (e) { return; }
    var prompt = '<span class="p">[frisoni@unibonlp-login ~]$</span> ';
    function line(l) { return '<span class="' + (l[0] || "") + '">' + esc(l[1]) + "</span>"; }
    if (reduce) { body.innerHTML = script.map(function (s) { return prompt + esc(s.cmd) + "\n" + s.out.map(line).join("\n"); }).join("\n") + "\n" + prompt + '<span class="gf-term-cursor"></span>'; return; }
    var html = "";
    function render(extra) { body.innerHTML = html + (extra || "") + '<span class="gf-term-cursor"></span>'; }
    function type(cmd, i, done) {
      if (i > cmd.length) { html += prompt + esc(cmd) + "\n"; return done(); }
      render(prompt + esc(cmd.slice(0, i))); setTimeout(function () { type(cmd, i + 1, done); }, 38 + Math.random() * 45);
    }
    function step(k) {
      if (k >= script.length) { html += prompt; render(); return; }
      type(script[k].cmd, 0, function () { setTimeout(function () { html += script[k].out.map(line).join("\n") + "\n"; render(); setTimeout(function () { step(k + 1); }, 650); }, 260); });
    }
    render();
    var go = false, start = function () { if (!go) { go = true; setTimeout(function () { step(0); }, 350); } };
    if ("IntersectionObserver" in window) { var io = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { start(); io.disconnect(); } }); }, { threshold: 0.35 }); io.observe(box); } else start();
  }

  /* 4. lightbox */
  var lb, lastFocus;
  function lightbox() {
    lb = el("div", { class: "gf-lightbox", hidden: "", role: "dialog", "aria-modal": "true", "aria-label": "Preview" },
      '<button class="gf-lb-close" type="button">Close</button><figure><img alt=""><figcaption><span class="gf-lb-cap"></span><span class="gf-lb-actions"></span></figcaption></figure>');
    document.body.appendChild(lb);
    lb.addEventListener("click", function (e) { if (e.target === lb || e.target.classList.contains("gf-lb-close")) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !lb.hidden) close(); });
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("[data-gf-lightbox]"); if (!a || e.metaKey || e.ctrlKey) return;
      e.preventDefault(); open(a.getAttribute("data-gf-lightbox"), a.getAttribute("data-caption") || "", a.getAttribute("data-pdf"));
    });
  }
  function open(src, cap, pdf) {
    lastFocus = document.activeElement;
    var img = lb.querySelector("img"); img.src = src; img.alt = cap;
    lb.querySelector(".gf-lb-cap").textContent = cap;
    var act = lb.querySelector(".gf-lb-actions"); act.innerHTML = "";
    if (pdf) act.appendChild(el("a", { href: pdf, target: "_blank", rel: "noopener" }, "Open PDF"));
    lb.hidden = false; lb.querySelector(".gf-lb-close").focus();
  }
  function close() { lb.hidden = true; lb.querySelector("img").src = ""; if (lastFocus) lastFocus.focus(); }
  window.GFLightbox = { open: open };

  /* 5. reveal-on-scroll for elements marked .gf-reveal (staggered) */
  function reveal() {
    var els = document.querySelectorAll(".gf-reveal"); if (!els.length) return;
    if (reduce || !("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("gf-in"); }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (x) { if (!x.isIntersecting) return; var e = x.target, d = +(e.getAttribute("data-delay") || 0); setTimeout(function () { e.classList.add("gf-in"); }, d); io.unobserve(e); });
    }, { threshold: 0.12 });
    els.forEach(function (e, i) { if (!e.hasAttribute("data-delay")) e.setAttribute("data-delay", String((i % 6) * 70)); io.observe(e); });
  }
  window.GFReveal = reveal;

  /* 6. live numbers from assets/data/metrics.json */
  function liveNumbers() {
    var nodes = document.querySelectorAll("[data-gf-metric]"); if (!nodes.length) return;
    fetch(GF.data + "metrics.json", { cache: "no-cache" }).then(function (r) { return r.ok ? r.json() : null; }).then(function (m) {
      if (!m) return;
      nodes.forEach(function (n) { var v = n.getAttribute("data-gf-metric").split(".").reduce(function (o, k) { return o && o[k]; }, m); if (v != null && v !== "") n.textContent = v; });
    }).catch(function () {});
  }

  /* 7. GFShell: ASCII charts drawn character by character -------------- */
  function charW(node) {
    var c = document.createElement("canvas").getContext("2d"); var cs = getComputedStyle(node);
    c.font = cs.fontSize + " " + cs.fontFamily; return c.measureText("M").width || 8;
  }
  function cols(node) { return Math.max(24, Math.floor((node.clientWidth - 32) / charW(node))); }
  var GFShell = {
    /* horizontal bars; series = [{name, values, cls, ch}], stacked if more than one */
    bars: function (out, status, labels, series, unit) {
      var total = labels.map(function (_, i) { return series.reduce(function (s, se) { return s + (se.values[i] || 0); }, 0); });
      var max = Math.max.apply(null, total.concat([1]));
      var lw = Math.max.apply(null, labels.map(function (l) { return String(l).length; }));
      var width = Math.max(10, cols(out) - lw - 10);
      var rows = labels.map(function (l, i) {
        return '<span class="row" data-i="' + i + '"><span class="d">' + esc(String(l).padStart(lw)) + " │</span><span class=\"bars\"></span> <span class=\"h\"></span></span>";
      });
      var legend = series.length > 1 ? "\n" + series.map(function (s) { return '<span class="' + s.cls + '">' + s.ch + s.ch + "</span> " + esc(s.name); }).join("   ") : "";
      out.innerHTML = rows.join("\n") + '<span class="d">' + legend + "</span>";
      var rowsEl = out.querySelectorAll(".row");
      function describe(i) { return labels[i] + ": " + series.map(function (s) { return (s.values[i] || 0) + " " + s.name; }).join(", ") + (series.length > 1 ? " (" + total[i] + " " + unit + ")" : ""); }
      rowsEl.forEach(function (r) {
        r.addEventListener("mouseenter", function () { status.textContent = describe(+r.dataset.i); });
        r.addEventListener("click", function () { status.textContent = describe(+r.dataset.i); });
      });
      var steps = reduce ? 1 : 24, k = 0;
      (function frame() {
        k++;
        rowsEl.forEach(function (r, i) {
          var html = "", acc = 0;
          series.forEach(function (s) {
            var n = Math.round(width * (s.values[i] || 0) / max * Math.min(1, k / steps));
            if (n === 0 && (s.values[i] || 0) > 0 && k === steps) n = 1;
            html += '<span class="' + s.cls + '">' + new Array(n + 1).join(s.ch) + "</span>"; acc += n;
          });
          r.querySelector(".bars").innerHTML = html;
          r.querySelector(".h").textContent = k >= steps ? total[i] : "";
        });
        if (k < steps) requestAnimationFrame(frame);
      })();
    },
    /* sparkline drawn left to right with block characters */
    spark: function (out, status, points, label) {
      var chars = "▁▂▃▄▅▆▇█";
      var vals = points.map(function (p) { return p.v; });
      var lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals), span = Math.max(1, hi - lo);
      var width = Math.max(10, cols(out) - 10);
      var step = Math.max(1, Math.ceil(points.length / width));
      var pts = points.filter(function (_, i) { return i % step === 0 || i === points.length - 1; });
      out.innerHTML = '<span class="d">' + esc(String(hi).padStart(6)) + ' ┤</span>\n<span class="spark"></span>\n<span class="d">' + esc(String(lo).padStart(6)) + " ┤ " + esc(pts[0].d) + " → " + esc(pts[pts.length - 1].d) + "</span>";
      var sp = out.querySelector(".spark"); var i = 0;
      sp.insertAdjacentHTML("beforebegin", "");
      (function frame() {
        var n = reduce ? pts.length : Math.min(pts.length, i + Math.ceil(pts.length / 30));
        var h = "       ";
        for (var j = 0; j < n; j++) {
          var c = chars[Math.round((pts[j].v - lo) / span * 7)];
          h += '<span data-j="' + j + '">' + c + "</span>";
        }
        sp.innerHTML = h; i = n;
        if (i < pts.length) requestAnimationFrame(frame);
        else sp.querySelectorAll("span[data-j]").forEach(function (s) {
          s.addEventListener("mouseenter", function () { var p = pts[+s.dataset.j]; status.textContent = p.d + ": " + p.v + " " + label; });
        });
      })();
    },
    /* types "$ cmd" in the output area, then calls done() */
    run: function (out, cmd, done) {
      if (reduce) { out.innerHTML = '<span class="p">$</span> ' + esc(cmd); return done(); }
      var i = 0;
      (function t() {
        out.innerHTML = '<span class="p">$</span> ' + esc(cmd.slice(0, i)) + '<span class="gf-term-cursor"></span>';
        if (i++ < cmd.length) setTimeout(t, 22 + Math.random() * 25); else setTimeout(done, 160);
      })();
    },
    esc: esc
  };
  window.GFShell = GFShell;

  function init() { navCli(); typeTitle(); heroTerminal(); lightbox(); reveal(); liveNumbers(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
