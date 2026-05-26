---
marp: true
theme: default
header: Example Labs | default theme, academic style
paginate: true
transition: fade
style: |
  
  /* ===== Academic Style for Marp ===== */
  
  /* --- Page Number --- */
  section::after {
    font-size: 0.6em;
    color: #64748b;
  }
  
  /* --- Academic Title --- */
  section.acad-title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 2rem 3rem;
  }
  section.acad-title h1 {
    color: #800000;
    font-size: 2.2em;
    font-weight: 700;
    margin-bottom: 0.5em;
    border-bottom: 3px solid #800000;
    padding-bottom: 0.4em;
  }
  section.acad-title p {
    color: #475569;
    font-size: 1em;
    margin: 0.15em 0;
  }
  
  /* --- Academic Section --- */
  section.acad-section {
    background: #800000;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section.acad-section h2 {
    color: #ffffff;
    font-size: 2em;
    margin-bottom: 0.2em;
  }
  section.acad-section p {
    color: rgba(255,255,255,0.85);
    font-size: 1.1em;
  }
  section.acad-section span.acad-section-num {
    display: inline-block;
    font-size: 3em;
    font-weight: 700;
    color: rgba(255,255,255,0.3);
    margin-bottom: 0.1em;
  }
  
  /* --- Academic Header Bar (for content slides) --- */
  section h2 {
    color: #800000;
    font-weight: 700;
    border-bottom: 2px solid #800000;
    padding-bottom: 0.3rem;
    margin-bottom: 0.8rem;
  }
  
  /* --- Academic Table --- */
  section.acad-table table {
    border-collapse: collapse;
    width: 100%;
    margin: 0.8rem auto;
    font-size: 0.85em;
  }
  section.acad-table thead th {
    background: #800000;
    color: #ffffff;
    padding: 0.6rem 0.8rem;
    font-weight: 600;
    border: 1px solid #800000;
    text-align: left;
  }
  section.acad-table tbody td {
    padding: 0.5rem 0.8rem;
    color: #1e293b;
    border: 1px solid #dee2e6;
    text-align: left;
  }
  section.acad-table tbody tr:nth-child(even) {
    background: #f8f9fa;
  }
  
  /* --- Academic Two Column --- */
  .acad-2col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-top: 0.8rem;
  }
  .acad-2col-panel {
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-top: 3px solid #800000;
    border-radius: 6px;
    padding: 1rem;
  }
  .acad-2col-panel h3 {
    margin-top: 0;
    color: #800000;
    font-size: 1em;
    border-bottom: 1px solid #dee2e6;
    padding-bottom: 0.3rem;
    margin-bottom: 0.5rem;
  }
  .acad-2col-panel ul {
    margin: 0;
    padding-left: 1.2rem;
  }
  .acad-2col-panel li {
    margin-bottom: 0.25rem;
    color: #1e293b;
  }
  
  /* --- Academic Image Split --- */
  .acad-split {
    display: grid;
    grid-template-columns: 3fr 2fr;
    gap: 1.5rem;
    align-items: start;
    margin-top: 0.8rem;
  }
  .acad-split img {
    width: 100%;
    max-height: 380px;
    object-fit: contain;
    border-radius: 4px;
    border: 1px solid #dee2e6;
  }
  .acad-split-content ul {
    padding-left: 1.2rem;
  }
  .acad-split-content li {
    margin-bottom: 0.3rem;
    color: #1e293b;
  }
  
  /* --- Academic Image Center --- */
  section.acad-img-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .acad-image-center-wrap {
    text-align: center;
    margin-top: 0.8rem;
  }
  .acad-image-center-wrap img {
    max-height: 380px;
    object-fit: contain;
    border: 1px solid #dee2e6;
    border-radius: 4px;
  }
  
  /* --- Academic Figure Caption --- */
  .acad-figure {
    text-align: center;
    margin-top: 0.8rem;
  }
  .acad-figure img {
    max-height: 430px;
    object-fit: contain;
    border: 1px solid #dee2e6;
    border-radius: 4px;
  }
  .acad-figure-caption {
    font-size: 0.8em;
    color: #475569;
    margin-top: 0.5rem;
  }
  .acad-figure-caption strong {
    color: #800000;
  }
  
  /* --- Academic Key Message --- */
  .acad-key-message {
    background: #800000;
    color: #ffffff;
    border-radius: 8px;
    padding: 1.5rem 2rem;
    text-align: center;
    margin: 1rem auto;
    max-width: 85%;
  }
  .acad-key-message h3 {
    margin-top: 0;
    font-size: 1.2em;
    color: #ffffff;
    margin-bottom: 0.5rem;
  }
  .acad-key-message p {
    margin-bottom: 0;
    font-size: 1em;
    color: rgba(255,255,255,0.92);
  }
  .acad-key-note {
    font-size: 0.8em;
    color: #475569;
    text-align: center;
    margin-top: 0.8rem;
  }
  
  /* --- Academic Methodology --- */
  .acad-method-steps {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  .acad-method-row {
    display: flex;
    align-items: stretch;
    justify-content: center;
    gap: 0;
  }
  .acad-method-step {
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-top: 3px solid #800000;
    border-radius: 6px;
    padding: 0.8rem 1rem;
    text-align: center;
    flex: 1;
    min-width: 0;
  }
  .acad-method-step-label {
    font-weight: 600;
    color: #800000;
    line-height: 1.2;
  }
  .acad-method-step-desc {
    color: #475569;
    margin-top: 0.2rem;
  }
  .acad-method-arrow {
    font-size: 1.3em;
    color: #800000;
    padding: 0 0.3rem;
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
  
  /* --- Academic Comparison --- */
  .acad-comparison {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-top: 0.8rem;
  }
  .acad-comparison-panel {
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    padding: 1rem;
  }
  .acad-comparison-panel h3 {
    margin-top: 0;
    font-size: 1em;
    border-bottom: 1px solid #dee2e6;
    padding-bottom: 0.3rem;
    margin-bottom: 0.5rem;
  }
  .acad-comparison-panel:first-child h3 {
    color: #475569;
  }
  .acad-comparison-panel:last-child {
    border-top: 3px solid #800000;
  }
  .acad-comparison-panel:last-child h3 {
    color: #800000;
  }
  .acad-comparison-panel ul {
    margin: 0;
    padding-left: 1.2rem;
  }
  .acad-comparison-panel li {
    margin-bottom: 0.25rem;
    color: #1e293b;
  }
  
  /* --- Academic Citations (blockquote) --- */
  section blockquote {
    position: absolute;
    bottom: 30px;
    left: 40px;
    right: 40px;
    margin: 0;
    padding: 0;
    border: none;
    background: transparent;
    font-size: 0.55em;
    color: #64748b;
    line-height: 1.4;
  }
  section blockquote p {
    margin: 0;
    color: #64748b;
  }
  
  /* --- Academic Statistics --- */
  .acad-stat-box {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-top: 0.8rem;
    flex-wrap: wrap;
  }
  .acad-stat-box > div {
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-top: 3px solid #800000;
    border-radius: 6px;
    padding: 1rem 1.5rem;
    text-align: center;
    min-width: 130px;
    flex: 1 1 calc(33.333% - 1.5rem);
    max-width: calc(50% - 1rem);
  }
  .acad-stat-number {
    font-weight: 700;
    color: #800000;
    line-height: 1.1;
  }
  .acad-stat-label {
    color: #475569;
    margin-top: 0.3rem;
  }
  
  /* --- Academic Sidebar --- */
  .acad-sidebar-layout {
    display: grid;
    grid-template-columns: 3fr 1fr;
    gap: 1.5rem;
    margin-top: 0.8rem;
  }
  .acad-sidebar {
    border-left: 3px solid #800000;
    padding-left: 1rem;
  }
  .acad-sidebar h4 {
    margin-top: 0;
    color: #800000;
    font-size: 0.95em;
    margin-bottom: 0.5rem;
  }
  .acad-sidebar ul {
    padding-left: 1rem;
    margin: 0;
  }
  .acad-sidebar li {
    margin-bottom: 0.25rem;
    color: #475569;
  }
  
  /* --- Academic Results Table --- */
  .acad-results-table {
    border-collapse: collapse;
    width: 100%;
    margin: 0.5rem auto;
  }
  .acad-results-table thead th {
    background: #800000;
    color: #ffffff;
    padding: 0.6rem 0.8rem;
    font-weight: 600;
    border: 1px solid #800000;
    text-align: left;
  }
  .acad-results-table tbody td {
    padding: 0.5rem 0.8rem;
    color: #1e293b;
    border: 1px solid #dee2e6;
    text-align: left;
  }
  .acad-results-table tbody tr:nth-child(even) {
    background: #f8f9fa;
  }
  .acad-highlight-cell {
    font-weight: 700;
    color: #800000;
  }
  .acad-table-caption {
    font-size: 0.8em;
    color: #475569;
    text-align: center;
    margin-bottom: 0.3rem;
  }
  .acad-table-caption strong {
    color: #800000;
  }
  
  /* --- Academic Image Caption --- */
  .acad-image-caption {
    font-size: 0.8em;
    color: #475569;
    text-align: center;
    margin-top: 0.5rem;
  }
  
  section.img-fullscreen {
    padding: 0;
    background: #111;
    overflow: hidden;
  }
  section.img-fullscreen > p {
    position: absolute;
    inset: 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  section.img-fullscreen img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  img[alt~="img-morph-1"] { view-transition-name: img-morph-1; }
  img[alt~="img-morph-2"] { view-transition-name: img-morph-2; }
  img[title~="step"] {
    height: 1em;
    position: relative;
    top: -0.1em;
    vertical-align: middle;
    width: 1em;
  }
  img[alt="1"] { view-transition-name: step-1; }
---

<!-- layout: title -->
<!-- _class: acad-title -->

# Welcome to the Future

---

## Agenda

- ![1](https://icongr.am/material/numeric-1-circle.svg?color=666666 'step') Part Two

---

<!-- layout: section -->
<!-- _class: acad-section -->

![1 w:192 h:192](https://icongr.am/material/numeric-1-circle.svg?color=ffffff 'step')

## Part Two

Diving deeper into the details

---

<!-- layout: content -->
## Summary

<div class="acad-sidebar-layout">
<div class="acad-sidebar-main">

This is a **free-form** markdown slide.

- Point one
- Point two
- Point three

</div>
<div class="acad-sidebar" style="font-size: 0.8em">
<h4>Key Terms</h4>
<ul>
<li>API Gateway: Entry point</li>
<li>Event Bus: Async messaging</li>
<li>Service Mesh: Networking</li>
</ul>
</div>
</div>

---

<!-- layout: list -->
## Key Points

- Background context
- Insights discovered
- Next steps

> Source: Sample Dataset

---

<!-- layout: table -->
<!-- _class: acad-table -->

## Data Overview

| Item | Value |
| ---- | ----- |
| Alpha | 42 |
| Beta | 37 |
| Gamma | 58 |
| Delta | 21 |

Higher is better.

> Source: Sample Stats

---

<!-- layout: two-column -->
## Comparison

<div class="acad-2col">
<div class="acad-2col-panel">
<h3>Option A</h3>
<ul>
<li>Fast setup</li>
<li>Low cost</li>
<li>Community support</li>
</ul>
</div>
<div class="acad-2col-panel">
<h3>Option B</h3>
<ul>
<li>Enterprise features</li>
<li>SLA guarantee</li>
<li>Dedicated support</li>
</ul>
</div>
</div>

---

<!-- _class: img-fullscreen -->
<!-- _paginate: false -->
<!-- _header: "" -->
<!-- _footer: "" -->

![img-morph-1](https://picsum.photos/1280/720)

---

<!-- layout: image-right -->
## Architecture Diagram

<div class="acad-split">

<div class="acad-split-content">

- Ingest
- Process
- Serve

</div>

![img-morph-1](https://picsum.photos/1280/720)

</div>

> Diagram credit: picsum.photos

---

<!-- _class: img-fullscreen -->
<!-- _paginate: false -->
<!-- _header: "" -->
<!-- _footer: "" -->

![img-morph-2](https://picsum.photos/1280/720)

---

<!-- layout: image-center -->
<!-- _class: acad-img-center -->

## Workflow Snapshot

![img-morph-2 center h:430](https://picsum.photos/1280/720)

Step-by-step overview.

> Figure 1

---

<!-- layout: key-message -->
## Conclusions

<div class="acad-key-message">
<h3>Key Finding</h3>
<p>Our proposed method demonstrates a 35% improvement in accuracy compared to the baseline approach.</p>
</div>

<p class="acad-key-note">Further validation with larger datasets is recommended.</p>

---

<!-- layout: methodology -->
## Study Design

<div class="acad-method-steps">
<div class="acad-method-row">
<div class="acad-method-step">
<div class="acad-method-step-label" style="font-size: 0.9em">Recruitment</div>
<div class="acad-method-step-desc" style="font-size: 0.75em">N=120 participants</div>
</div>
<div class="acad-method-arrow">→</div>
<div class="acad-method-step">
<div class="acad-method-step-label" style="font-size: 0.9em">Randomization</div>
<div class="acad-method-step-desc" style="font-size: 0.75em">Double-blind RCT</div>
</div>
<div class="acad-method-arrow">→</div>
<div class="acad-method-step">
<div class="acad-method-step-label" style="font-size: 0.9em">Intervention</div>
<div class="acad-method-step-desc" style="font-size: 0.75em">12-week protocol</div>
</div>
</div>
<div class="acad-method-row">
<div class="acad-method-step">
<div class="acad-method-step-label" style="font-size: 0.9em">Assessment</div>
<div class="acad-method-step-desc" style="font-size: 0.75em">Pre/post measures</div>
</div>
<div class="acad-method-arrow">→</div>
<div class="acad-method-step">
<div class="acad-method-step-label" style="font-size: 0.9em">Analysis</div>
<div class="acad-method-step-desc" style="font-size: 0.75em">Mixed-effects model</div>
</div>
</div>
</div>

> Protocol registered: UMIN000012345

---

<!-- layout: statistics -->
## Impact at a Glance

<div class="acad-stat-box">
<div>
<div class="acad-stat-number" style="font-size: 2.2em">99.9%</div>
<div class="acad-stat-label" style="font-size: 0.8em">Uptime</div>
</div>
<div>
<div class="acad-stat-number" style="font-size: 2.2em">2.5M</div>
<div class="acad-stat-label" style="font-size: 0.8em">Users</div>
</div>
<div>
<div class="acad-stat-number" style="font-size: 2.2em">150ms</div>
<div class="acad-stat-label" style="font-size: 0.8em">Avg Latency</div>
</div>
<div>
<div class="acad-stat-number" style="font-size: 2.2em">4.8★</div>
<div class="acad-stat-label" style="font-size: 0.8em">Rating</div>
</div>
</div>

<p style="text-align:center;color:#475569;font-size:0.85em;">Data as of Q4 2025</p>
