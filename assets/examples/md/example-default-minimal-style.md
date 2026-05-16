---
marp: true
theme: default
header: Example Labs | default theme, minimal style
paginate: true
transition: fade
style: |
  
  /* ===== Minimal Style for Marp ===== */
  
  /* --- Minimal Title --- */
  section.min-title {
    background: #111827;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section.min-title h1 {
    color: #ffffff;
    font-size: 2.5em;
    font-weight: 700;
    margin-bottom: 0.3em;
  }
  section.min-title p {
    color: rgba(255,255,255,0.7);
    font-size: 1.1em;
  }
  
  /* --- Minimal Section --- */
  section.min-section {
    background: #111827;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section.min-section h2 {
    color: #ffffff;
    font-size: 2em;
  }
  section.min-section p {
    color: rgba(255,255,255,0.7);
  }
  
  /* --- Minimal Table --- */
  section.min-table table {
    border-collapse: collapse;
    width: 100%;
    margin: 1rem auto;
    font-size: 0.9em;
  }
  section.min-table thead th {
    background: #111827;
    color: #ffffff;
    padding: 0.7rem 1rem;
    font-weight: 600;
    border: 1px solid #111827;
    text-align: left;
  }
  section.min-table tbody td {
    padding: 0.6rem 1rem;
    color: #111827;
    border: 1px solid #e5e7eb;
    text-align: left;
  }
  section.min-table tbody tr:nth-child(even) {
    background: #f9fafb;
  }
  
  /* --- Minimal Image Right --- */
  .min-split {
    display: grid;
    grid-template-columns: 3fr 2fr;
    gap: 1.5rem;
    align-items: center;
    margin-top: 1rem;
  }
  .min-split img {
    width: 100%;
    object-fit: cover;
  }
  .min-split-content ul {
    padding-left: 1.2rem;
  }
  .min-split-content li {
    margin-bottom: 0.4rem;
    color: #111827;
  }
  
  /* --- Minimal Image Center --- */
  section.min-img-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .min-image-center-wrap {
    text-align: center;
    margin-top: 1rem;
  }
  .min-image-center-wrap img {
    max-height: 380px;
    object-fit: contain;
  }
  
  /* --- Minimal Quote --- */
  section.min-quote {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  section.min-quote blockquote {
    border-left: 3px solid #2563eb;
    padding: 1.2rem 1.8rem;
    margin: 1rem auto;
    max-width: 85%;
    font-size: 1.2em;
    font-style: italic;
    color: #374151;
    background: transparent;
  }
  section.min-quote blockquote p:last-child {
    font-style: normal;
    font-size: 0.85em;
    color: #6b7280;
    margin-top: 0.5rem;
  }
  
  /* --- Minimal Two Column --- */
  .min-2col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-top: 1rem;
  }
  .min-2col-left {
    border-right: 1px solid #e5e7eb;
    padding-right: 1.5rem;
  }
  .min-2col-right {
    padding-left: 0.5rem;
  }
  .min-2col h3 {
    color: #111827;
    font-size: 1em;
    margin-top: 0;
    margin-bottom: 0.5rem;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 0.3rem;
  }
  .min-2col ul {
    padding-left: 1.2rem;
    margin: 0;
  }
  .min-2col li {
    margin-bottom: 0.3rem;
    color: #374151;
  }
  
  /* --- Minimal Big Statement --- */
  section.min-statement {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    background: #ffffff;
  }
  section.min-statement h1 {
    color: #111827;
    font-size: 3em;
    font-weight: 800;
    line-height: 1.1;
    max-width: 80%;
  }
  section.min-statement p {
    color: #6b7280;
    font-size: 1.1em;
    margin-top: 0.5rem;
  }
  
  /* --- Minimal Statistics --- */
  .min-stat-box {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 1rem;
    flex-wrap: wrap;
  }
  .min-stat-box > div {
    text-align: center;
    min-width: 140px;
    flex: 1 1 calc(33.333% - 1.5rem);
    max-width: calc(50% - 1rem);
    padding: 1rem 1.5rem;
    border-bottom: 2px solid #111827;
  }
  .min-stat-number {
    font-size: 2.4em;
    font-weight: 800;
    color: #111827;
    line-height: 1.1;
  }
  .min-stat-label {
    font-size: 0.85em;
    color: #6b7280;
    margin-top: 0.3rem;
  }
  
  /* --- Minimal Highlight Box --- */
  .min-highlight {
    background: #111827;
    color: #ffffff;
    border-radius: 8px;
    padding: 2rem;
    text-align: center;
    margin: 1.5rem auto;
    max-width: 80%;
  }
  .min-highlight h3 {
    margin-top: 0;
    font-size: 1.3em;
    color: #ffffff;
  }
  .min-highlight p {
    margin-bottom: 0;
    font-size: 1.05em;
    color: rgba(255,255,255,0.85);
  }
  
  /* --- Minimal Pull Quote --- */
  section.min-pull-quote {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    background: #ffffff;
  }
  .min-pull-quote-wrap {
    max-width: 80%;
    position: relative;
    padding: 2rem 1rem;
  }
  .min-pull-quote-wrap::before {
    content: '\201C';
    font-size: 6em;
    color: rgba(17,24,39,0.08);
    position: absolute;
    top: -0.3em;
    left: -0.1em;
    line-height: 1;
    font-family: Georgia, serif;
  }
  .min-pull-quote-text {
    font-size: 1.6em;
    font-weight: 600;
    color: #111827;
    line-height: 1.3;
    font-style: italic;
  }
  .min-pull-quote-attr {
    font-size: 1em;
    color: #111827;
    margin-top: 0.8rem;
    font-weight: 600;
  }
  .min-pull-quote-ctx {
    font-size: 0.85em;
    color: #6b7280;
    margin-top: 0.3rem;
  }
  
  /* --- Minimal Image Caption --- */
  .min-image-caption {
    font-size: 0.8em;
    color: #6b7280;
    text-align: center;
    margin-top: 0.5rem;
  }
  
  /* --- Minimal Agenda --- */
  .min-agenda-subtitle {
    color: #6b7280;
    font-size: 0.9em;
    margin: -0.5rem 0 0.5rem 0;
  }
  .min-agenda {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  .min-agenda-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.6rem 0;
    border-bottom: 1px solid #e5e7eb;
  }
  .min-agenda-item:last-child {
    border-bottom: none;
  }
  .min-agenda-num {
    font-family: monospace;
    font-size: 1em;
    font-weight: 700;
    color: #111827;
    min-width: 2rem;
    flex-shrink: 0;
  }
  .min-agenda-title {
    flex: 1;
    font-size: 0.95em;
    color: #1f2937;
  }
  .min-agenda-dur {
    font-size: 0.8em;
    color: #6b7280;
    flex-shrink: 0;
    background: #f3f4f6;
    padding: 0.1rem 0.5rem;
    border-radius: 4px;
  }
  
  /* --- Minimal Comparison --- */
  .min-compare {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    margin-top: 0.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    overflow: hidden;
  }
  .min-compare-panel {
    padding: 1rem 1.2rem;
  }
  .min-compare-panel:first-child {
    border-right: 1px solid #e5e7eb;
  }
  .min-compare-title {
    font-size: 0.85em;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #374151;
    margin: 0 0 0.7rem 0;
    padding-bottom: 0.4rem;
    border-bottom: 2px solid #111827;
  }
  .min-compare-panel ul {
    margin: 0;
    padding-left: 1.2rem;
  }
  .min-compare-panel li {
    font-size: 0.9em;
    color: #374151;
    margin-bottom: 0.3rem;
  }
  
  section.img-fullscreen {
    padding: 0;
    background: #111;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  section.img-fullscreen img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  img[alt~="img-morph-1"] { view-transition-name: img-morph-1; }
  img[alt~="img-morph-2"] { view-transition-name: img-morph-2; }
---

<!-- layout: title -->
<!-- _class: min-title -->

# Welcome to the Future

A bold vision for modern presentations

---

<!-- layout: section -->
<!-- _class: min-section -->

## Part Two

Diving deeper into the details

---

<!-- layout: content -->
## Summary

This is a **free-form** markdown slide.

- Point one
- Point two
- Point three

---

<!-- layout: list -->
## Key Points

- Background context
- Insights discovered
- Next steps


<!-- _footer: Source: Sample Dataset -->

---

<!-- layout: table -->
<!-- _class: min-table -->

## Data Overview

| Item | Value |
| ---- | ----- |
| Alpha | 42 |
| Beta | 37 |
| Gamma | 58 |
| Delta | 21 |

Higher is better.

<!-- _footer: Source: Sample Stats -->

---

<!-- _class: img-fullscreen -->
<!-- _paginate: false -->
<!-- _header: "" -->
<!-- _footer: "" -->

![img-morph-1](https://picsum.photos/1280/720)

---

<!-- layout: image-right -->
## Architecture Diagram

<div class="min-split">

<div class="min-split-content">

- Ingest
- Process
- Serve

</div>

![img-morph-1](https://picsum.photos/1280/720)

</div>

<!-- _footer: Diagram credit: picsum.photos -->

---

<!-- _class: img-fullscreen -->
<!-- _paginate: false -->
<!-- _header: "" -->
<!-- _footer: "" -->

![img-morph-2](https://picsum.photos/1280/720)

---

<!-- layout: image-center -->
<!-- _class: min-img-center -->

## Workflow Snapshot

<div class="min-image-center-wrap">

![img-morph-2 h:380](https://picsum.photos/1280/720)

</div>

Step-by-step overview.

<!-- _footer: Figure 1 -->

---

<!-- layout: quote -->
<!-- _class: min-quote -->

> The best way to predict the future is to invent it.
>
> — Alan Kay

A guiding principle for innovation.

---

<!-- layout: two-column -->
## Comparison

<div class="min-2col">
<div class="min-2col-left">
<h3>Option A</h3><ul>
<li>Fast setup</li>
<li>Low cost</li>
<li>Community support</li>
</ul>
</div>
<div class="min-2col-right">
<h3>Option B</h3><ul>
<li>Enterprise features</li>
<li>SLA guarantee</li>
<li>Dedicated support</li>
</ul>
</div>
</div>

---

<!-- layout: big-statement -->
<!-- _class: min-statement -->

# Less is More

The power of simplicity in design

---

<!-- layout: statistics -->
## Impact at a Glance

<div class="min-stat-box">
<div>
<div class="min-stat-number">99.9%</div>
<div class="min-stat-label">Uptime</div>
</div>
<div>
<div class="min-stat-number">2.5M</div>
<div class="min-stat-label">Users</div>
</div>
<div>
<div class="min-stat-number">150ms</div>
<div class="min-stat-label">Avg Latency</div>
</div>
<div>
<div class="min-stat-number">4.8★</div>
<div class="min-stat-label">Rating</div>
</div>
</div>

<p style="text-align:center;color:#6b7280;font-size:0.9em;">Data as of Q4 2025</p>

---

<!-- layout: highlight-box -->
<div class="min-highlight">
<h3>Key Takeaway</h3>
<p>Simplicity and clarity are the foundations of effective communication.</p>
</div>

---

<!-- layout: pull-quote -->
<!-- _class: min-pull-quote -->

<div class="min-pull-quote-wrap">
<p class="min-pull-quote-text">Design is not just what it looks like. Design is how it works.</p>
<p class="min-pull-quote-attr">— Steve Jobs</p>
<p class="min-pull-quote-ctx">From a 2003 New York Times interview</p>
</div>

---

<!-- layout: agenda -->
## Today's Agenda

<div class="min-agenda">
<div class="min-agenda-item">
<span class="min-agenda-num">01</span>
<span class="min-agenda-title">Introduction</span>
<span class="min-agenda-dur">10 min</span>
</div>
<div class="min-agenda-item">
<span class="min-agenda-num">02</span>
<span class="min-agenda-title">Market Analysis</span>
<span class="min-agenda-dur">20 min</span>
</div>
<div class="min-agenda-item">
<span class="min-agenda-num">03</span>
<span class="min-agenda-title">Product Roadmap</span>
<span class="min-agenda-dur">30 min</span>
</div>
<div class="min-agenda-item">
<span class="min-agenda-num">04</span>
<span class="min-agenda-title">Q&A</span>
<span class="min-agenda-dur">15 min</span>
</div>
</div>

---

<!-- layout: comparison -->
## Method Comparison

<div class="min-compare">
<div class="min-compare-panel">
<h3 class="min-compare-title">Conventional Method</h3>
<ul>
<li>Manual feature extraction</li>
<li>Linear classifier</li>
<li>Limited scalability</li>
</ul>
</div>
<div class="min-compare-panel">
<h3 class="min-compare-title">Proposed Method</h3>
<ul>
<li>Automated feature learning</li>
<li>Deep neural network</li>
<li>Highly scalable</li>
</ul>
</div>
</div>
