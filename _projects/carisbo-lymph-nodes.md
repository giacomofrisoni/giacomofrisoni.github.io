---
layout: page
title: AI-SLN
description: AI support for the surgeon during sentinel lymph node biopsy in endometrial cancer
importance: 2
category: research
related_publications: false
---

<div class="gf-proj-head" markdown="0">
  <img src="{{ '/assets/img/logos/carisbo.png' | relative_url }}" alt="Fondazione Cassa di Risparmio in Bologna">
</div>

<div class="gf-facts" markdown="0">
  <div><span>Funder</span><b>Fondazione CARISBO</b></div>
  <div><span>Duration</span><b>Jul 2024 – Jun 2026</b></div>
  <div><span>Budget</span><b>€20,000</b></div>
  <div><span>Clinical partner</span><b>IRCCS Sant'Orsola, Bologna</b></div>
  <div><span>My role</span><b>Co-Principal Investigator</b></div>
</div>

<figure class="gf-figure" markdown="0">
  <img src="{{ '/assets/img/projects/ai-sln/ai_sln_overview.jpg' | relative_url }}" alt="Illustration of robotic surgery: the surgeon at the console and an assistant pointing at the laparoscopic view, where the system highlights the lymph node">
  <figcaption><b>The idea.</b> During robotic surgery, the system watches the laparoscopic video and points the surgical team to lymph node tissue in real time.</figcaption>
</figure>

In endometrial cancer surgery, the **sentinel lymph node** (the first node that drains the tumour) is found by injecting indocyanine green (ICG), a dye that glows under near-infrared light. Sometimes the tissue removed as "sentinel node" turns out, at the microscope, to contain no lymph node at all. **AI-SLN** analyses the surgical videos to help the surgeon recognise lymph node tissue and reduce these empty samples. It is a collaboration between the Department of Computer Science and Engineering of the University of Bologna and the Gynecology unit of the IRCCS Sant'Orsola Polyclinic.

<h2 class="gf-h2">three questions for the AI</h2>

<div class="gf-tasks" role="tablist" aria-label="Project tasks" markdown="0">
  <button type="button" role="tab" aria-selected="true" data-t="1">1. When?</button>
  <button type="button" role="tab" aria-selected="false" data-t="2">2. Involved?</button>
  <button type="button" role="tab" aria-selected="false" data-t="3">3. How many?</button>
</div>

<div class="gf-taskpanel" data-p="1" markdown="0">
  <div class="gf-player" id="gf-player">
    <div class="gf-frame" role="img" aria-label="Frame of a surgical video sequence" style="background-image:url('{{ '/assets/img/projects/ai-sln/seq_sprite.jpg' | relative_url }}')"></div>
    <canvas class="gf-signal" width="600" height="28" aria-hidden="true"></canvas>
    <div class="gf-ctrl"><button type="button" class="gf-play" aria-label="Play">▶</button><input type="range" min="0" max="79" value="0" aria-label="Frame"><span class="gf-phase">white light</span></div>
  </div>
  <div>
    <h3>When does the sentinel node appear?</h3>
    <p>Find the moment in the video when the lymph node becomes visible. Drag the slider through a real sequence of 80 frames: the amber line shows how much ICG fluorescence each frame contains, measured from the images.</p>
    <span class="gf-big" data-count="66.7" data-suffix="%">0%</span>
    <p class="gf-note">of video sequences with the right moment found, with a mean error of about three seconds.</p>
  </div>
</div>
<div class="gf-taskpanel" data-p="2" hidden markdown="0">
  <img src="{{ '/assets/img/projects/ai-sln/sample_meta.jpg' | relative_url }}" alt="Close-up of a lymph node held by a surgical instrument">
  <div>
    <h3>Is the node involved?</h3>
    <p>Distinguish lymph nodes with metastases from disease-free ones, looking only at the intra-operative image, before the histopathological result is available.</p>
    <span class="gf-big" data-count="0.71" data-dec="2">0</span>
    <p class="gf-note">PR-AUC (area under the precision-recall curve, 1 is perfect) in separating metastatic from disease-free nodes.</p>
  </div>
</div>
<div class="gf-taskpanel" data-p="3" hidden markdown="0">
  <img src="{{ '/assets/img/projects/ai-sln/sample_count.jpg' | relative_url }}" alt="Removed tissue glowing green under ICG fluorescence">
  <div>
    <h3>How many nodes are in the tissue?</h3>
    <p>Estimate the number of lymph nodes contained in the removed tissue from its fluorescence image, and compare it with the count from the pathologist.</p>
    <span class="gf-big" data-count="71" data-suffix="%">0%</span>
    <p class="gf-note">of cases estimated within one node of the histopathological count (mean error 1.39 nodes).</p>
  </div>
</div>

<h2 class="gf-h2">approach</h2>

No pre-trained model exists for this kind of image, so we compared medical foundation models (LemonFM, MedSigLIP, MedGemma) and segmentation and tracking models, with training and data augmentation designed for small case series. Everything runs on local infrastructure, as required by the ethics protocol. A journal article is in preparation, with release of the source code (the clinical data cannot be shared). The project also supported *Paint It, Black*, a benchmark for clinical document de-identification accepted at EMNLP 2026 and co-authored with the clinical partners.

**Project website:** [disi-unibo-nlp.github.io/ai-sln](https://disi-unibo-nlp.github.io/ai-sln/)

<script>
(function () {
  var SIG = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.002, 0.049, 0.056, 0.071, 0.069, 0.073, 0.084, 0.083, 0.066, 0.109, 0.09, 0.102, 0.084, 0.095, 0.103, 0.113, 0.117, 0.082, 0.11, 0.121, 0.113, 0.097, 0.12, 0.094, 0.11, 0.106, 0.127, 0.109, 0.127, 0.14, 0.122, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  /* task tabs */
  var tabs = document.querySelectorAll(".gf-tasks button"), panels = document.querySelectorAll(".gf-taskpanel");
  function count(p) {
    var n = p.querySelector("[data-count]"); if (!n || n.dataset.done) return; n.dataset.done = 1;
    var to = parseFloat(n.dataset.count), dec = +(n.dataset.dec || (to % 1 ? 1 : 0)), suf = n.dataset.suffix || "", t0 = null;
    function f(t) { t0 = t0 || t; var k = reduce ? 1 : Math.min(1, (t - t0) / 900); n.textContent = (to * (1 - Math.pow(1 - k, 3))).toFixed(dec) + suf; if (k < 1) requestAnimationFrame(f); }
    requestAnimationFrame(f);
  }
  tabs.forEach(function (b) { b.addEventListener("click", function () {
    tabs.forEach(function (x) { x.setAttribute("aria-selected", String(x === b)); });
    panels.forEach(function (p) { p.hidden = p.dataset.p !== b.dataset.t; if (!p.hidden) count(p); });
  }); });
  var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { count(panels[0]); io.disconnect(); } }); io.observe(panels[0]);
  /* sequence player */
  var pl = document.getElementById("gf-player"), fr = pl.querySelector(".gf-frame"), rg = pl.querySelector("input"), ph = pl.querySelector(".gf-phase"), btn = pl.querySelector(".gf-play"), cv = pl.querySelector("canvas");
  var max = Math.max.apply(null, SIG), timer = null;
  function draw(i) {
    var ctx = cv.getContext("2d"), w = cv.width, h = cv.height; ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = "#f2b63d"; ctx.lineWidth = 2; ctx.beginPath();
    SIG.forEach(function (v, j) { var x = j / (SIG.length - 1) * w, y = h - 3 - v / max * (h - 6); if (j) ctx.lineTo(x, y); else ctx.moveTo(x, y); }); ctx.stroke();
    ctx.fillStyle = "#fff3d1"; ctx.fillRect(i / (SIG.length - 1) * w - 1, 0, 2, h);
  }
  function show(i) {
    i = +i; fr.style.backgroundPosition = (i % 10) / 9 * 100 + "% " + Math.floor(i / 10) / 7 * 100 + "%";
    ph.textContent = SIG[i] > 0.02 ? "ICG fluorescence" : "white light"; rg.value = i; draw(i);
  }
  rg.addEventListener("input", function () { stop(); show(rg.value); });
  function stop() { clearInterval(timer); timer = null; btn.textContent = "▶"; btn.setAttribute("aria-label", "Play"); }
  btn.addEventListener("click", function () {
    if (timer) return stop();
    btn.textContent = "❚❚"; btn.setAttribute("aria-label", "Pause");
    timer = setInterval(function () { show((+rg.value + 1) % SIG.length); }, 160);
  });
  show(0);
})();
</script>
