---
description: Browse and select a resume template
allowed-tools: ["Read", "Write", "Bash", "AskUserQuestion", "Glob"]
---

Help the user browse and select a resume template for their resumes.

Available templates are in `${CLAUDE_PLUGIN_ROOT}/templates/`:

| Template | Best For | Style |
|---|---|---|
| **minimal** | Tech, engineering, software | Single-column, monochrome, sans-serif, skills prominent |
| **professional** | Business, finance, consulting | Serif headings, traditional layout, formal, navy accents |
| **modern** | General roles, startups, product | Teal accent header, clean sans-serif, balanced |
| **academic** | Research, education, academia | Dense, serif, publication-focused, minimal decoration |
| **creative** | Design, marketing, creative | Two-column sidebar, bold colors, visual hierarchy |
| **executive** | Senior leadership, C-suite, VP+ | Elegant, generous whitespace, serif headings, gold accents |

**Steps:**

1. Ask the user about their profession or industry. Or if they just want to see all templates.

2. Based on their answer, suggest the most appropriate template(s) with reasoning.

3. For each template the user wants to preview:
   - Read the template HTML from `${CLAUDE_PLUGIN_ROOT}/templates/{name}/index.html`
   - Write it to a temporary location: `/tmp/resume-craft-preview-{name}.html`
   - Open it in the browser: `open /tmp/resume-craft-preview-{name}.html` (macOS)
   - Tell the user which template they're viewing

4. Ask which template they want to use. They can also provide a path to their own custom HTML template.

5. Save the selection to `~/.claude/resume-craft/preferences.json`:
   ```json
   {
     "template": "modern",
     "customTemplatePath": null
   }
   ```
   If custom template: set `"template": "custom"` and `"customTemplatePath": "/path/to/template.html"`

6. Confirm the selection to the user.
