---
description: Generate a tailored resume and cover letter for a job application
argument-hint: [job-url-or-paste-text]
allowed-tools: ["Read", "Write", "Edit", "Bash", "AskUserQuestion", "Glob", "Grep", "Agent", "Skill", "WebFetch"]
---

Generate a tailored resume and cover letter for a specific job application. This command runs the full end-to-end pipeline automatically, only pausing for user input when genuinely needed.

## Design Principle: Minimize Interruptions

This command should feel like a single action, not a multi-step wizard. The rule is:

- **Auto-proceed** on decisions that have an obvious default or can be inferred
- **Only pause** when the user has information we can't infer (skill gaps, ambiguous language)
- **Never ask for confirmation** on something we can just show and move forward

## Prerequisites Check

1. Check if `~/.claude/resume-craft/profile.json` exists.
   - If NOT: tell the user "You need to set up your profile first. Run `/resume-profile` to get started." and STOP.
2. Check if `~/.claude/resume-craft/preferences.json` exists.
   - If NOT: use "modern" as the default template.

## Step 1: Get Job Description

If `$ARGUMENTS` is provided:
- If it looks like a URL (starts with http:// or https://): attempt to scrape it using `node ${CLAUDE_PLUGIN_ROOT}/scripts/scrape-job.mjs "$ARGUMENTS"`
  - If the script exits with code 0: use the output as the JD text
  - If it fails: ask the user to paste the job description text directly
- Otherwise: treat $ARGUMENTS as the beginning of pasted JD text. Ask the user if there's more.

If no arguments provided: ask the user to either provide a URL or paste the job description text.

## Step 2: Analyze, Match, and Confirm

Run these sub-steps as a continuous block, presenting results together in a single summary. Do NOT ask for confirmation between sub-steps.

### 2a. Job Description Analysis

Invoke the `resume-craft:job-analysis` skill. Extract role details, keywords, requirements, culture signals, industry classification, language, and gap analysis.

### 2b. Language Detection

Determine the output language from the JD analysis:
- **If language confidence is "clear":** Use the detected language. No need to ask.
- **If language confidence is "ambiguous":** This is a genuine question — ask the user which language to use.
- **If user's profile language differs from a clearly detected JD language:** Mention it briefly in the summary (e.g., "Writing in Korean based on the job posting") but do not ask for confirmation.

### 2c. Template Selection

Read `~/.claude/resume-craft/preferences.json` for the saved template.
- If a template is saved: use it silently.
- If no preference saved or set to "auto": auto-select based on the JD's industry classification. Do not ask.

### 2d. Match Analysis

Evaluate the gap analysis results and present a single consolidated summary to the user:

```
**[Company] — [Role Title]**
Language: [detected language] | Template: [selected template] | Match: [Strong/Moderate/Weak] (X/20 keywords)

Strong matches: [brief list]
Gaps: [list with severity]
```

**Then decide whether to pause or continue:**

- **Strong match (zero major gaps):** Print the summary and immediately proceed to Step 3. No pause needed.

- **Moderate match (1-2 major gaps):** Present all major gaps together in a single question, not one-by-one:

  "A couple of gaps before I draft — do you have any related experience with these?
  1. **[Skill A]** — [suggested transferable framing]
  2. **[Skill B]** — [suggested transferable framing]

  Reply with any relevant experience, or say 'skip' to proceed without."

  Wait for one response. Record clarifications. Proceed.

- **Weak match (3+ major gaps):** Show the summary with a brief heads-up:

  "This role has several gaps vs your profile. I'll do my best to highlight your strengths. A few quick questions — any related experience with:
  1. **[Skill A]** — ...
  2. **[Skill B]** — ...
  3. **[Skill C]** — ...

  Reply with anything relevant, or 'skip' to proceed as-is."

  Wait for one response. Record clarifications. Proceed.

**Minor gaps** (preferred/nice-to-have skills) are NOT asked about. Handle them silently — include them if the profile has partial coverage, omit if not.

### Pass Context Forward

After this step, the following data feeds into Step 3:
- JD analysis (keywords, requirements, responsibilities, culture)
- Confirmed output language
- Selected template
- Match verdict + strong matches + user-clarified gaps + confirmed gaps

## Step 3: Generate Resume and Cover Letter

This step runs automatically with no user interaction.

Read the user profile from `~/.claude/resume-craft/profile.json`.
Read the selected template from `${CLAUDE_PLUGIN_ROOT}/templates/{template}/index.html` (or custom path).
Read the cover letter profile from `~/.claude/resume-craft/cover-letter-profile.json` if it exists.

Invoke the `resume-craft:resume-generation` skill for writing guidelines.

### Resume

Generate the resume by:
1. Creating output directory: `~/.claude/resume-craft/outputs/YYYY-MM-DD-{company-name-slug}/`
2. Taking the template HTML and replacing all sample content with tailored content from the user's profile
3. Tailoring every bullet point to match JD keywords (target 65-75% keyword match)
4. Writing each bullet as: Action Verb + Task/Project + Quantified Result
5. Ensuring AI-avoidance rules are followed (reference: `@${CLAUDE_PLUGIN_ROOT}/skills/resume-generation/references/ai-avoidance.md`)
6. Saving as `resume.html` in the output directory

### Cover Letter

Always generate a cover letter alongside the resume — do not ask. If the user does not want it, they can simply not use the file.

- Generate using Problem-Solution format (250-400 words)
- Use the cover letter context from cover-letter-profile.json for tone and personal stories (if available)
- Reference specific company details from the JD analysis
- Save as `cover-letter.html` in the same output directory

## Step 4: Verify and Auto-Fix

Run verification automatically. Do not show the verification report unless there are unfixable issues.

Invoke the `resume-craft:verification` skill:

1. **Factual accuracy**: Cross-reference every claim against profile.json
2. **AI-detection scan**: Check for banned words, sentence pattern issues
3. **Professional quality**: Bullet format, keyword match rate, section ordering

**Auto-fix silently:** Rewrite banned words, adjust sentence patterns, fix keyword density — apply all fixes that are clearly corrections without asking.

**Re-verify** after auto-fixes to confirm they pass.

**Only pause if there are issues that cannot be auto-fixed** (e.g., factual discrepancies that need user judgment). In that case, list only the unfixable issues and ask for guidance.

## Step 5: Deliver

Open the resume and cover letter in the browser for preview:
```bash
node ${CLAUDE_PLUGIN_ROOT}/scripts/preview.mjs ~/.claude/resume-craft/outputs/{date}-{company}/resume.html
node ${CLAUDE_PLUGIN_ROOT}/scripts/preview.mjs ~/.claude/resume-craft/outputs/{date}-{company}/cover-letter.html
```

Export both to PDF:
```bash
node ${CLAUDE_PLUGIN_ROOT}/scripts/export-pdf.mjs \
  ~/.claude/resume-craft/outputs/{date}-{company}/resume.html \
  ~/.claude/resume-craft/outputs/{date}-{company}/resume.pdf
node ${CLAUDE_PLUGIN_ROOT}/scripts/export-pdf.mjs \
  ~/.claude/resume-craft/outputs/{date}-{company}/cover-letter.html \
  ~/.claude/resume-craft/outputs/{date}-{company}/cover-letter.pdf
```

Present the final output:

```
Done! Preview is open in your browser.

Files saved to: ~/.claude/resume-craft/outputs/{date}-{company}/
- resume.html / resume.pdf
- cover-letter.html / cover-letter.pdf

Let me know if you'd like any changes.
```

## Edit Loop (if user requests changes)

If the user requests edits after delivery:

1. Make the requested changes to the HTML
2. Re-run verification (at minimum Phase 2: AI-detection) and auto-fix silently
3. Re-export the PDF
4. Re-open the preview
5. Report: "Updated. Preview refreshed."

Continue until the user is satisfied.
