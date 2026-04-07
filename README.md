# resume-craft

A Claude Code plugin that generates custom, ATS-optimized resumes and cover letters tailored to specific job descriptions.

## Features

- **Job description analysis** — Extracts keywords, requirements, culture signals, and industry classification from any job posting (URL or pasted text)
- **Language matching** — Detects the job posting language and generates documents in the same language, with user confirmation for ambiguous cases
- **Match analysis** — Compares your profile against job requirements, classifies gaps by severity, and interactively clarifies missing skills before drafting
- **ATS optimization** — Targets 65-75% keyword match rate using exact JD phrasing, proper formatting, and standard section headers
- **AI-detection avoidance** — Enforces banned-word lists, sentence length variation, and natural tone to avoid AI-generated patterns
- **6 built-in templates** — minimal, professional, modern, academic, creative, executive — each designed for specific industries
- **Cover letter generation** — Problem-solution format with specific hooks, achievement stories, and confident closings
- **Three-phase verification** — Factual accuracy check, AI-detection scan, and professional quality audit before delivery
- **PDF export** — Browser-rendered PDF output via Playwright

## Prerequisites

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI or IDE extension
- [Node.js](https://nodejs.org/) 18+
- [Playwright](https://playwright.dev/) (for PDF export only)

## Installation

### Option 1: Add as a plugin dependency

In your project's `.claude/settings.json`:

```json
{
  "plugins": [
    "https://github.com/<your-username>/resume-craft"
  ]
}
```

### Option 2: Clone locally

```bash
git clone https://github.com/<your-username>/resume-craft.git
```

Then add the local path to your Claude Code settings:

```json
{
  "plugins": [
    "/path/to/resume-craft"
  ]
}
```

### Install script dependencies (for PDF export)

```bash
cd resume-craft/scripts
npm install
npx playwright install chromium
```

## Usage

### 1. Build your profile

```
/resume-profile
```

Walks you through a guided Q&A to build your professional profile. Saved to `~/.claude/resume-craft/profile.json` using the [JSON Resume](https://jsonresume.org/) schema.

### 2. Browse templates

```
/resume-templates
```

Preview and select from 6 built-in templates optimized for different industries.

### 3. Generate a resume

```
/resume https://example.com/job-posting
```

Or paste the job description directly:

```
/resume
```

The entire pipeline runs automatically from a single command:
1. Analyzes the job description (keywords, requirements, culture, language)
2. Only pauses if there are major skill gaps to clarify or ambiguous language
3. Generates a tailored resume AND cover letter
4. Runs three-phase verification and auto-fixes issues
5. Opens browser preview and exports PDF
6. Ready for edits if you want changes

## End-to-End Flow

The following diagram shows how the full pipeline works when you run `/resume`:

```
┌─────────────────┐
│  1. Build       │  /resume-profile
│     Profile     │  Guided Q&A → profile.json (JSON Resume schema)
│                 │  Collects: work history, skills, education,
│                 │  cover letter tone & personal stories
└────────┬────────┘
         │ profile.json + cover-letter-profile.json
         ▼
┌─────────────────┐
│  2. Get Job     │  URL → scrape-job.mjs → plain text
│     Description │  or paste text directly
└────────┬────────┘
         │ raw JD text
         ▼
┌─────────────────┐
│  3. Job         │  job-analysis skill
│     Analysis    │  Extracts: role basics, required/preferred skills,
│                 │  responsibilities, ATS keywords (top 20),
│                 │  culture signals, industry classification,
│                 │  language detection, experience level
└────────┬────────┘
         │ structured JD analysis
         ▼
┌─────────────────┐
│  4. Match &     │  Compare profile vs JD requirements
│     Confirm     │  • Language: auto-detect or ask if ambiguous
│                 │  • Template: auto-select by industry or use saved pref
│                 │  • Gap analysis: classify major/minor gaps
│                 │  • Strong match → proceed automatically
│                 │  • Moderate/Weak → ask about gaps in one batch
└────────┬────────┘
         │ confirmed language + template + gap clarifications
         ▼
┌─────────────────┐
│  5. Generate    │  resume-drafter agent + resume-generation skill
│     Resume &    │  Resume: profile data → template HTML, tailored bullets,
│     Cover Letter│  65-75% keyword match, AI-avoidance rules
│                 │  Cover letter: problem-solution format, 250-400 words,
│                 │  specific hooks + achievement stories
└────────┬────────┘
         │ resume.html + cover-letter.html
         ▼
┌─────────────────┐
│  6. Verify &    │  resume-verifier agent + verification skill
│     Auto-Fix    │  Phase 1: Factual accuracy (cross-ref profile.json)
│                 │  Phase 2: AI-detection scan (banned words, rhythm)
│                 │  Phase 3: Professional quality (bullets, keywords,
│                 │           section order, length)
│                 │  Auto-fix issues → re-verify → only pause if unfixable
└────────┬────────┘
         │ verified documents
         ▼
┌─────────────────┐
│  7. Deliver     │  Browser preview via preview.mjs
│                 │  PDF export via export-pdf.mjs (Playwright)
│                 │  Edit loop: user requests changes → re-generate →
│                 │  re-verify → re-export until satisfied
└─────────────────┘
```

### Key design decisions

- **Minimal interruptions** — the pipeline auto-proceeds on obvious defaults and only pauses for genuine ambiguity (skill gaps, mixed-language JDs)
- **Gap clarification is batched** — all major gaps are presented in a single question, not one-by-one
- **Verification is silent on success** — auto-fixes banned words, sentence rhythm, and keyword density without showing a report unless issues require user judgment
- **Cover letter is always generated** — users can simply ignore the file if they don't need it

## Templates

| Template | Best For | Style |
|---|---|---|
| `minimal` | Tech, engineering, software | Swiss brutalist, monospace accents, red vertical accent |
| `professional` | Business, finance, consulting | Cormorant Garamond serif, paper texture, bronze accents |
| `modern` | General roles, startups, product | Neo-editorial magazine layout, navy + amber palette |
| `academic` | Research, education, academia | EB Garamond, drop caps, scholarly crimson accents |
| `creative` | Design, marketing, creative | Art Deco geometric, dark sidebar, gold metallic accents |
| `executive` | Senior leadership, C-suite, VP+ | Dark mode architectural blueprint, grid overlay |

## Plugin Structure

```
resume-craft/
├── .claude-plugin/plugin.json   # Plugin metadata
├── agents/
│   ├── resume-drafter.md        # Resume/cover letter generation agent
│   └── resume-verifier.md       # Quality verification agent (read-only)
├── commands/
│   ├── resume.md                # /resume — main generation command
│   ├── resume-profile.md        # /resume-profile — profile builder
│   └── resume-templates.md      # /resume-templates — template browser
├── skills/
│   ├── frontend-design/         # Custom template design guidance
│   ├── job-analysis/            # JD parsing and keyword extraction
│   ├── profile-builder/         # Q&A flow for profile building
│   ├── resume-generation/       # Writing rules + reference files
│   │   └── references/
│   │       ├── action-verbs.md
│   │       ├── ai-avoidance.md
│   │       └── ats-optimization.md
│   └── verification/            # Three-phase quality gate
├── templates/                   # 6 HTML resume templates
├── scripts/
│   ├── scrape-job.mjs           # Job URL → plain text
│   ├── export-pdf.mjs           # HTML → PDF via Playwright
│   └── preview.mjs              # Open HTML in browser
├── data/schema.json             # JSON Resume schema
└── hooks/hooks.json             # Profile context hook
```

## How It Works

### Match Analysis

Before generating anything, the plugin compares your profile against the job requirements:

- **Strong match** (70%+ keywords, no major gaps) — proceeds directly to drafting
- **Moderate match** (50-69% keywords or 1-2 major gaps) — asks you about each gap to find related experience
- **Weak match** (<50% keywords or 3+ major gaps) — warns you and asks if you want to proceed

Any experience you provide during gap clarification is incorporated into the resume using transferable-skill framing.

### Language Detection

The plugin detects the job posting's language and writes your resume in the same language. If the language is ambiguous (mixed-language posting), it asks you to choose. Technical terms and proper nouns stay in their original form regardless of target language.

### Verification

Every document passes three checks:
1. **Factual accuracy** — every claim traced back to your profile
2. **AI-detection scan** — banned words, sentence rhythm, naturalness
3. **Professional quality** — bullet format, keyword match rate, section ordering

## Data Storage

All user data is stored locally:

```
~/.claude/resume-craft/
├── profile.json              # Your professional profile
├── cover-letter-profile.json # Cover letter tone and stories
├── preferences.json          # Template selection
└── outputs/
    └── YYYY-MM-DD-company/   # Generated documents
        ├── resume.html
        ├── resume.pdf
        ├── cover-letter.html
        └── cover-letter.pdf
```

## License

MIT
