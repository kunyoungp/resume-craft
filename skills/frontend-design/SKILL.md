---
name: frontend-design
description: This skill should be used when generating a resume with template set to "custom" in preferences.json, when the user asks to "design a custom resume", "create a template-free resume", "make my resume look unique", or when building resume HTML from scratch without a pre-made template.
version: 0.1.0
---

# Resume Frontend Design

Generate visually distinctive, print-ready resume HTML with intentional design choices. This skill provides design guidance when no pre-built template is used — it ensures custom resumes have the same visual quality as the built-in templates.

**When this activates:** The resume-drafter agent invokes this skill when `preferences.json` has `"template": "custom"`. It replaces the template-reading step with a from-scratch design process.

---

## Design Process

Before writing any HTML/CSS, make three decisions:

1. **Aesthetic direction** — Pick one of the 5 presets below, or let the user describe their own. Commit fully to one direction.
2. **Font pairing** — Select a display + body font combination from the curated list.
3. **Color palette** — Define 6-8 CSS custom properties that form a cohesive palette.

Then build the HTML with embedded CSS following the rules in this skill.

---

## Typography: Google Fonts Pairings

Load fonts via `<link>` tags in `<head>`. Every pairing includes a display font (headings, name) and a body font (content, bullets). Always include a fallback stack.

### Curated Pairings

| Pair | Display Font | Body Font | Mood |
|---|---|---|---|
| A | Playfair Display (700) | Source Sans 3 (400, 600) | Elegant editorial |
| B | Space Grotesk (500, 700) | IBM Plex Sans (400, 500) | Technical precision |
| C | DM Serif Display (400) | DM Sans (400, 500, 700) | Balanced warmth |
| D | Libre Baskerville (400, 700) | Karla (400, 500, 700) | Scholarly clarity |
| E | Sora (600, 700) | Source Sans 3 (400, 600) | Modern confidence |
| F | Cormorant Garamond (500, 700) | Libre Franklin (400, 500) | Refined luxury |
| G | EB Garamond (400, 700) | Inter (400, 500) | Classic intellect |
| H | Poiret One (400) | Raleway (400, 500, 600) | Art deco flair |

### Font Rules

- Body text: 12-13px for readability, never below 11px
- Name/heading: 28-56px depending on aesthetic (brutalist = larger, classic = moderate)
- Dates and labels: can use a monospace accent font (IBM Plex Mono, JetBrains Mono) for contrast
- Fallback stack must include a sensible system font: `serif` for serif pairings, `sans-serif` for sans pairings
- ATS constraint: the rendered text must be selectable and parseable regardless of font styling

### Google Fonts `<link>` Pattern

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Display+Font:wght@400;700&family=Body+Font:wght@400;500&display=swap" rel="stylesheet">
```

---

## Color Palette: CSS Custom Properties

Define all colors as CSS custom properties on `:root`. Every resume needs these 7 variables at minimum:

```css
:root {
  --primary: /* headings, accent elements */;
  --primary-light: /* tinted backgrounds, hover states */;
  --accent: /* secondary accent — lines, decorative elements */;
  --text: /* body text */;
  --text-muted: /* dates, labels, secondary info */;
  --surface: /* page background */;
  --border: /* dividers, rules */;
}
```

### Palette Rules

- Body text contrast: minimum 4.5:1 against `--surface` (WCAG AA)
- Accent colors: use sparingly — one dominant + one accent outperforms three competing colors
- Print safety: all colors must render with `print-color-adjust: exact` and remain legible on white paper
- Dark mode resumes: lighten the background in `@media print` to save ink (e.g., `#0f1419` screen -> `#1a2030` print)

---

## Spatial Composition

### Page Constraints

```css
@page { size: A4; margin: 0; }

body {
  max-width: 794px; /* A4 at 96dpi */
  margin: 0 auto;
  /* Handle margins via padding since export-pdf.mjs uses zero margins */
}
```

### Vertical Rhythm

Pick a base unit (8px recommended) and use multiples for all spacing:

- Section gaps: 3-4 units (24-32px)
- Entry gaps within sections: 2 units (16px)
- Line height: 1.5-1.65 for body, 1.1-1.2 for headings
- Padding: header 4-5 units, content area 3-5 units horizontal

### Layout Rules

- **Single-column** for ATS compatibility (the default)
- Two-column (sidebar) only for creative/design roles — and only when the user explicitly wants it
- Contact info in the document body, not in CSS-positioned headers
- Standard section headers that ATS parsers recognize

---

## Atmosphere and Texture via CSS

Create visual depth without external images. All techniques below work in Playwright Chromium PDF export.

### Techniques That Work in PDF

**Subtle background patterns:**
```css
/* Micro dot grid */
background-image: radial-gradient(circle, #00000008 1px, transparent 1px);
background-size: 20px 20px;

/* Diagonal pinstripes */
background-image: repeating-linear-gradient(
  45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 11px
);

/* Blueprint grid */
background-image:
  repeating-linear-gradient(0deg, rgba(88,166,255,0.04) 0px, transparent 1px, transparent 50px),
  repeating-linear-gradient(90deg, rgba(88,166,255,0.04) 0px, transparent 1px, transparent 50px);
```

**Paper texture (for light themes):**
```css
background-color: #fffefa;
background-image: radial-gradient(ellipse at 20% 50%, rgba(0,0,0,0.01) 0%, transparent 70%);
```

**Embossed text effect:**
```css
text-shadow: 0 1px 0 rgba(255,255,255,0.8), 0 -1px 0 rgba(0,0,0,0.1);
```

**Decorative dividers (diamond + line):**
```css
.divider { position: relative; border-top: 1px solid var(--border); }
.divider::before {
  content: '';
  position: absolute;
  top: -4px; left: 50%;
  width: 7px; height: 7px;
  background: var(--accent);
  transform: translateX(-50%) rotate(45deg);
}
```

**Gradient wash at page top:**
```css
body::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 200px;
  background: linear-gradient(to bottom, var(--primary-light), transparent);
  pointer-events: none;
}
```

### Techniques to AVOID (break in PDF)

- `backdrop-filter` — inconsistent rendering
- `background-attachment: fixed` — breaks in print
- External image URLs — unreliable in offline/PDF contexts
- Large SVG data URIs — bloat file size
- `position: fixed` elements — break in paginated output
- `filter: blur()` on large areas — performance issues in PDF

---

## Print-Safe Design Rules

Every custom resume must include these print rules:

```css
@page { size: A4; margin: 0; }

html {
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

@media print {
  body { max-width: none; }
  .no-print { display: none !important; }
  a { color: inherit; text-decoration: none; }
  section { break-inside: avoid; }
  .entry { break-inside: avoid; }

  /* Disable screen-only animations */
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
  }
}
```

Google Fonts load correctly in Playwright Chromium because the export script waits for network idle before rendering.

---

## ATS Compatibility

Even with distinctive visual design, these rules are mandatory:

- Single-column layout (unless the user explicitly wants a creative/sidebar layout)
- No `<table>` elements for content layout
- Standard section headers: "Experience", "Education", "Skills", "Projects", "Summary"
- Contact information in the document body (not hidden in CSS pseudo-elements)
- Standard bullet characters (disc, not custom Unicode)
- Body text at 11-13px / 10-12pt
- Text must be selectable — no text-as-decoration via CSS content property for real content
- Both acronym and full form for technical terms

---

## Aesthetic Presets

When the user chooses "custom" template mode, present these presets. Each is a complete design system.

### 1. Swiss Precision

**Mood:** Clinical elegance, maximum typography impact, nothing wasted.

- **Fonts:** Space Grotesk (headings) + IBM Plex Mono (dates/labels) + IBM Plex Sans (body)
- **Palette:**
  ```css
  :root {
    --primary: #000000;
    --primary-light: #f5f5f5;
    --accent: #ef4444;
    --text: #1a1a1a;
    --text-muted: #6b7280;
    --surface: #ffffff;
    --border: #e5e5e5;
  }
  ```
- **Signature:** Name at 48-56px with -2px letter-spacing. Red 3px vertical bar on left edge. Section headers in monospace 10px uppercase, 4px+ letter-spacing. Hairline 0.5px rules. Extreme whitespace.
- **Skills:** Flowing comma-separated monospace text, not pills or tags.

### 2. Editorial Luxe

**Mood:** High-end magazine layout, warm authority, refined confidence.

- **Fonts:** Playfair Display (headings) + Source Sans 3 (body)
- **Palette:**
  ```css
  :root {
    --primary: #1e3a5f;
    --primary-light: #e8f0fe;
    --accent: #c9a84c;
    --text: #2d3748;
    --text-muted: #718096;
    --surface: #fffefa;
    --border: #d4c5a9;
  }
  ```
- **Signature:** Name in Playfair Display with generous letter-spacing. Gold accent lines and decorative elements. Subtle paper-texture background. Double-line section dividers. Skills in refined bordered pills.

### 3. Dark Architecture

**Mood:** Technical precision, engineering aesthetic, blueprint-inspired.

- **Fonts:** Space Grotesk (headings) + Inter (body) + JetBrains Mono (dates/labels)
- **Palette:**
  ```css
  :root {
    --primary: #58a6ff;
    --primary-light: rgba(88, 166, 255, 0.08);
    --accent: #3fb950;
    --text: #c9d1d9;
    --text-muted: #8b949e;
    --surface: #0f1419;
    --border: #21262d;
  }
  ```
- **Signature:** Dark background with blueprint grid overlay (repeating-linear-gradient). Name with subtle blue glow (text-shadow). Dates in JetBrains Mono. Dotted separators between entries. Skills in dark bordered pills with subtle glow on hover.
- **Print override:** Lighten `--surface` to `#1a2030` in `@media print`.

### 4. Warm Modernist

**Mood:** Approachable yet polished, contemporary without being cold.

- **Fonts:** DM Serif Display (headings) + DM Sans (body)
- **Palette:**
  ```css
  :root {
    --primary: #c45d3e;
    --primary-light: #fdf2ee;
    --accent: #2d3748;
    --text: #1a202c;
    --text-muted: #718096;
    --surface: #fefcfa;
    --border: #e8e0d8;
  }
  ```
- **Signature:** Terracotta accent color for headings and decorative elements. Soft rounded corners (4px) on skill tags. Gentle box-shadows for depth. Warm gradient tints on section backgrounds. Body text in DM Sans for clean readability.

### 5. Academic Classic

**Mood:** Scholarly elegance, Oxford press, intellectual gravitas.

- **Fonts:** Libre Baskerville (headings) + Karla (body)
- **Palette:**
  ```css
  :root {
    --primary: #8b0000;
    --primary-light: #fdf2f2;
    --accent: #2c3e50;
    --text: #1a1a1a;
    --text-muted: #555555;
    --surface: #fffef9;
    --border: #c9c2b0;
  }
  ```
- **Signature:** Drop cap on summary paragraph via `::first-letter` (larger, crimson, float left). `font-variant: small-caps` on section headers. Warm ivory background. Decorative double-line dividers. Crimson left-border accent on key sections.

---

## Web-Only Micro-Interactions

Add these for browser preview; they are disabled in `@media print`:

```css
@media screen {
  .entry { transition: background-color 0.2s ease; }
  .entry:hover { background-color: var(--primary-light); }

  .skill-tag { transition: transform 0.15s ease; }
  .skill-tag:hover { transform: scale(1.05); }

  section h2 {
    transition: padding-left 0.2s ease;
  }
  section h2:hover {
    padding-left: 4px;
  }
}
```

Keep interactions subtle and purposeful. One well-chosen hover effect is better than animating everything.

---

## Template Comment Annotations

When building custom HTML, include the same comment annotations used by the built-in templates so the resume-drafter agent can understand the structure:

```html
<!-- {{basics.name}}, {{basics.email}}, {{basics.phone}}, {{basics.url}} -->
<!-- {{basics.location.city}}, {{basics.location.region}} -->
<!-- {{basics.profiles}} -- array of {network, url, username} -->
<!-- {{basics.summary}} -->
```

```css
/* {{skills}} -- array of {name, level, keywords[]} */
/* {{work}} -- array of {name, position, startDate, endDate, summary, highlights[]} */
/* {{education}} -- array of {institution, area, studyType, startDate, endDate, score} */
/* {{projects}} -- array of {name, description, highlights[], url} */
```

These comments are documentation for the drafter agent, not a templating engine. They indicate where each type of profile data belongs in the HTML structure.
