---
marp: true
theme: default
header: Example Labs | default theme, corporate style
paginate: true
transition: fade
style: |
  
  /* ===== Corporate Style for Marp ===== */
  
  /* --- Corporate Title --- */
  section.corp-title {
    background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #1d4ed8 100%);
    color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section.corp-title h1 {
    color: #ffffff;
    font-size: 2.4em;
    font-weight: 700;
    margin-bottom: 0.3em;
    text-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }
  section.corp-title p {
    color: rgba(255,255,255,0.85);
    font-size: 1.15em;
  }
  
  /* --- Corporate Section --- */
  section.corp-section {
    background: linear-gradient(135deg, #1e3a8a 0%, #0ea5e9 100%);
    color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section.corp-section h2 {
    color: #ffffff;
    font-size: 2em;
  }
  section.corp-section p {
    color: rgba(255,255,255,0.85);
  }
  
  /* --- Corporate Table --- */
  section.corp-table table {
    border-collapse: collapse;
    width: 100%;
    margin: 1rem auto;
    font-size: 0.9em;
  }
  section.corp-table thead th {
    background: #1e3a8a;
    color: #ffffff;
    padding: 0.7rem 1rem;
    font-weight: 600;
    border: 1px solid #1e3a8a;
    text-align: left;
  }
  section.corp-table tbody td {
    padding: 0.6rem 1rem;
    color: #1e293b;
    border: 1px solid #cbd5e1;
    text-align: left;
  }
  section.corp-table tbody tr:nth-child(even) {
    background: #f8fafc;
  }
  
  /* --- Corporate Two Column --- */
  .corp-2col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-top: 1rem;
  }
  .corp-2col-panel {
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-top: 3px solid #1e3a8a;
    border-radius: 8px;
    padding: 1.2rem;
  }
  .corp-2col-panel h3 {
    margin-top: 0;
    color: #1e3a8a;
    font-size: 1.05em;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 0.4rem;
    margin-bottom: 0.6rem;
  }
  .corp-2col-panel ul {
    margin: 0;
    padding-left: 1.2rem;
  }
  .corp-2col-panel li {
    margin-bottom: 0.3rem;
    color: #334155;
  }
  
  /* --- Corporate Three Column --- */
  .corp-3col {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1.2rem;
    margin-top: 1rem;
  }
  .corp-3col-panel {
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-top: 3px solid #0ea5e9;
    border-radius: 8px;
    padding: 1rem;
  }
  .corp-3col-panel h3 {
    margin-top: 0;
    color: #1e3a8a;
    font-size: 0.95em;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 0.3rem;
    margin-bottom: 0.5rem;
  }
  .corp-3col-panel ul {
    margin: 0;
    padding-left: 1.1rem;
  }
  .corp-3col-panel li {
    margin-bottom: 0.3rem;
    color: #334155;
    font-size: 0.9em;
  }
  
  /* --- Corporate Statistics --- */
  .corp-stat-box {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-top: 1rem;
    flex-wrap: wrap;
  }
  .corp-stat-box > div {
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-top: 3px solid #1e3a8a;
    border-radius: 8px;
    padding: 1.2rem 2rem;
    text-align: center;
    min-width: 140px;
    flex: 1 1 calc(33.333% - 1.5rem);
    max-width: calc(50% - 1rem);
  }
  .corp-stat-number {
    font-size: 2.2em;
    font-weight: 700;
    color: #1e3a8a;
    line-height: 1.1;
  }
  .corp-stat-label {
    font-size: 0.85em;
    color: #475569;
    margin-top: 0.3rem;
  }
  .corp-stat-trend {
    font-size: 0.75em;
    color: #0ea5e9;
    margin-top: 0.2rem;
  }
  
  /* --- Corporate Process --- */
  .corp-process-steps {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    margin-top: 1.5rem;
    flex-wrap: nowrap;
  }
  .corp-process-step {
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 1rem 1.2rem;
    text-align: center;
    flex: 1;
    min-width: 0;
  }
  .corp-process-step-number {
    font-size: 1.4em;
    font-weight: 700;
    color: #1e3a8a;
    line-height: 1.2;
  }
  .corp-process-step-label {
    font-size: 0.85em;
    color: #334155;
    margin-top: 0.3rem;
  }
  .corp-process-arrow {
    font-size: 1.3em;
    color: #0ea5e9;
    padding: 0 0.4rem;
    flex-shrink: 0;
  }
  
  /* --- Corporate Agenda --- */
  .corp-agenda {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    margin-top: 1rem;
  }
  .corp-agenda-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-left: 4px solid #1e3a8a;
    border-radius: 0 8px 8px 0;
    padding: 0.7rem 1rem;
  }
  .corp-agenda-num {
    font-size: 1.4em;
    font-weight: 700;
    color: #1e3a8a;
    min-width: 2.2rem;
    text-align: center;
  }
  .corp-agenda-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }
  .corp-agenda-content strong {
    color: #1e293b;
    font-size: 1em;
  }
  .corp-agenda-dur {
    color: #64748b;
    font-size: 0.85em;
    white-space: nowrap;
  }
  
  /* --- Corporate Image Right --- */
  .corp-split {
    display: grid;
    grid-template-columns: 3fr 2fr;
    gap: 1.5rem;
    align-items: center;
    margin-top: 1rem;
  }
  .corp-split img {
    width: 100%;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
  }
  .corp-split-content ul {
    padding-left: 1.2rem;
  }
  .corp-split-content li {
    margin-bottom: 0.4rem;
    color: #334155;
  }
  
  /* --- Corporate Highlight Box --- */
  .corp-highlight {
    background: linear-gradient(135deg, #1e3a8a 0%, #0ea5e9 100%);
    color: #ffffff;
    border-radius: 12px;
    padding: 2rem;
    text-align: center;
    margin: 1.5rem auto;
    max-width: 80%;
  }
  .corp-highlight h3 {
    margin-top: 0;
    font-size: 1.3em;
    color: #ffffff;
  }
  .corp-highlight p {
    margin-bottom: 0;
    font-size: 1.05em;
    color: rgba(255,255,255,0.9);
  }
  
  /* --- Corporate Quote --- */
  section.corp-quote {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  section.corp-quote blockquote {
    border-left: 4px solid #1e3a8a;
    padding: 1.5rem 2rem;
    margin: 1rem auto;
    max-width: 80%;
    background: #f8fafc;
    border-radius: 0 8px 8px 0;
    font-size: 1.2em;
    font-style: italic;
    color: #334155;
  }
  section.corp-quote blockquote p:last-child {
    font-style: normal;
    font-size: 0.85em;
    color: #64748b;
    margin-top: 0.5rem;
  }
  
  /* --- Corporate Image Center --- */
  section.corp-img-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .corp-image-center-wrap {
    text-align: center;
    margin-top: 1rem;
  }
  .corp-image-center-wrap img {
    max-height: 400px;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
    object-fit: contain;
  }
  
  /* --- Corporate Big Statement --- */
  section.corp-statement {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    background: linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%);
  }
  section.corp-statement h1 {
    color: #ffffff;
    font-size: 2.8em;
    font-weight: 700;
    line-height: 1.1;
    max-width: 80%;
  }
  section.corp-statement p {
    color: rgba(255,255,255,0.85);
    font-size: 1.1em;
    margin-top: 0.5rem;
  }
  
  /* --- Corporate Sidebar --- */
  .corp-sidebar-layout {
    display: grid;
    grid-template-columns: 3fr 1fr;
    gap: 1.5rem;
    margin-top: 1rem;
  }
  .corp-sidebar {
    border-left: 3px solid #1e3a8a;
    padding-left: 1rem;
    font-size: 0.85em;
  }
  .corp-sidebar h4 {
    margin-top: 0;
    color: #1e3a8a;
    font-size: 0.95em;
    margin-bottom: 0.5rem;
  }
  .corp-sidebar ul {
    padding-left: 1rem;
    margin: 0;
  }
  .corp-sidebar li {
    margin-bottom: 0.3rem;
    color: #475569;
  }
  
  /* --- Corporate Progress Bar --- */
  .corp-progress-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
  }
  .corp-progress-item {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
  .corp-progress-header {
    display: flex;
    justify-content: space-between;
    font-size: 0.9em;
  }
  .corp-progress-label {
    font-weight: 600;
    color: #1e293b;
  }
  .corp-progress-value {
    color: #64748b;
  }
  .corp-progress-track {
    height: 12px;
    background: #e2e8f0;
    border-radius: 6px;
    overflow: hidden;
  }
  .corp-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #1e3a8a, #0ea5e9);
    border-radius: 6px;
  }
  
  /* --- Corporate Chart Bar --- */
  .corp-chart-bar-container {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    margin-top: 1rem;
  }
  .corp-chart-bar-row {
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }
  .corp-chart-bar-label {
    width: 120px;
    flex-shrink: 0;
    font-size: 0.85em;
    font-weight: 600;
    color: #1e293b;
    text-align: right;
  }
  .corp-chart-bar-track {
    flex: 1;
    height: 24px;
    background: #e2e8f0;
    border-radius: 4px;
    overflow: hidden;
  }
  .corp-chart-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #1e3a8a, #3b82f6);
    border-radius: 4px;
  }
  .corp-chart-bar-value {
    width: 50px;
    flex-shrink: 0;
    font-size: 0.85em;
    font-weight: 600;
    color: #1e3a8a;
  }
  
  /* --- Corporate Pull Quote --- */
  section.corp-pull-quote {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  .corp-pull-quote-wrap {
    max-width: 80%;
    position: relative;
    padding: 2rem 1rem;
  }
  .corp-pull-quote-wrap::before {
    content: '\201C';
    font-size: 6em;
    color: rgba(30,58,138,0.1);
    position: absolute;
    top: -0.3em;
    left: -0.1em;
    line-height: 1;
    font-family: Georgia, serif;
  }
  .corp-pull-quote-text {
    font-size: 1.6em;
    font-weight: 600;
    color: #1e293b;
    line-height: 1.3;
    font-style: italic;
  }
  .corp-pull-quote-attr {
    font-size: 1em;
    color: #1e3a8a;
    margin-top: 0.8rem;
    font-weight: 600;
  }
  .corp-pull-quote-ctx {
    font-size: 0.85em;
    color: #64748b;
    margin-top: 0.3rem;
  }
  
  /* --- Corporate Quadrant --- */
  .corp-quadrant {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 0.8rem;
    margin-top: 1rem;
  }
  .corp-quad {
    border-radius: 8px;
    padding: 1rem;
  }
  .corp-quad h4 {
    margin: 0 0 0.5rem 0;
    font-size: 0.95em;
  }
  .corp-quad ul {
    margin: 0;
    padding-left: 1.1rem;
  }
  .corp-quad li {
    margin-bottom: 0.2rem;
    font-size: 0.85em;
    color: #334155;
  }
  .corp-quad-tl {
    background: #dbeafe;
    border: 1px solid #93c5fd;
  }
  .corp-quad-tl h4 { color: #1e3a8a; }
  .corp-quad-tr {
    background: #dcfce7;
    border: 1px solid #86efac;
  }
  .corp-quad-tr h4 { color: #166534; }
  .corp-quad-bl {
    background: #fef3c7;
    border: 1px solid #fcd34d;
  }
  .corp-quad-bl h4 { color: #92400e; }
  .corp-quad-br {
    background: #fee2e2;
    border: 1px solid #fca5a5;
  }
  .corp-quad-br h4 { color: #991b1b; }
  
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
<!-- _class: corp-title -->

# Welcome to the Future

A bold vision for modern presentations

---

<!-- layout: section -->
<!-- _class: corp-section -->

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
<!-- _class: corp-table -->

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

<!-- layout: two-column -->
## Comparison

<div class="corp-2col">
<div class="corp-2col-panel">
<h3>Option A</h3>
<ul>
<li>Fast setup</li>
<li>Low cost</li>
<li>Community support</li>
</ul>
</div>
<div class="corp-2col-panel">
<h3>Option B</h3>
<ul>
<li>Enterprise features</li>
<li>SLA guarantee</li>
<li>Dedicated support</li>
</ul>
</div>
</div>

---

<!-- layout: three-column -->
## Three Pillars

<div class="corp-3col">
<div class="corp-3col-panel">
<h3>People</h3>
<ul>
<li>Collaboration</li>
<li>Empowerment</li>
<li>Growth</li>
</ul>
</div>
<div class="corp-3col-panel">
<h3>Process</h3>
<ul>
<li>Agile</li>
<li>CI/CD</li>
<li>Automation</li>
</ul>
</div>
<div class="corp-3col-panel">
<h3>Technology</h3>
<ul>
<li>Cloud-native</li>
<li>Microservices</li>
<li>AI-powered</li>
</ul>
</div>
</div>

---

<!-- layout: statistics -->
## Impact at a Glance

<div class="corp-stat-box">
<div>
<div class="corp-stat-number">99.9%</div>
<div class="corp-stat-label">Uptime</div>
</div>
<div>
<div class="corp-stat-number">2.5M</div>
<div class="corp-stat-label">Users</div>
</div>
<div>
<div class="corp-stat-number">150ms</div>
<div class="corp-stat-label">Avg Latency</div>
</div>
<div>
<div class="corp-stat-number">4.8★</div>
<div class="corp-stat-label">Rating</div>
</div>
</div>

<p>Data as of Q4 2025</p>

---

<!-- layout: process -->
## Development Workflow

<div class="corp-process-steps">
<div class="corp-process-step">
<div class="corp-process-step-number">1</div>
<div class="corp-process-step-label">Plan</div>
</div>
<div class="corp-process-arrow">→</div>
<div class="corp-process-step">
<div class="corp-process-step-number">2</div>
<div class="corp-process-step-label">Develop</div>
</div>
<div class="corp-process-arrow">→</div>
<div class="corp-process-step">
<div class="corp-process-step-number">3</div>
<div class="corp-process-step-label">Test</div>
</div>
<div class="corp-process-arrow">→</div>
<div class="corp-process-step">
<div class="corp-process-step-number">4</div>
<div class="corp-process-step-label">Deploy</div>
</div>
</div>

---

<!-- layout: agenda -->
## Today's Agenda

<div class="corp-agenda">
<div class="corp-agenda-item">
<span class="corp-agenda-num">01</span>
<div class="corp-agenda-content"><strong>Introduction</strong><span class="corp-agenda-dur">10 min</span></div>
</div>
<div class="corp-agenda-item">
<span class="corp-agenda-num">02</span>
<div class="corp-agenda-content"><strong>Market Analysis</strong><span class="corp-agenda-dur">20 min</span></div>
</div>
<div class="corp-agenda-item">
<span class="corp-agenda-num">03</span>
<div class="corp-agenda-content"><strong>Product Roadmap</strong><span class="corp-agenda-dur">30 min</span></div>
</div>
<div class="corp-agenda-item">
<span class="corp-agenda-num">04</span>
<div class="corp-agenda-content"><strong>Q&A</strong><span class="corp-agenda-dur">15 min</span></div>
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

<div class="corp-split">

<div class="corp-split-content">

- Ingest
- Process
- Serve

</div>

![img-morph-1](https://picsum.photos/1280/720)

</div>

<!-- _footer: Diagram credit: picsum.photos -->

---

<!-- layout: highlight-box -->
<div class="corp-highlight">
<h3>Key Takeaway</h3>
<p>Simplicity and clarity are the foundations of effective communication.</p>
</div>

---

<!-- layout: quote -->
<!-- _class: corp-quote -->

> The best way to predict the future is to invent it.
>
> — Alan Kay

A guiding principle for innovation.

---

<!-- _class: img-fullscreen -->
<!-- _paginate: false -->
<!-- _header: "" -->
<!-- _footer: "" -->

![img-morph-2](https://picsum.photos/1280/720)

---

<!-- layout: image-center -->
<!-- _class: corp-img-center -->

## Workflow Snapshot

<div class="corp-image-center-wrap">

![img-morph-2 h:400](https://picsum.photos/1280/720)

</div>

Step-by-step overview.

<!-- _footer: Figure 1 -->

---

<!-- layout: big-statement -->
<!-- _class: corp-statement -->

# Less is More

The power of simplicity in design

---

<!-- layout: sidebar -->
## Architecture Overview

<div class="corp-sidebar-layout">
<div class="corp-sidebar-main">

The system uses a **microservices** architecture with event-driven communication.

- API Gateway handles routing
- Each service owns its data

</div>
<div class="corp-sidebar">
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

<div class="corp-progress-container">
<div class="corp-progress-item">
<div class="corp-progress-header"><span class="corp-progress-label">Frontend</span><span class="corp-progress-value">85/100</span></div>
<div class="corp-progress-track"><div class="corp-progress-fill" style="width:85%"></div></div>
</div>
<div class="corp-progress-item">
<div class="corp-progress-header"><span class="corp-progress-label">Backend</span><span class="corp-progress-value">70/100</span></div>
<div class="corp-progress-track"><div class="corp-progress-fill" style="width:70%"></div></div>
</div>
<div class="corp-progress-item">
<div class="corp-progress-header"><span class="corp-progress-label">Testing</span><span class="corp-progress-value">45/100</span></div>
<div class="corp-progress-track"><div class="corp-progress-fill" style="width:45%"></div></div>
</div>
<div class="corp-progress-item">
<div class="corp-progress-header"><span class="corp-progress-label">Documentation</span><span class="corp-progress-value">30/100</span></div>
<div class="corp-progress-track"><div class="corp-progress-fill" style="width:30%"></div></div>
</div>
</div>

<p>Updated weekly</p>

---

<!-- layout: chart-bar -->
## Revenue by Region

<div class="corp-chart-bar-container">
<div class="corp-chart-bar-row">
<span class="corp-chart-bar-label">North America</span>
<div class="corp-chart-bar-track"><div class="corp-chart-bar-fill" style="width:100%"></div></div>
<span class="corp-chart-bar-value">450</span>
</div>
<div class="corp-chart-bar-row">
<span class="corp-chart-bar-label">Europe</span>
<div class="corp-chart-bar-track"><div class="corp-chart-bar-fill" style="width:84%"></div></div>
<span class="corp-chart-bar-value">380</span>
</div>
<div class="corp-chart-bar-row">
<span class="corp-chart-bar-label">Asia Pacific</span>
<div class="corp-chart-bar-track"><div class="corp-chart-bar-fill" style="width:64%"></div></div>
<span class="corp-chart-bar-value">290</span>
</div>
<div class="corp-chart-bar-row">
<span class="corp-chart-bar-label">Latin America</span>
<div class="corp-chart-bar-track"><div class="corp-chart-bar-fill" style="width:27%"></div></div>
<span class="corp-chart-bar-value">120</span>
</div>
</div>

<p>In millions USD, FY2025</p>

---

<!-- layout: pull-quote -->
<!-- _class: corp-pull-quote -->

<div class="corp-pull-quote-wrap">
<p class="corp-pull-quote-text">Design is not just what it looks like. Design is how it works.</p>
<p class="corp-pull-quote-attr">— Steve Jobs</p>
<p class="corp-pull-quote-ctx">From a 2003 New York Times interview</p>
</div>

---

<!-- layout: quadrant -->
## Priority Matrix

<div class="corp-quadrant">
<div class="corp-quad corp-quad-tl">
<h4>High Impact / Low Effort</h4>
<ul>
<li>Quick wins</li>
<li>Automation tasks</li>
</ul>
</div>
<div class="corp-quad corp-quad-tr">
<h4>High Impact / High Effort</h4>
<ul>
<li>Major features</li>
<li>Platform migration</li>
</ul>
</div>
<div class="corp-quad corp-quad-bl">
<h4>Low Impact / Low Effort</h4>
<ul>
<li>Minor fixes</li>
<li>UI tweaks</li>
</ul>
</div>
<div class="corp-quad corp-quad-br">
<h4>Low Impact / High Effort</h4>
<ul>
<li>Legacy cleanup</li>
<li>Over-engineering</li>
</ul>
</div>
</div>
