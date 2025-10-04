---
marp: true
theme: academic
header: Demo
---

# Marp MCP Server

AI-Powered Presentation Creation with MCP

**Version 0.3.0**

<!-- _class: lead -->

---

# Overview
## What is Marp MCP?

<!-- _class: section -->

---

## What is Marp MCP?

- MCP server for creating Marp presentations
- Optimized for Claude Code and AI assistants
- Provides structured layouts for academic slides
- Two main tools: list_layouts & manage_slide
- Built on Model Context Protocol (MCP)
- NPM package: @masaki39/marp-mcp

---

# Available Layouts
## 7 Built-in Templates

<!-- _class: section -->

---

## Layout Types

- title - Title slide with maroon heading
- section - Section divider (centered)
- list - Bullet points (max 8 items)
- table - Tables with center-tiny style
- two-column - Side-by-side content
- image-right - Image on right side
- image-center - Centered image layout

---

## Layout Parameters

| Layout | Key Parameters | Max Items |
|--------|----------------|----------|
| title | heading, content | - |
| section | title, subtitle | - |
| list | heading, list | 8 |
| table | heading, tableMarkdown | 7 rows |
| two-column | heading, left, right | - |
| image-right | heading, content, imageUrl | - |
| image-center | heading, imageUrl, width, height | - |

All layouts support optional citations parameter

<!-- _class: table-center table-tiny -->

---

## How to Use

> > ### Setup
> > 
> > - Install via npx
> > - Add to MCP config
> > - Claude Code ready
> > - No build required
>
> > ### Benefits
> > 
> > - AI-powered slides
> > - Academic styling
> > - Fast prototyping
> > - Easy customization

---

## Image Center Layout Demo

![center h:350](https://picsum.photos/600/350)

Centered image with fixed height (h:350)

---

## Image Right

- Background image
- Right side (50%)
- Contains mode
- List on left
- Good for visuals

![bg right:50% contain](https://picsum.photos/400/600)

---

# Get Started with Marp MCP!

**GitHub**: github.com/masaki39/marp-mcp
**NPM**: @masaki39/marp-mcp
**Marp**: marp.app

Thank you!

<!-- _class: lead -->