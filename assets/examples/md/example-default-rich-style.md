---
marp: true
theme: default
header: Example Labs | default theme, rich style
paginate: true
transition: fade
style: |
  
  /* ===== Rich Style for Marp ===== */
  
  /* --- Utility Classes --- */
  .text-large { font-size: 1.3em; }
  .text-center { text-align: center; }
  
  /* --- Grid Layouts --- */
  .grid-2col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-top: 1rem;
  }
  .grid-3col {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1.2rem;
    margin-top: 1rem;
  }
  
  /* --- Panel --- */
  .panel {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 1.2rem;
  }
  .panel h3 {
    margin-top: 0;
    color: #1f2937;
    font-size: 1.1em;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 0.4rem;
  }
  .panel ul {
    margin: 0.5rem 0 0 0;
    padding-left: 1.2rem;
  }
  .panel li {
    margin-bottom: 0.3rem;
    color: #374151;
  }
  .panel-accent {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    border: none;
    color: #fff;
  }
  .panel-accent h3 {
    color: #fff;
    border-bottom-color: rgba(255,255,255,0.3);
  }
  .panel-accent li {
    color: rgba(255,255,255,0.95);
  }
  
  /* --- Image Split --- */
  .image-split {
    display: grid;
    grid-template-columns: 2fr 3fr;
    gap: 1.5rem;
    align-items: center;
    margin-top: 1rem;
  }
  .image-split img {
    width: 100%;
    border-radius: 12px;
    object-fit: cover;
  }
  .split-content ul {
    padding-left: 1.2rem;
  }
  .split-content li {
    margin-bottom: 0.4rem;
    color: #374151;
  }
  
  /* --- Card Grid --- */
  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }
  .card {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 1.2rem;
    text-align: center;
    transition: box-shadow 0.2s;
  }
  .card-icon {
    font-size: 2em;
    margin-bottom: 0.5rem;
  }
  .card h4 {
    margin: 0.3rem 0;
    color: #1f2937;
    font-size: 1em;
  }
  .card p {
    margin: 0;
    color: #4b5563;
    font-size: 0.85em;
  }
  
  /* --- Timeline --- */
  .timeline {
    position: relative;
    padding-left: 36px;
    margin-top: 1rem;
  }
  .timeline::before {
    content: '';
    position: absolute;
    left: 13px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, #3b82f6 0%, #10b981 100%);
    border-radius: 2px;
  }
  .timeline-item {
    position: relative;
    margin-bottom: 1.2rem;
  }
  .timeline-item::before {
    content: '';
    position: absolute;
    left: -29px;
    top: 0.4em;
    width: 10px;
    height: 10px;
    background: #3b82f6;
    border-radius: 50%;
    border: 2px solid #fff;
    box-shadow: 0 0 0 2px #3b82f6;
  }
  .timeline-item strong {
    color: #1f2937;
  }
  .timeline-item span {
    color: #4b5563;
    margin-left: 0.3rem;
  }
  
  /* --- Highlight Box --- */
  .highlight-box {
    background: linear-gradient(135deg, #3b82f6 0%, #10b981 100%);
    color: #fff;
    border-radius: 16px;
    padding: 2rem;
    text-align: center;
    margin: 1.5rem auto;
    max-width: 80%;
  }
  .highlight-box h3 {
    margin-top: 0;
    font-size: 1.3em;
    color: #fff;
  }
  .highlight-box p {
    margin-bottom: 0;
    font-size: 1.05em;
    color: rgba(255,255,255,0.95);
  }
  
  /* --- Statistics --- */
  .stat-box {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 1rem;
    flex-wrap: wrap;
  }
  .stat-box > div {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 1.2rem 2rem;
    text-align: center;
    min-width: 140px;
    flex: 1 1 calc(33.333% - 1.5rem);
    max-width: calc(50% - 1rem);
  }
  .stat-number {
    font-size: 2.2em;
    font-weight: 700;
    color: #3b82f6;
    line-height: 1.1;
  }
  .stat-label {
    font-size: 0.85em;
    color: #4b5563;
    margin-top: 0.3rem;
  }
  .stat-trend {
    font-size: 0.75em;
    color: #10b981;
    margin-top: 0.2rem;
  }
  
  /* --- Section Backgrounds --- */
  section.bg-gradient {
    background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 50%, #10b981 100%);
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section.bg-gradient h1,
  section.bg-gradient h2 {
    color: #fff;
    text-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }
  section.bg-gradient p {
    color: rgba(255,255,255,0.9);
    font-size: 1.2em;
  }
  
  /* --- Title Hero --- */
  section.title-hero {
    background: linear-gradient(135deg, #1f2937 0%, #374151 50%, #1f2937 100%);
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section.title-hero h1 {
    color: #fff;
    font-size: 2.5em;
    text-shadow: 0 2px 12px rgba(0,0,0,0.3);
    margin-bottom: 0.3em;
  }
  section.title-hero p {
    color: rgba(255,255,255,0.8);
    font-size: 1.3em;
  }
  
  /* --- Rich Table --- */
  section.rich-table {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  section.rich-table h2 {
    text-align: center;
  }
  section.rich-table table {
    border-collapse: collapse;
    width: auto;
    margin: 1rem auto;
    font-size: 0.85em;
  }
  section.rich-table thead th {
    background: #3b82f6;
    color: #fff;
    padding: 0.7rem 1rem;
    font-weight: 600;
    border: 1px solid #3b82f6;
  }
  section.rich-table tbody tr:nth-child(even) {
    background: #f0f7ff;
  }
  section.rich-table tbody td {
    padding: 0.6rem 1rem;
    color: #374151;
    border: 1px solid #e5e7eb;
  }
  
  /* --- Rich Image Right --- */
  section.rich-image-right .image-split {
    grid-template-columns: 3fr 2fr;
  }
  
  /* --- Rich Image Center --- */
  section.rich-image-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .image-center-wrap {
    text-align: center;
    margin-top: 1rem;
  }
  .image-center-wrap img {
    max-height: 400px;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.12);
    object-fit: contain;
  }
  
  /* --- Image Comparison --- */
  .image-comparison {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-top: 1rem;
  }
  .comparison-item {
    text-align: center;
  }
  .comparison-item img {
    width: 100%;
    border-radius: 12px;
    object-fit: contain;
  }
  .comparison-label {
    margin-top: 0.5rem;
    font-weight: 600;
    color: #374151;
    font-size: 0.95em;
  }
  
  /* --- Process Steps --- */
  .process-steps {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    margin-top: 1.5rem;
    flex-wrap: nowrap;
  }
  .process-step {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 1rem 1.2rem;
    text-align: center;
    flex: 1;
    min-width: 0;
  }
  .process-step-number {
    font-size: 1.4em;
    font-weight: 700;
    color: #3b82f6;
    line-height: 1.2;
  }
  .process-step-label {
    font-size: 0.85em;
    color: #374151;
    margin-top: 0.3rem;
  }
  .process-arrow {
    font-size: 1.5em;
    color: #3b82f6;
    padding: 0 0.4rem;
    flex-shrink: 0;
  }
  
  /* --- Rich Quote --- */
  section.rich-quote {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  section.rich-quote blockquote {
    border-left: 4px solid #3b82f6;
    padding: 1.5rem 2rem;
    margin: 1rem auto;
    max-width: 80%;
    background: #f9fafb;
    border-radius: 0 12px 12px 0;
    font-size: 1.2em;
    font-style: italic;
    color: #374151;
  }
  section.rich-quote blockquote p:last-child {
    font-style: normal;
    font-size: 0.85em;
    color: #6b7280;
    margin-top: 0.5rem;
  }
  
  /* --- Rich Two Column (Simple) --- */
  .rich-2col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-top: 1rem;
  }
  .rich-2col-left {
    border-right: 2px solid #e5e7eb;
    padding-right: 1.5rem;
  }
  .rich-2col-right {
    padding-left: 0.5rem;
  }
  .rich-2col h3 {
    color: #1f2937;
    font-size: 1.05em;
    margin-top: 0;
    margin-bottom: 0.5rem;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 0.3rem;
  }
  .rich-2col ul {
    padding-left: 1.2rem;
    margin: 0;
  }
  .rich-2col li {
    margin-bottom: 0.3rem;
    color: #374151;
  }
  
  /* --- Rich Big Statement --- */
  section.rich-statement {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  }
  section.rich-statement h1 {
    color: #ffffff;
    font-size: 2.8em;
    font-weight: 800;
    line-height: 1.1;
    max-width: 80%;
    text-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }
  section.rich-statement p {
    color: rgba(255,255,255,0.75);
    font-size: 1.1em;
    margin-top: 0.5rem;
  }
  
  /* --- Rich Sidebar --- */
  .rich-sidebar-layout {
    display: grid;
    grid-template-columns: 3fr 1fr;
    gap: 1.5rem;
    margin-top: 1rem;
  }
  .rich-sidebar {
    border-left: 3px solid #3b82f6;
    padding-left: 1rem;
    font-size: 0.85em;
  }
  .rich-sidebar h4 {
    margin-top: 0;
    color: #3b82f6;
    font-size: 0.95em;
    margin-bottom: 0.5rem;
  }
  .rich-sidebar ul {
    padding-left: 1rem;
    margin: 0;
  }
  .rich-sidebar li {
    margin-bottom: 0.3rem;
    color: #4b5563;
  }
  
  /* --- Rich Progress Bar --- */
  .progress-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
  }
  .progress-item {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
  .progress-header {
    display: flex;
    justify-content: space-between;
    font-size: 0.9em;
  }
  .progress-label {
    font-weight: 600;
    color: #1f2937;
  }
  .progress-value {
    color: #6b7280;
  }
  .progress-track {
    height: 12px;
    background: #e5e7eb;
    border-radius: 6px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #3b82f6, #10b981);
    border-radius: 6px;
  }
  
  /* --- Rich Chart Bar --- */
  .chart-bar-container {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    margin-top: 1rem;
  }
  .chart-bar-row {
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }
  .chart-bar-label {
    width: 120px;
    flex-shrink: 0;
    font-size: 0.85em;
    font-weight: 600;
    color: #1f2937;
    text-align: right;
  }
  .chart-bar-track {
    flex: 1;
    height: 24px;
    background: #f3f4f6;
    border-radius: 4px;
    overflow: hidden;
  }
  .chart-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #3b82f6, #60a5fa);
    border-radius: 4px;
  }
  .chart-bar-value {
    width: 50px;
    flex-shrink: 0;
    font-size: 0.85em;
    font-weight: 600;
    color: #3b82f6;
  }
  
  /* --- Rich Horizontal Timeline --- */
  .h-timeline {
    position: relative;
    margin-top: 2rem;
  }
  .h-timeline-line {
    position: absolute;
    top: 9px;
    left: 5%;
    right: 5%;
    height: 3px;
    background: linear-gradient(90deg, #3b82f6, #10b981);
    border-radius: 2px;
  }
  .h-timeline-items {
    display: flex;
    justify-content: space-around;
    position: relative;
  }
  .h-timeline-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 150px;
  }
  .h-timeline-dot {
    width: 14px;
    height: 14px;
    background: #3b82f6;
    border: 3px solid #fff;
    border-radius: 50%;
    box-shadow: 0 0 0 2px #3b82f6;
    margin-bottom: 0.8rem;
    flex-shrink: 0;
  }
  .h-timeline-item strong {
    font-size: 0.85em;
    color: #1f2937;
  }
  .h-timeline-item span {
    font-size: 0.75em;
    color: #6b7280;
    margin-top: 0.2rem;
  }
  
  /* --- Rich Pull Quote --- */
  section.rich-pull-quote {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  .pull-quote-wrap {
    max-width: 80%;
    position: relative;
    padding: 2rem 1rem;
  }
  .pull-quote-wrap::before {
    content: '\201C';
    font-size: 6em;
    color: rgba(59,130,246,0.15);
    position: absolute;
    top: -0.3em;
    left: -0.1em;
    line-height: 1;
    font-family: Georgia, serif;
  }
  .pull-quote-text {
    font-size: 1.6em;
    font-weight: 600;
    color: #1f2937;
    line-height: 1.3;
    font-style: italic;
  }
  .pull-quote-attr {
    font-size: 1em;
    color: #3b82f6;
    margin-top: 0.8rem;
    font-weight: 600;
  }
  .pull-quote-ctx {
    font-size: 0.85em;
    color: #6b7280;
    margin-top: 0.3rem;
  }
  
  /* --- Rich Bento Grid --- */
  .bento-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-flow: dense;
    gap: 0.8rem;
    margin-top: 1rem;
  }
  .bento-cell {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 1rem;
  }
  .bento-cell h4 {
    margin: 0 0 0.3rem 0;
    color: #1f2937;
    font-size: 0.95em;
  }
  .bento-cell p {
    margin: 0;
    color: #4b5563;
    font-size: 0.8em;
  }
  .bento-sm {
    grid-column: span 1;
    grid-row: span 1;
  }
  .bento-md {
    grid-column: span 2;
    grid-row: span 1;
  }
  .bento-lg {
    grid-column: span 2;
    grid-row: span 2;
  }
  
  /* --- Card Grid Improvement --- */
  .card-icon {
    width: 2.5em;
    height: 2.5em;
    line-height: 2.5em;
    border-radius: 50%;
    background: rgba(59,130,246,0.1);
    display: inline-block;
    margin-bottom: 0.5rem;
  }
  .card {
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }
  
  /* --- Image Caption --- */
  .image-caption {
    font-size: 0.8em;
    color: #6b7280;
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
---

<!-- layout: title -->
<!-- _class: title-hero -->

# Welcome to the Future

A bold vision for modern presentations

---

<!-- layout: section -->
<!-- _class: bg-gradient -->

## Part Two

Diving deeper into the details

---

<!-- layout: list -->
## Key Points

- Background context
- Insights discovered
- Next steps


<!-- _footer: Source: Sample Dataset -->

---

<!-- layout: table -->
<!-- _class: rich-table -->

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
<!-- _class: rich-image-right -->

## Architecture Diagram

<div class="image-split">

<div class="split-content">

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
<!-- _class: rich-image-center -->

## Workflow Snapshot

<div class="image-center-wrap">

![img-morph-2 h:400](https://picsum.photos/1280/720)

</div>

Step-by-step overview.

<!-- _footer: Figure 1 -->

---

<!-- layout: image-split -->
## Visual Overview

<div class="image-split">

![](https://picsum.photos/1280/720)

<div class="split-content">

- Clear structure
- Engaging visuals
- Concise messaging

</div>
</div>

---

<!-- layout: timeline -->
## Project Milestones

<div class="timeline">
<div class="timeline-item">
<strong>Q1 2025</strong> <span>Research & Discovery</span>
</div>
<div class="timeline-item">
<strong>Q2 2025</strong> <span>Prototype Development</span>
</div>
<div class="timeline-item">
<strong>Q3 2025</strong> <span>Beta Launch</span>
</div>
<div class="timeline-item">
<strong>Q4 2025</strong> <span>General Availability</span>
</div>
</div>

---

<!-- layout: card-grid -->
## Core Capabilities

<div class="card-grid">
<div class="card">
<div class="card-icon">🚀</div>
<h4>Performance</h4>
<p>Blazing fast response times</p>
</div>
<div class="card">
<div class="card-icon">🔒</div>
<h4>Security</h4>
<p>Enterprise-grade protection</p>
</div>
<div class="card">
<div class="card-icon">📊</div>
<h4>Analytics</h4>
<p>Real-time insights dashboard</p>
</div>
<div class="card">
<div class="card-icon">🔌</div>
<h4>Integration</h4>
<p>Connect with any platform</p>
</div>
</div>

---

<!-- layout: statistics -->
## Impact at a Glance

<div class="stat-box">
<div>
<div class="stat-number">99.9%</div>
<div class="stat-label">Uptime</div>
</div>
<div>
<div class="stat-number">2.5M</div>
<div class="stat-label">Users</div>
</div>
<div>
<div class="stat-number">150ms</div>
<div class="stat-label">Avg Latency</div>
</div>
<div>
<div class="stat-number">4.8★</div>
<div class="stat-label">Rating</div>
</div>
</div>

<p class="text-center">Data as of Q4 2025</p>

---

<!-- layout: highlight-box -->
<div class="highlight-box">
<h3>Key Takeaway</h3>
<p>Simplicity and clarity are the foundations of effective communication.</p>
</div>

---

<!-- layout: two-column-panel -->
## Plan Comparison

<div class="grid-2col">
<div class="panel">
<h3>Free Tier</h3>
<ul>
<li>5 projects</li>
<li>Community support</li>
<li>Basic analytics</li>
</ul>
</div>
<div class="panel panel-accent">
<h3>Pro Tier</h3>
<ul>
<li>Unlimited projects</li>
<li>Priority support</li>
<li>Advanced analytics</li>
</ul>
</div>
</div>

---

<!-- layout: three-column-panel -->
## Our Process

<div class="grid-3col">
<div class="panel">
<h3>Discover</h3>
<p>We research your needs and goals</p>
</div>
<div class="panel">
<h3>Design</h3>
<p>We craft a tailored solution</p>
</div>
<div class="panel">
<h3>Deliver</h3>
<p>We ship and iterate together</p>
</div>
</div>

---

<!-- layout: image-comparison -->
## Before & After

<div class="image-comparison">
<div class="comparison-item">

![](https://picsum.photos/1280/720)

<p class="comparison-label">Before</p>
</div>
<div class="comparison-item">

![](https://picsum.photos/1280/720)

<p class="comparison-label">After</p>
</div>
</div>

---

<!-- layout: content -->
## Summary

This is a **free-form** markdown slide.

- Point one
- Point two
- Point three

---

<!-- layout: quote -->
<!-- _class: rich-quote -->

> The best way to predict the future is to invent it.
>
> — Alan Kay

A guiding principle for innovation.

---

<!-- layout: process -->
## Development Workflow

<div class="process-steps">
<div class="process-step">
<div class="process-step-number">1</div>
<div class="process-step-label">Plan</div>
</div>
<div class="process-arrow">→</div>
<div class="process-step">
<div class="process-step-number">2</div>
<div class="process-step-label">Develop</div>
</div>
<div class="process-arrow">→</div>
<div class="process-step">
<div class="process-step-number">3</div>
<div class="process-step-label">Test</div>
</div>
<div class="process-arrow">→</div>
<div class="process-step">
<div class="process-step-number">4</div>
<div class="process-step-label">Deploy</div>
</div>
</div>

---

<!-- layout: two-column -->
## Comparison

<div class="rich-2col">
<div class="rich-2col-left">
<h3>Option A</h3>
<ul>
<li>Fast setup</li>
<li>Low cost</li>
<li>Community support</li>
</ul>
</div>
<div class="rich-2col-right">
<h3>Option B</h3>
<ul>
<li>Enterprise features</li>
<li>SLA guarantee</li>
<li>Dedicated support</li>
</ul>
</div>
</div>

---

<!-- layout: big-statement -->
<!-- _class: rich-statement -->

# Less is More

The power of simplicity in design

---

<!-- layout: sidebar -->
## Architecture Overview

<div class="rich-sidebar-layout">
<div class="rich-sidebar-main">

The system uses a **microservices** architecture with event-driven communication.

- API Gateway handles routing
- Each service owns its data

</div>
<div class="rich-sidebar">
<h4>Key Terms</h4>
<ul>
<li>API Gateway: Entry point</li>
<li>Event Bus: Async messaging</li>
<li>Service Mesh: Networking</li>
</ul>
</div>
</div>

---

<!-- layout: progress-bar -->
## Project Completion

<div class="progress-container">
<div class="progress-item">
<div class="progress-header"><span class="progress-label">Frontend</span><span class="progress-value">85/100</span></div>
<div class="progress-track"><div class="progress-fill" style="width:85%"></div></div>
</div>
<div class="progress-item">
<div class="progress-header"><span class="progress-label">Backend</span><span class="progress-value">70/100</span></div>
<div class="progress-track"><div class="progress-fill" style="width:70%"></div></div>
</div>
<div class="progress-item">
<div class="progress-header"><span class="progress-label">Testing</span><span class="progress-value">45/100</span></div>
<div class="progress-track"><div class="progress-fill" style="width:45%"></div></div>
</div>
<div class="progress-item">
<div class="progress-header"><span class="progress-label">Documentation</span><span class="progress-value">30/100</span></div>
<div class="progress-track"><div class="progress-fill" style="width:30%"></div></div>
</div>
</div>

<p class="text-center">Updated weekly</p>

---

<!-- layout: chart-bar -->
## Revenue by Region

<div class="chart-bar-container">
<div class="chart-bar-row">
<span class="chart-bar-label">North America</span>
<div class="chart-bar-track"><div class="chart-bar-fill" style="width:100%"></div></div>
<span class="chart-bar-value">450</span>
</div>
<div class="chart-bar-row">
<span class="chart-bar-label">Europe</span>
<div class="chart-bar-track"><div class="chart-bar-fill" style="width:84%"></div></div>
<span class="chart-bar-value">380</span>
</div>
<div class="chart-bar-row">
<span class="chart-bar-label">Asia Pacific</span>
<div class="chart-bar-track"><div class="chart-bar-fill" style="width:64%"></div></div>
<span class="chart-bar-value">290</span>
</div>
<div class="chart-bar-row">
<span class="chart-bar-label">Latin America</span>
<div class="chart-bar-track"><div class="chart-bar-fill" style="width:27%"></div></div>
<span class="chart-bar-value">120</span>
</div>
</div>

<p class="text-center">In millions USD, FY2025</p>

---

<!-- layout: timeline-horizontal -->
## Product Roadmap

<div class="h-timeline">
<div class="h-timeline-line"></div>
<div class="h-timeline-items">
<div class="h-timeline-item">
<div class="h-timeline-dot"></div>
<strong>Q1</strong>
<span>Research Phase</span>
</div>
<div class="h-timeline-item">
<div class="h-timeline-dot"></div>
<strong>Q2</strong>
<span>Alpha Release</span>
</div>
<div class="h-timeline-item">
<div class="h-timeline-dot"></div>
<strong>Q3</strong>
<span>Beta Launch</span>
</div>
<div class="h-timeline-item">
<div class="h-timeline-dot"></div>
<strong>Q4</strong>
<span>General Availability</span>
</div>
</div>
</div>

---

<!-- layout: pull-quote -->
<!-- _class: rich-pull-quote -->

<div class="pull-quote-wrap">
<p class="pull-quote-text">Design is not just what it looks like. Design is how it works.</p>
<p class="pull-quote-attr">— Steve Jobs</p>
<p class="pull-quote-ctx">From a 2003 New York Times interview</p>
</div>

---

<!-- layout: bento-grid -->
## Feature Highlights

<div class="bento-grid">
<div class="bento-cell bento-lg">
<h4>Real-time Analytics</h4>
<p>Monitor your data with live dashboards</p>
</div>
<div class="bento-cell bento-sm">
<h4>Fast</h4>
<p>Sub-100ms responses</p>
</div>
<div class="bento-cell bento-sm">
<h4>Secure</h4>
<p>Enterprise-grade encryption</p>
</div>
<div class="bento-cell bento-md">
<h4>Easy Integration</h4>
<p>Connect with 50+ services out of the box</p>
</div>
</div>
