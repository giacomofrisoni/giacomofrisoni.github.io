/* Teaching page: theses per year (stacked Master's / Bachelor's, ASCII shell chart) and full list from AMS Laurea. */
(function () {
  "use strict";
  var GF = window.GF || { data: "/assets/data/" };
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function surname(a) { return String(a || "").split(/[;,]/)[0].trim().toLowerCase(); }
  function run(m) {
    var t = m && m.theses; if (!t) return;
    if (t.search_url) { var l = document.getElementById("gf-ams-link"); if (l) l.href = t.search_url; }
    var box = document.getElementById("gf-thesis-shell");
    var lv = t.per_year_level || {}, py = t.per_year || {};
    var years = Object.keys(py).sort();
    if (box && years.length && window.GFShell) {
      var out = box.querySelector(".gf-shell-out"), st = box.querySelector(".gf-shell-status");
      var series = [{ name: "Master's", values: years.map(function (y) { return (lv["M.S."] || {})[y] || 0; }), cls: "bar-a", ch: "█" },
                    { name: "Bachelor's", values: years.map(function (y) { return (lv["B.S."] || {})[y] || 0; }), cls: "bar-b", ch: "▒" }];
      var unk = years.map(function (y) { return (lv.unknown || {})[y] || 0; });
      if (unk.some(Boolean)) series.push({ name: "unclassified", values: unk, cls: "d", ch: "░" });
      if (!series[0].values.some(Boolean) && !series[1].values.some(Boolean)) series = [{ name: "theses", values: years.map(function (y) { return py[y]; }), cls: "bar-a", ch: "█" }];
      var go = function () {
        window.GFShell.run(out, "ams-laurea --correlatore frisoni --per-year", function () {
          var holder = document.createElement("div"); out.appendChild(document.createTextNode("\n")); out.appendChild(holder);
          window.GFShell.bars(holder, st, years, series, "theses");
        });
      };
      if ("IntersectionObserver" in window) { var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { go(); io.disconnect(); } }); io.observe(box); } else go();
    }
    var items = t.items || []; if (!items.length) return;
    document.querySelectorAll("#gf-selected-theses li[data-surname]").forEach(function (li) {
      var s = li.getAttribute("data-surname").toLowerCase();
      var hit = items.filter(function (it) { return surname(it.author) === s; })[0]; if (!hit) return;
      var title = li.querySelector(".t");
      title.innerHTML = hit.url ? '<a class="gf-plain" href="' + esc(hit.url) + '">' + esc(hit.title) + "</a>" : esc(hit.title);
    });
    var all = document.getElementById("gf-all-theses");
    if (all) {
      all.querySelector("ol").innerHTML = items.map(function (it) {
        return "<li>" + esc(it.author) + (it.year ? " (" + it.year + ")" : "") + ". " + (it.url ? '<a href="' + esc(it.url) + '">' + esc(it.title) + "</a>" : esc(it.title)) + (it.level ? ". <em>" + esc(it.level) + "</em>" : "") + "</li>";
      }).join("");
      all.querySelector("summary").textContent = "Show all " + items.length + " theses from AMS Laurea";
      all.hidden = false;
    }
  }
  fetch(GF.data + "metrics.json", { cache: "no-cache" }).then(function (r) { return r.ok ? r.json() : null; }).then(run).catch(function () {});
})();
