---
layout: post
title: UniboNLP at the European Researchers' Night 2026
date: 2026-09-26
description: Five live demos in Cesena showed how small, efficient language models can work on medicine, chess, and robotics. A great evening with a full room.
tags: [outreach, demos, unibonlp]
thumbnail: /assets/img/blog_ndr_poster.jpg
related_posts: false
---

On September 25 the UniboNLP group took part in the **Notte Europea dei Ricercatori** (European Researchers' Night) at the Biblioteca Malatestiana in Cesena, with the session *Intelligenza Artificiale e Linguaggio: Poche Risorse, Grandi Risultati* ("AI and language: small resources, big results"). The evening was a great success: people of every age queued at the stations, played against our models, and asked sharp questions about how AI works in medicine.

<video class="gf-video" src="{{ '/assets/video/unibonlp_ndr_2026.mp4' | relative_url }}" poster="{{ '/assets/img/blog_ndr_poster.jpg' | relative_url }}" controls muted loop playsinline preload="metadata"></video>

## The demos

Every demo runs a compact model that fits on ordinary hardware. They are still online, so you can try them yourself.

<div class="gf-demos" markdown="0">
  <a class="gf-plain" href="https://huggingface.co/spaces/disi-unibo-nlp/medgenie-demo"><b><img src="{{ '/assets/img/logos/huggingface_color.svg' | relative_url }}" alt="">MedGENIE</b><span>Pick a clinical multiple-choice question, choose your answer, and watch a language model answer it from its own knowledge, after reading retrieved documents, and after reading context it generated itself (ACL 2024).</span></a>
  <a class="gf-plain" href="https://huggingface.co/spaces/disi-unibo-nlp/openbioner-v2-demo-ndr"><b><img src="{{ '/assets/img/logos/huggingface_color.svg' | relative_url }}" alt="">OpenBioNER-v2</b><span>Paste any medical text, choose the entity types to find (diseases, bacteria, ages, names, or your own), and run a lightweight model on it.</span></a>
  <a class="gf-plain" href="https://huggingface.co/spaces/disi-unibo-nlp/paint-it-black-demo"><b><img src="{{ '/assets/img/logos/huggingface_color.svg' | relative_url }}" alt="">Paint It Black</b><span>A redaction game on clinical documents: can you hide the personal data better than a multimodal LLM? (EMNLP 2026)</span></a>
</div>

More on the benchmark behind the redaction game is on the [Paint It, Black project page](https://disi-unibo-nlp.github.io/paint-it-black/).

<div class="gf-demos" markdown="0">
  <a class="gf-plain" href="http://137.204.107.40:37342/"><b>♞ Mixture of Masters</b><span>Play chess against a language model that imitates the style of individual grandmasters.</span></a>
</div>

The fifth station was the **Reachy Mini** robot, which chatted with visitors using a small language model running locally.

The full list of our publications behind these demos is on the [publications page]({{ '/publications/' | relative_url }}). Thanks to everyone who came, and to the organizers of the Notte dei Ricercatori for the invitation.
