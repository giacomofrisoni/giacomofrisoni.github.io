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
    <a class="gf-affil-box gf-plain" href="https://www.unibo.it/sitoweb/giacomo.frisoni/en"><img src="/assets/img/logos/unibo_seal.png" alt="University of Bologna seal"><span><b>University of Bologna</b><span>Department of Computer Science and Engineering (DISI)</span><span>Cesena Campus</span></span></a>

selected_papers: false # includes a list of papers marked as "selected={true}"
social: false # replaced by the labelled contact row below (_includes/extras/contacts.liquid)

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

I have co-authored over 30 papers in prestigious conferences and journals, including ACL, NAACL, EMNLP, and AAAI, receiving best paper and reviewer awards. I serve the research community as area chair at ACL Rolling Review, co-chair of the [KEIR](https://keir-workshop.github.io/) workshop series on knowledge-enhanced information retrieval, guest editor, and program committee member for many international venues. I have collaborated with the [University of Glasgow](https://www.gla.ac.uk/schools/computing/), [IBM Research Europe](https://research.ibm.com/labs/dublin), [EURECOM](https://www.eurecom.fr/en), [Universidad Técnica Federico Santa María](https://www.inf.utfsm.cl/), and the [University of Edinburgh](https://informatics.ed.ac.uk/).

I currently work on the [DARE](https://www.fondazionedare.it/) project, advancing representational and generative AI for health. I teach as adjunct professor at Bologna Business School and as tutor in the Master's degree in Artificial Intelligence, and I have co-supervised <span data-gf-metric="theses.count">{{ site.data.metrics.theses | default: 57 }}</span> Bachelor's and Master's theses on NLP and deep learning.

<div markdown="0">
<a class="gf-term" data-gf-term href="{{ '/terminal/' | relative_url }}" aria-label="Open the interactive terminal version of this site">
  <div class="gf-term-bar" aria-hidden="true"><i></i><i></i><i></i><span>frisoni@unibonlp-login: ~</span></div>
  <div class="gf-term-body" aria-hidden="true"></div>
  <div class="gf-term-cta"><b>Open the interactive shell</b><span>or press <kbd>`</kbd> anywhere. Try <kbd>help</kbd>, <kbd>ls</kbd>, <kbd>squeue</kbd></span></div>
  <script type="application/json">
  [
    {"cmd": "whoami", "out": [["h", "Giacomo Frisoni"], ["", "Postdoc in NLP @ University of Bologna, UniboNLP group"]]},
    {"cmd": "cat research.txt", "out": [["", "language models + graph neural networks"], ["", "with a focus on clinical applications"]]},
    {"cmd": "squeue -u frisoni", "out": [["d", "JOBID  NAME                       ST  WHERE"], ["", "2610   emnlp26-paint-it-black     R   Budapest"], ["", "2611   keir-cikm26-workshop       R   Rome"]]}
  ]
  </script>
</a>
</div>

<h2 class="gf-h2">upcoming</h2>
<ul class="gf-upcoming" markdown="0">
  <li><time>Late Oct 2026</time><div><strong>EMNLP 2026</strong>, Budapest. Presenting <em>Paint It, Black</em>, a benchmark for LLM de-identification of multimodal clinical documents built with Sant'Orsola clinicians (Main Track).</div></li>
  <li><time>Nov 8, 2026</time><div><strong>KEIR @ CIKM 2026</strong>, Sapienza University of Rome. Third edition of the workshop I co-chair: a record 32 submissions, 16 accepted, keynote by Fabio Petroni. <a href="https://keir-workshop.github.io/">Program</a></div></li>
</ul>

<h2 class="gf-h2">service and recognition</h2>
<div class="gf-service" markdown="0">
  <div>
    <h3>Workshop organization</h3>
    <ul>
      <li>KEIR-26 @ CIKM, Rome <em>co-chair</em></li>
      <li>KEIR-25 @ ECIR, Lucca <em>co-chair, Springer LNCS 16086</em></li>
      <li>KEIR-24 @ ECIR, Glasgow <em>publicity chair</em></li>
    </ul>
  </div>
  <div>
    <h3>Chairing and editing</h3>
    <ul>
      <li>Area Chair, ACL Rolling Review <em>since 2025</em></li>
      <li>Session Chair at AAAI-26, ECAI-25, DATA-22</li>
      <li>Guest Editor, <em>Sensors</em> special issue on healthcare cognitive computing</li>
      <li>External thesis committee, UTFSM, Chile</li>
    </ul>
  </div>
  <div>
    <h3>Awards</h3>
    <ul>
      <li>Gold Reviewer, ICML-26 <em>top 25%</em></li>
      <li>Outstanding Reviewer, EMNLP-25 <em>51 of 13,048</em></li>
      <li>Best Student Paper, DATA-22; Best Paper, DATA-20</li>
      <li>Con.Scienze national prize for Master's theses, 2020</li>
    </ul>
  </div>
  <div>
    <h3>Community</h3>
    <ul>
      <li>Board member, AMAE patient association for esophageal achalasia</li>
      <li>Hugging Face Student Ambassador, inaugural cohort 2022</li>
      <li>Streamlit Student Ambassador, 2022 to 2023</li>
    </ul>
  </div>
</div>

<h2 class="gf-h2">research group</h2>
<div class="gf-group" markdown="0">
  <img src="{{ '/assets/img/logos/unibonlp.svg' | relative_url }}" alt="UniboNLP logo">
  <div>
    <p>I am a member of <strong>UniboNLP</strong>, the NLP research group of the Department of Computer Science and Engineering led by Prof. Gianluca Moro. We design efficient neural models for text and multimodal data that run on limited hardware and compete with commercial systems, with long experience in high-stakes domains such as medicine and law.</p>
    <div class="gf-linkrow">
      <a href="https://disi-unibo-nlp.github.io/"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>Group website</a>
      <a href="https://huggingface.co/disi-unibo-nlp"><img src="{{ '/assets/img/logos/huggingface_color.svg' | relative_url }}" alt="">Models and datasets</a>
      <a href="{{ '/assets/pdf/posters/unibonlp_group_poster.pdf' | relative_url }}" data-gf-lightbox="{{ '/assets/img/posters/unibonlp_poster.jpg' | relative_url }}" data-pdf="{{ '/assets/pdf/posters/unibonlp_group_poster.pdf' | relative_url }}" data-caption="UniboNLP research group poster (2026)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>Group poster</a>
    </div>
  </div>
</div>

{% include extras/contacts.liquid %}

<blockquote class="gf-quote" markdown="0">
  <p>Language is the dress of thought.</p>
  <footer>Samuel Johnson</footer>
</blockquote>
