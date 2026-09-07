---
layout: about
title: about
permalink: /
subtitle: >
  Postdoctoral Researcher in Natural Language Processing @ <a href='https://www.unibo.it/sitoweb/giacomo.frisoni/en'>University of Bologna</a>

profile:
  align: right
  image: prof_pic.jpg
  image_circular: false # crops the image to make it circular
  more_info: >
    <p>Department of Computer Science and Engineering</p>
    <p>University of Bologna</p>
    <p>Via dell'Università 50, 47522 Cesena (FC), Italy</p>
    <p><a href="mailto:giacomo.frisoni@unibo.it">giacomo.frisoni@unibo.it</a></p>

selected_papers: false # includes a list of papers marked as "selected={true}"
social: true # includes social icons at the bottom of the page

announcements:
  enabled: true # includes a list of news items
  scrollable: true # adds a vertical scroll bar if there are more than 3 news items
  limit: 5 # leave blank to include all the news in the `_news` folder

latest_posts:
  enabled: false
  scrollable: true
  limit: 3
---

I am a postdoctoral researcher in Computer Science and Engineering at the [University of Bologna](https://www.unibo.it/sitoweb/giacomo.frisoni/en), Italy. My research interests lie in **Natural Language Processing**, **Large Language Models**, and **Graph Neural Networks**, particularly for clinical and biomedical applications.

I have co-authored over 30 papers in prestigious conferences and journals—including ACL, NAACL, EMNLP, and AAAI—receiving best paper and reviewer awards. I actively contribute to the research community in various scientific roles, including editorial board member, program committee member, area chair, and workshop organizer for many international venues. I have collaborated with esteemed academic and industrial institutions, including the [University of Glasgow](https://www.gla.ac.uk/schools/computing/), [IBM Research Europe](https://research.ibm.com/labs/dublin), [EURECOM](https://www.eurecom.fr/en), and the [University of Edinburgh](https://informatics.ed.ac.uk/).

I am a member of [**UniboNLP**](https://disi-unibo-nlp.github.io/), the NLP research group of the Department of Computer Science and Engineering coordinated by Prof. Gianluca Moro. You can find our open models and datasets on [Hugging Face](https://huggingface.co/disi-unibo-nlp). I currently work on the [DARE](https://www.fondazionedare.it/) project, advancing representational and generative AI for health.

I serve as an adjunct professor and tutor for multiple AI courses at the University of Bologna, and I have co-supervised over 55 Bachelor's and Master's theses on NLP and deep learning.

<blockquote>
  "Language is the dress of thought" — Samuel Johnson
</blockquote>

<!-- Terminal mode entry point (see _pages/terminal.html) -->
<style>
  .terminal-entry {
    display: block;
    margin: 1.75rem 0 0.5rem;
    padding: 0.7rem 1rem;
    border-radius: 6px;
    background: #0b0a08;
    color: #f2b63d;
    font-family: "JetBrains Mono", ui-monospace, "Cascadia Mono", "Fira Code", "Courier New", monospace;
    font-size: 0.85rem;
    line-height: 1.5;
    text-decoration: none !important;
    border: 1px solid #3a2e12;
    white-space: nowrap;
    overflow-x: auto;
  }
  .terminal-entry:hover, .terminal-entry:focus { border-color: #f2b63d; color: #ffd579; }
  .terminal-entry .te-prompt { color: #ffd579; font-weight: 700; }
  .terminal-entry .te-hint { color: #9a7529; }
  .terminal-entry .te-cursor { display: inline-block; width: 0.55em; height: 1em; background: #f2b63d; vertical-align: -0.15em; margin-left: 0.15em; animation: te-blink 1.1s steps(1) infinite; }
  @keyframes te-blink { 50% { opacity: 0; } }
  @media (prefers-reduced-motion: reduce) { .terminal-entry .te-cursor { animation: none; } }
</style>
<div markdown="0">
<a class="terminal-entry" href="{{ '/terminal/' | relative_url }}" title="Open the terminal mode of this site">
  <span class="te-prompt">[frisoni@unibonlp-login ~]$</span> ./terminal<span class="te-cursor"></span>
  <span class="te-hint"># prefer a shell? press ` to open the terminal mode</span>
</a>
</div>
<script>
  // Press the backtick key anywhere on the home page (outside form fields) to open the terminal mode.
  document.addEventListener("keydown", function (e) {
    if (e.key !== "`" || e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target && e.target.tagName;
    if (t === "INPUT" || t === "TEXTAREA" || (e.target && e.target.isContentEditable)) return;
    window.location.href = "{{ '/terminal/' | relative_url }}";
  });
</script>
